import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { createRenderer, disposeRenderer, fitRenderer } from '../three/common';
import { buildIntroCamera, animateIntroCamera } from '../three/introCamera';
import { ACCENT } from '../data/content';

// Full-screen intro: a rotating low-poly cine camera (three.js) behind a
// time-based percentage counter, then a quick scale + white-flash exit once
// loading completes (or after a 1.4s safety timeout either way).
export default function Loader({ onDone }) {
  const camWrapRef = useRef(null);
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const loaderRef = useRef(null);
  const flashRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let renderer;
    let raf;
    let resizeObs;
    const wrap = camWrapRef.current;

    if (wrap) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.55, 7.4);
      camera.lookAt(0, 0, 0);
      const group = buildIntroCamera(scene, ACCENT);
      renderer = createRenderer(wrap);
      fitRenderer(renderer, camera, wrap);

      let t0 = performance.now();
      const loop = (t) => {
        const dt = Math.min(0.05, (t - t0) / 1000);
        t0 = t;
        animateIntroCamera(group, t / 1000, dt);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      resizeObs = new ResizeObserver(() => fitRenderer(renderer, camera, wrap));
      resizeObs.observe(wrap);
    }

    const dur = 2600;
    const t0p = Date.now();
    let safety;

    const finish = () => {
      const el = loaderRef.current;
      const flash = flashRef.current;
      const done = () => {
        setHidden(true);
        if (raf) cancelAnimationFrame(raf);
        disposeRenderer(renderer);
        if (resizeObs) resizeObs.disconnect();
        ScrollTrigger.refresh();
        if (onDone) onDone();
      };
      if (el && flash) {
        gsap
          .timeline()
          .to(el, { scale: 1.06, duration: 0.3, ease: 'power2.in' }, 0)
          .to(flash, { opacity: 1, duration: 0.11, ease: 'power2.in' }, 0.22)
          .set(el, { opacity: 0, pointerEvents: 'none' })
          .to(flash, { opacity: 0, duration: 0.6, ease: 'power2.out' })
          .add(done);
        safety = setTimeout(done, 1400);
      } else {
        done();
      }
    };

    const interval = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0p) / dur);
      const e = 1 - Math.pow(1 - p, 2.4);
      if (pctRef.current) pctRef.current.textContent = String(Math.round(e * 100));
      if (barRef.current) barRef.current.style.width = `${e * 100}%`;
      if (p >= 1) {
        clearInterval(interval);
        finish();
      }
    }, 70);

    return () => {
      clearInterval(interval);
      clearTimeout(safety);
      if (raf) cancelAnimationFrame(raf);
      disposeRenderer(renderer);
      if (resizeObs) resizeObs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 900, background: '#0A0A0A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10
      }}
    >
      <div ref={camWrapRef} style={{ width: 'min(56vw,420px)', height: 'min(42svh,340px)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <span ref={pctRef} className="clash" style={{ fontSize: 'clamp(2.6rem,7vw,4.6rem)', fontWeight: 600, lineHeight: 0.9, letterSpacing: '-.04em', color: ACCENT }}>
          0
        </span>
        <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.5, paddingBottom: 10 }}>%</span>
      </div>
      <div style={{ position: 'relative', width: 'min(56vw,300px)', height: 1, background: 'rgba(244,241,236,.16)', overflow: 'hidden' }}>
        <div ref={barRef} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '0%', background: ACCENT }} />
      </div>
      <span style={{ marginTop: 14, fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', opacity: 0.35 }}>Cargando portafolio</span>
      <div ref={flashRef} style={{ position: 'fixed', inset: 0, background: '#fff', opacity: 0, pointerEvents: 'none' }} />
    </div>
  );
}
