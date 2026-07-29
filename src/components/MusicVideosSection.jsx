import { bindEngineRef } from '../engine/refs';
import VideoCard from './VideoCard';
import { ACCENT, musicales } from '../data/content';

// Cards fly in from depth (rotateY + translateZ) as the section scrolls into
// view, driven by SceneEngine reading each `[data-m3d]` card's computed
// scroll progress — see `applyMus()` there. A giant, near-transparent
// "MÚSICA" wordmark drifts behind everything as a parallax backdrop.
export default function MusicVideosSection() {
  return (
    <section
      id="musicales"
      style={{
        position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 'clamp(30px,5vh,58px)', padding: 'clamp(90px,14vh,170px) clamp(20px,5vw,60px)', color: '#F4F1EC', overflow: 'hidden'
      }}
    >
      <div
        ref={bindEngineRef('ghost')}
        aria-hidden="true"
        className="clash"
        style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontWeight: 600,
          fontSize: 'clamp(5rem,21vw,18rem)', lineHeight: 1, letterSpacing: '-.05em', opacity: 0.055, whiteSpace: 'nowrap',
          pointerEvents: 'none', userSelect: 'none'
        }}
      >
        MÚSICA
      </div>

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>06</span>
            <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
            <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Videos musicales</span>
          </div>
          <h2 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2rem,4.8vw,4rem)', lineHeight: 0.95, letterSpacing: '-.035em' }}>Ritmo, color y corte</h2>
        </div>
        <p style={{ margin: 0, maxWidth: '26em', fontSize: '.98rem', lineHeight: 1.65, opacity: 0.6 }}>Piezas musicales donde el montaje sigue el pulso del track.</p>
      </div>

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto', width: '100%', perspective: 1300, perspectiveOrigin: '50% 50%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(16px,2vw,28px)', transformStyle: 'preserve-3d' }}>
          {musicales.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} radius={12} frameRadius={7} reveal={false} data-m3d="1" style={{ boxShadow: '0 30px 70px rgba(0,0,0,.5)', transformStyle: 'preserve-3d', willChange: 'transform' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
