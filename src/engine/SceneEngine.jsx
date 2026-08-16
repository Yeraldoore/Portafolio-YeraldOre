import { useEffect } from 'react';
import { worlds } from '../data/content';
import { mix } from '../utils/color';
import { getEngineRef, engineState } from './refs';
import { startPreviewManager } from './previewManager';

function prog(el, startFrac, endFrac) {
  if (!el) return 0;
  const vh = window.innerHeight;
  const top = el.getBoundingClientRect().top;
  const a = vh * startFrac;
  const b = vh * endFrac;
  return Math.max(0, Math.min(1, (a - top) / (a - b)));
}

// Drives every continuous, scroll-linked visual on the page from a single
// requestAnimationFrame loop: the background/header color crossfade between
// sections, the bokeh layer's opacity (bright on light sections, strong on
// dark ones), hero parallax fade, the "MÚSICA" ghost-text parallax, and the
// social-ads 3D ring (auto-rotate, drag inertia, front-face highlighting).
export default function SceneEngine() {
  useEffect(() => {
    const s = engineState;
    const stopPreview = startPreviewManager();

    const stage = getEngineRef('ringStage');
    let dragOff = () => {};
    if (stage) {
      const down = (e) => {
        s.dragging = true;
        s.dragMoved = 0;
        s.dragX = e.clientX;
        s.ringVel = 0;
        stage.style.cursor = 'grabbing';
      };
      const move = (e) => {
        if (!s.dragging) return;
        const dx = e.clientX - s.dragX;
        s.dragX = e.clientX;
        s.dragMoved += Math.abs(dx);
        s.ringRot += dx * 0.32;
        s.ringVel = dx * 6;
      };
      const up = () => {
        if (!s.dragging) return;
        s.dragging = false;
        stage.style.cursor = 'grab';
        setTimeout(() => {
          s.dragMoved = 0;
        }, 60);
      };
      const onEnter = () => {
        s.ringHover = true;
      };
      const onLeave = () => {
        s.ringHover = false;
      };
      stage.addEventListener('pointerdown', down);
      stage.addEventListener('mouseenter', onEnter);
      stage.addEventListener('mouseleave', onLeave);
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
      dragOff = () => {
        stage.removeEventListener('pointerdown', down);
        stage.removeEventListener('mouseenter', onEnter);
        stage.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
    }

    const onResize = () => {
      s.ringR = window.innerWidth < 900 ? 280 : 520;
    };
    window.addEventListener('resize', onResize);

    function onScreen(el, pad) {
      if (!el) return false;
      const b = el.getBoundingClientRect();
      return b.bottom > -(pad || 120) && b.top < window.innerHeight + (pad || 120);
    }

    function spinRing(dt) {
      const car = getEngineRef('car');
      const ringStage = getEngineRef('ringStage');
      if (!car) return;
      if (!onScreen(ringStage, 300)) return;
      if (s.dragging) {
        s.ringVel *= 0.9;
      } else {
        if (s.ringVel) {
          s.ringRot += s.ringVel * dt;
          s.ringVel *= Math.pow(0.06, dt);
          if (Math.abs(s.ringVel) < 1) s.ringVel = 0;
        }
        if (!s.ringHover) s.ringRot += dt * 6.5;
      }
      const p = Math.max(0, Math.min(1, s.socialP));
      const ease = 1 - Math.pow(1 - p, 2.2);
      const tilt = 22 - 30 * ease + (s.ringDrift - 0.5) * 14;
      const z = -s.ringR - 420 * (1 - ease);
      if (ringStage) ringStage.style.opacity = String(Math.min(1, ease * 1.3));
      car.style.opacity = '1';
      car.style.transform = `translateZ(${z}px) rotateX(${tilt}deg) rotateY(${s.ringRot}deg)`;
      if (!s.ringCards || s.ringCards.length !== car.children.length) {
        s.ringCards = Array.prototype.slice.call(car.children);
      }
      s.ringCards.forEach((el) => {
        const base = parseFloat(el.getAttribute('data-ringcard') || '0');
        const c = Math.cos(((base + s.ringRot) * Math.PI) / 180);
        const f = Math.max(0, c);
        el.style.opacity = String(0.08 + Math.pow(f, 0.55) * 0.92);
        el.style.filter = `brightness(${0.42 + f * 0.58})`;
        el.style.pointerEvents = c > 0.3 ? 'auto' : 'none';
      });
    }

    function applyMus() {
      const wrap = document.getElementById('musicales');
      if (!wrap) return;
      const cards = wrap.querySelectorAll('[data-m3d]');
      const n = cards.length;
      if (!n) return;
      const p = Math.max(0, Math.min(1, s.musP));
      const k = 1 - p;
      const ease = 1 - Math.pow(k, 2);
      cards.forEach((el, i) => {
        const side = i - (n - 1) / 2;
        el.style.transform =
          `translate3d(${side * 90 * (1 - ease)}px,${34 * (1 - ease)}px,${-(300 + Math.abs(side) * 110) * (1 - ease)}px) ` +
          `rotateY(${-side * 34 * (1 - ease)}deg) rotateX(${9 * (1 - ease)}deg)`;
        el.style.opacity = String(Math.min(1, Math.max(0, p * 1.5 - Math.abs(side) * 0.08)));
      });
    }

    function worldTick() {
      const vh = window.innerHeight;

      const soc = document.getElementById('social');
      if (soc) {
        s.socialP = prog(soc, 0.92, 0.22);
        const b = soc.getBoundingClientRect();
        s.ringDrift = Math.max(0, Math.min(1, (vh - b.top) / (vh + b.height)));
      }

      const mus = document.getElementById('musicales');
      if (mus) {
        const p = prog(mus, 0.88, 0.24);
        if (p !== s.musP) {
          s.musP = p;
          applyMus();
        }
        const b = mus.getBoundingClientRect();
        const dp = Math.max(0, Math.min(1, (vh - b.top) / (vh + b.height)));
        const ghost = getEngineRef('ghost');
        if (ghost) {
          ghost.style.transform = `translate(-50%,-50%) translate3d(${(dp - 0.5) * -140}px,${(dp - 0.5) * 70}px,0)`;
        }
      }

      const hero = document.getElementById('hero');
      if (hero) {
        const hp = prog(hero, 0, -0.7);
        const inner = hero.firstElementChild;
        const tr = `translate3d(0,${-70 * hp}px,0)`;
        const op = String(1 - 0.75 * hp);
        if (inner) {
          inner.style.transform = tr;
          inner.style.opacity = op;
        }
        const av = getEngineRef('avatarWrap');
        if (av) {
          av.style.transform = tr;
          av.style.opacity = op;
        }
      }

      let bg = worlds[0].bg;
      let headFg = worlds[0].fg;
      for (let i = 1; i < worlds.length; i++) {
        const el = document.getElementById(worlds[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const p = Math.max(0, Math.min(1, (vh * 0.8 - top) / (vh * 0.58)));
        const secColor = mix(worlds[i - 1].fg, worlds[i].fg, p);
        if (el.style.color !== secColor) el.style.color = secColor;
        if (p > 0) bg = mix(worlds[i - 1].bg, worlds[i].bg, p);
        const hp = Math.max(0, Math.min(1, (vh * 0.16 - top) / (vh * 0.14)));
        if (hp > 0) headFg = mix(worlds[i - 1].fg, worlds[i].fg, hp);
      }
      const bgEl = getEngineRef('bg');
      if (bgEl) bgEl.style.backgroundColor = bg;
      const headerEl = getEngineRef('header');
      if (headerEl) {
        headerEl.style.color = headFg;
        headerEl.style.background = `linear-gradient(to bottom,${bg.replace('rgb(', 'rgba(').replace(')', ',.72)')} 0%,${bg
          .replace('rgb(', 'rgba(')
          .replace(')', ',.42)')} 65%,${bg.replace('rgb(', 'rgba(').replace(')', ',0)')} 100%)`;
      }
      const bokehEl = getEngineRef('bokeh');
      if (bokehEl) {
        const n = (bg.match(/\d+/g) || [10, 10, 10]).map(Number);
        const lum = (n[0] * 0.299 + n[1] * 0.587 + n[2] * 0.114) / 255;
        const op = lum > 0.5 ? 0.28 : 1 - lum * 1.1;
        const str = op.toFixed(2);
        if (bokehEl.style.opacity !== str) bokehEl.style.opacity = str;
      }
    }

    let raf = null;
    let t0 = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - t0) / 1000);
      t0 = t;
      worldTick();
      spinRing(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      dragOff();
      stopPreview();
    };
  }, []);

  return null;
}
