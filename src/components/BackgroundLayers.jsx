import { useEffect, useRef } from 'react';
import { bindEngineRef } from '../engine/refs';
import { useBreakpoints } from '../hooks/useBreakpoints';

const CONIC = 'conic-gradient(from var(--angle),#ff2d95,#7b2ff7,#2d9cff,#2dffb0,#ffd02d,#ff2d95)';

function makeGrainDataUrl() {
  const c = document.createElement('canvas');
  c.width = c.height = 140;
  const ctx = c.getContext('2d');
  const d = ctx.createImageData(140, 140);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  return c.toDataURL();
}

// Every fixed, full-viewport decorative layer of the page: the world-color
// backdrop the scroll engine paints, a generated film-grain texture, the
// drifting bokeh blobs (whose overall opacity the scroll engine also
// drives), a soft vignette, and the animated conic "glow" border around the
// whole viewport.
export default function BackgroundLayers() {
  const grainRef = useRef(null);
  const { isTouch } = useBreakpoints();

  useEffect(() => {
    if (grainRef.current) grainRef.current.style.backgroundImage = `url(${makeGrainDataUrl()})`;
  }, []);

  return (
    <>
      <div ref={bindEngineRef('bg')} style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundColor: '#0A0A0A' }} />
      <div
        ref={grainRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.055,
          mixBlendMode: 'overlay',
          backgroundRepeat: 'repeat'
        }}
      />
      <div
        ref={bindEngineRef('bokeh')}
        aria-hidden="true"
        style={{ position: 'fixed', inset: '-12%', zIndex: 1, pointerEvents: 'none', overflow: 'hidden', opacity: 1, transition: 'opacity .6s ease' }}
      >
        <div style={{ position: 'absolute', left: '4%', top: '8%', width: '36vw', height: '36vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,45,149,.42) 0%,rgba(255,45,149,.13) 45%,transparent 70%)', filter: 'blur(72px)', animation: 'yoBokehA 28s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', right: '-2%', top: '16%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,156,255,.42) 0%,rgba(45,156,255,.12) 45%,transparent 70%)', filter: 'blur(66px)', animation: 'yoBokehB 33s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '28%', bottom: '-8%', width: '42vw', height: '42vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(123,47,247,.4) 0%,rgba(123,47,247,.12) 45%,transparent 70%)', filter: 'blur(84px)', animation: 'yoBokehC 39s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', right: '18%', bottom: '12%', width: '20vw', height: '20vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(45,255,176,.34) 0%,transparent 68%)', filter: 'blur(60px)', animation: 'yoBokehA 25s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', left: '8%', top: '44%', width: '18vw', height: '18vw', borderRadius: '50%', border: '2.8vw solid rgba(255,208,45,.26)', filter: 'blur(28px)', animation: 'yoBokehB 31s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', right: '7%', top: '62%', width: '14vw', height: '14vw', borderRadius: '50%', border: '2.2vw solid rgba(45,156,255,.26)', filter: 'blur(24px)', animation: 'yoBokehC 35s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', left: '-3%', top: '66%', display: 'flex', gap: '1vw', filter: 'blur(22px)', animation: 'yoBokehC 36s ease-in-out infinite' }}>
          <span style={{ width: '2.2vw', height: '11vh', borderRadius: '.5vw', background: 'rgba(244,241,236,.14)', display: 'block' }} />
          <span style={{ width: '2.2vw', height: '11vh', borderRadius: '.5vw', background: 'rgba(244,241,236,.11)', display: 'block' }} />
          <span style={{ width: '2.2vw', height: '11vh', borderRadius: '.5vw', background: 'rgba(244,241,236,.08)', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', right: '14%', top: '30%', display: 'flex', alignItems: 'flex-end', gap: '.8vw', filter: 'blur(20px)', animation: 'yoBokehA 30s ease-in-out infinite reverse' }}>
          <span style={{ width: '1vw', height: '4vh', borderRadius: '99px', background: 'rgba(255,45,149,.34)', display: 'block' }} />
          <span style={{ width: '1vw', height: '8vh', borderRadius: '99px', background: 'rgba(255,208,45,.3)', display: 'block' }} />
          <span style={{ width: '1vw', height: '5vh', borderRadius: '99px', background: 'rgba(45,255,176,.3)', display: 'block' }} />
          <span style={{ width: '1vw', height: '11vh', borderRadius: '99px', background: 'rgba(45,156,255,.28)', display: 'block' }} />
        </div>
      </div>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% 40%,transparent 45%,rgba(0,0,0,.45) 100%)' }} />

      {!isTouch && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0, zIndex: 400, pointerEvents: 'none', boxSizing: 'border-box', padding: 3,
              background: CONIC,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              filter: 'blur(5px)', opacity: 0.85, animation: 'yoSpin 7s linear infinite'
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0, zIndex: 400, pointerEvents: 'none', boxSizing: 'border-box', padding: 1,
              background: CONIC,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0.6, animation: 'yoSpin 7s linear infinite'
            }}
          />
        </>
      )}
    </>
  );
}
