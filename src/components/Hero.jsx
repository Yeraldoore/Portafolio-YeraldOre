import { useRef } from 'react';
import Magnetic from './Magnetic';
import Avatar3D from './Avatar3D';
import { bindEngineRef } from '../engine/refs';
import { ACCENT, CONTACT } from '../data/content';

const marqueeItems = ['Motion graphics', 'Edición', 'Storytelling', 'IA aplicada', 'Diseño sonoro', 'Dirección de foto'];

function MarqueeRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34, paddingRight: 34, fontWeight: 500, letterSpacing: '-.01em', opacity: 0.82, whiteSpace: 'nowrap' }} className="clash">
      {marqueeItems.map((t) => (
        <span key={t} style={{ display: 'contents' }}>
          <span>{t}</span>
          <span style={{ color: ACCENT }}>✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const avatarWrapOuterRef = useRef(null);

  return (
    <section
      id="hero"
      style={{
        position: 'relative', minHeight: '100svh', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,330px),1fr))', alignItems: 'center',
        gap: 'clamp(20px,3vw,50px)', padding: 'clamp(110px,15vh,180px) clamp(20px,5vw,60px) 0', color: '#F4F1EC'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px,2.4vw,32px)', maxWidth: 780 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 36, height: 1, background: 'currentColor', opacity: 0.45, display: 'block' }} />
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.65 }}>
            EDITOR AUDIOVISUAL · FILMMAKER · LIMA, PERÚ
          </span>
        </div>
        <h1
          className="glitch-name clash"
          style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.6rem,6.8vw,7.6rem)', lineHeight: 0.86, letterSpacing: '-.04em' }}
        >
          Yeraldo
          <br />
          <span style={{ color: ACCENT }}>&ldquo;Bishop&rdquo;</span> Ore
        </h1>
        <p style={{ margin: 0, maxWidth: '33em', fontSize: 'clamp(1rem,1.35vw,1.22rem)', lineHeight: 1.65, opacity: 0.72, textWrap: 'pretty' }}>
          Convierto material en bruto e ideas en piezas audiovisuales con intención. Motion graphics, narrativa y edición potenciada con IA.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 6 }}>
          <Magnetic
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener"
            data-cursor="link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, padding: '17px 34px', borderRadius: 999,
              background: 'linear-gradient(135deg,#F0D6A6 0%,#E6C48D 45%,#C9A365 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55),inset 0 -10px 22px rgba(151,110,49,.35),0 14px 44px rgba(230,196,141,.22)',
              color: '#0A0A0A', fontSize: 12, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase'
            }}
          >
            Contáctame
          </Magnetic>
          <a
            href="#video"
            data-cursor="link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, color: 'inherit', fontSize: 12,
              letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.72, padding: '16px 4px', borderBottom: '1px solid currentColor'
            }}
          >
            Ver portafolio
          </a>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'min(78svh,720px)', paddingLeft: 'clamp(0px,5vw,96px)' }}>
        <div
          style={{
            position: 'absolute', width: '78%', aspectRatio: '1/1', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(230,196,141,.20) 0%,rgba(230,196,141,.06) 42%,transparent 68%)', filter: 'blur(6px)'
          }}
        />
        <div ref={avatarWrapOuterRef} className="avatar-wrap">
          <div ref={bindEngineRef('avatarWrap')} style={{ position: 'absolute', inset: 0 }}>
            <Avatar3D outerRef={avatarWrapOuterRef} />
          </div>
        </div>
      </div>

      <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 'clamp(24px,5vh,60px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.5 }}>
          <span style={{ position: 'relative', width: 18, height: 28, border: '1px solid currentColor', borderRadius: 10, display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: 6, left: '50%', width: 2, height: 5, borderRadius: 2, background: 'currentColor', animation: 'yoDot 1.8s infinite ease-out' }} />
          </span>
          Desliza
        </div>
        <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.5 }}>2026 — Portafolio</div>
      </div>

      <div
        style={{
          gridColumn: '1/-1', position: 'relative', margin: 'clamp(28px,5vh,60px) calc(-1 * clamp(20px,5vw,60px)) 0',
          padding: '16px 0', overflow: 'hidden', borderTop: '1px solid rgba(244,241,236,.12)', borderBottom: '1px solid rgba(244,241,236,.12)'
        }}
      >
        <div style={{ display: 'flex', width: 'max-content', animation: 'yoMarquee 34s linear infinite', fontSize: 'clamp(1.1rem,2.1vw,1.9rem)' }}>
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
}
