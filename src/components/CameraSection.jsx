import { useEffect, useRef, useState } from 'react';
import SplitReveal from './SplitReveal';
import Reveal from './Reveal';
import GlowRing from './GlowRing';
import { useMouseRef } from '../context/MouseContext';
import { createRenderer, disposeRenderer, fitRenderer } from '../three/common';
import { createGearScene, frameGear } from '../three/gear';
import { ACCENT, gear } from '../data/content';

function onScreen(el, pad = 180) {
  if (!el) return false;
  const b = el.getBoundingClientRect();
  return b.bottom > -pad && b.top < window.innerHeight + pad;
}

function Gear3DBand() {
  const wrapRef = useRef(null);
  const canvasMountRef = useRef(null);
  const mouse = useMouseRef();
  const [labels, setLabels] = useState(null);
  const [ready, setReady] = useState(false);

  // Lazy-mount the three.js scene only once the band is within ~2 viewport
  // heights of the fold, matching the site's mobile-performance pass.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: '200% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const wrap = wrapRef.current;
    const mount = canvasMountRef.current;
    if (!wrap || !mount) return undefined;

    const { scene, camera, items } = createGearScene(ACCENT);
    const renderer = createRenderer(mount, 1.35);
    fitRenderer(renderer, camera, mount);
    setLabels(frameGear(camera, items));

    const resizeObs = new ResizeObserver(() => {
      fitRenderer(renderer, camera, mount);
      setLabels(frameGear(camera, items));
    });
    resizeObs.observe(mount);

    let raf;
    let t0 = performance.now();
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - t0) / 1000);
      t0 = t;
      const elapsed = t / 1000;
      if (!onScreen(wrap)) return;
      items.forEach((o, i) => {
        o.rotation.y += dt * (o.userData.spin || 0.3);
        o.position.y = (o.userData.baseY || 0) + Math.sin(elapsed * 0.9 + i * 1.7) * 0.1;
        o.rotation.x = Math.sin(elapsed * 0.5 + i) * 0.05 - mouse.current.y * 0.06;
        if (o.userData.payload) o.userData.payload.rotation.z = Math.sin(elapsed * 0.8) * 0.09;
      });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      disposeRenderer(renderer);
    };
  }, [ready, mouse]);

  const labelNames = ['Cámara', 'Gimbal', 'Iluminación'];

  return (
    <div
      ref={wrapRef}
      className="gear-band"
      style={{
        position: 'relative', width: '100%', borderRadius: 20, overflow: 'hidden',
        background: 'linear-gradient(160deg,rgba(255,255,255,.045),rgba(255,255,255,.012))', border: '1px solid rgba(255,255,255,.09)'
      }}
    >
      <div ref={canvasMountRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {labelNames.map((name, i) => {
          const l = labels && labels[i];
          const style = { position: 'absolute', whiteSpace: 'nowrap', fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.55 };
          if (!l) {
            style.bottom = 'clamp(16px,2.4vw,28px)';
            style.left = `${16 + i * 34}%`;
            style.transform = 'translateX(-50%)';
          } else if (l.vertical) {
            style.left = '50%';
            style.top = `${(l.top * 100).toFixed(2)}%`;
            style.transform = 'translate(-50%,-50%)';
          } else {
            style.left = `${(l.left * 100).toFixed(2)}%`;
            style.bottom = 'clamp(16px,2.4vw,28px)';
            style.transform = 'translateX(-50%)';
          }
          return (
            <span key={name} style={style}>
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CameraSection() {
  return (
    <section id="camara" style={{ position: 'relative', padding: 'clamp(90px,15vh,180px) clamp(20px,5vw,60px) clamp(80px,12vh,150px)', color: '#F4F1EC', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(40px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(28px,4vw,70px)', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>03</span>
              <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
              <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Detrás de cámara</span>
            </div>
            <SplitReveal as="h2" className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.4rem,6.4vw,5.6rem)', lineHeight: 0.92, letterSpacing: '-.04em', textWrap: 'balance' }}>
              El encuadre empieza mucho antes del corte.
            </SplitReveal>
          </div>
          <p style={{ margin: 0, maxWidth: '34em', fontSize: 'clamp(1.02rem,1.4vw,1.28rem)', lineHeight: 1.7, opacity: 0.78, textWrap: 'pretty' }}>
            No solo edito: también filmo. Domino el manejo técnico de cámaras profesionales de video y foto — incluyendo sistemas mirrorless —, opero
            gimbal para tomas estabilizadas, y controlo audio e iluminación en set.
          </p>
        </div>

        <Gear3DBand />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 'clamp(14px,1.8vw,24px)' }}>
          {gear.map((g, i) => (
            <Reveal
              key={g.n}
              index={i}
              className="gear-card"
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, padding: 'clamp(22px,2.4vw,30px)', borderRadius: 16, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.09)', overflow: 'hidden' }}
            >
              <GlowRing variant="edge" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <span className="clash" style={{ color: ACCENT, fontSize: '.82rem', letterSpacing: '.18em' }}>{g.n}</span>
                <span style={{ width: 34, height: 1, background: 'currentColor', opacity: 0.25, display: 'block' }} />
              </div>
              <span className="clash" style={{ fontWeight: 600, fontSize: 'clamp(1.08rem,1.5vw,1.32rem)', lineHeight: 1.15, letterSpacing: '-.015em' }}>{g.title}</span>
              <span style={{ fontSize: '.92rem', lineHeight: 1.6, opacity: 0.66 }}>{g.desc}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
