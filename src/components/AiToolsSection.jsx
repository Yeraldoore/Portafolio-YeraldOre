import Reveal from './Reveal';
import SplitReveal from './SplitReveal';
import GlowRing from './GlowRing';
import ToolLogo from './ToolLogo';
import VideoCard from './VideoCard';
import { ACCENT, aiTools, aiVideos } from '../data/content';

// Staggered column offsets so the AI reel reads as a composition rather than a
// flat grid — and so it stays visually distinct from the camera marquee and the
// social-ads ring elsewhere on the page.
const OFFSETS = [0, 54, 22, 76];

export default function AiToolsSection() {
  return (
    <section id="ia" style={{ position: 'relative', padding: 'clamp(90px,15vh,180px) clamp(20px,5vw,60px)', color: '#F4F1EC', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(38px,5vw,68px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>07</span>
              <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
              <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Inteligencia artificial</span>
            </div>
            <SplitReveal as="h2" className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2rem,4.8vw,4rem)', lineHeight: 0.95, letterSpacing: '-.035em', textWrap: 'balance' }}>
              IA como parte del proceso creativo
            </SplitReveal>
          </div>
          <p style={{ margin: 0, maxWidth: '28em', fontSize: '.98rem', lineHeight: 1.65, opacity: 0.6 }}>
            Uso herramientas de IA para generar imagen, video y recursos visuales, y para acelerar la ideación sin perder la dirección creativa.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 'clamp(14px,1.6vw,22px)' }}>
          {aiTools.map((t, i) => (
            <Reveal
              key={t.name}
              index={i}
              className="ai-card"
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, padding: 'clamp(20px,2.2vw,28px)',
                borderRadius: 16, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.09)', overflow: 'hidden'
              }}
            >
              <GlowRing />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <ToolLogo mark={t.mark} brand={t.brand} size={40} />
                <span className="clash" style={{ fontWeight: 600, fontSize: 'clamp(1.02rem,1.5vw,1.24rem)', letterSpacing: '-.015em' }}>{t.name}</span>
              </div>
              <span style={{ fontSize: '.9rem', lineHeight: 1.6, opacity: 0.64 }}>{t.desc}</span>
            </Reveal>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 'clamp(14px,1.6vw,22px)', alignItems: 'start' }}>
          {aiVideos.map((v, i) => (
            <div key={v.id} style={{ marginTop: OFFSETS[i % OFFSETS.length] }}>
              <VideoCard video={v} index={i} aspect="9/16" portrait radius={14} frameInset={10} frameRadius={8} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
