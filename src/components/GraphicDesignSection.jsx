import { motion } from 'framer-motion';
import { revealVariants } from '../motion/reveal';
import GlowRing from './GlowRing';
import { ACCENT, gfxCols } from '../data/content';

function GfxCard({ item, index }) {
  return (
    <motion.div
      className="gfx-card"
      data-cursor="view"
      {...revealVariants(index)}
      whileHover={{ scale: 1.015, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }}
      style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: 'rgba(12,11,10,.06)', border: '1px solid rgba(12,11,10,.10)' }}
    >
      <img loading="lazy" decoding="async" src={item.src} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: item.ratio, background: 'rgba(12,11,10,.06)' }} />
      <GlowRing />
      <div
        className="gfx-cap"
        style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,10,10,.42)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
        }}
      >
        <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(244,241,236,.4)', borderRadius: 8, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#F4F1EC', textAlign: 'center', padding: 20 }}>
          <span className="clash" style={{ fontSize: 'clamp(1.1rem,1.8vw,1.5rem)', fontWeight: 500, letterSpacing: '-.015em' }}>{item.title}</span>
          <span style={{ color: ACCENT, fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase' }}>{item.kind}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function GraphicDesignSection() {
  return (
    <section id="diseno" style={{ position: 'relative', padding: 'clamp(90px,15vh,180px) clamp(20px,5vw,60px)', color: '#F4F1EC' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(36px,5vw,60px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>08</span>
              <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
              <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Diseño gráfico</span>
            </div>
            <h2 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2rem,4.6vw,3.9rem)', lineHeight: 0.96, letterSpacing: '-.035em' }}>DISEÑO FLYERS</h2>
          </div>
          <p style={{ margin: 0, maxWidth: '26em', fontSize: '.98rem', lineHeight: 1.65, opacity: 0.6 }}>
            Packaging, campañas inmobiliarias y branding de producto. Composición, retoque y dirección de arte.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 'clamp(14px,1.6vw,24px)', alignItems: 'start' }}>
          {gfxCols.map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,1.6vw,24px)', marginTop: col.offset }}>
              {col.items.map((p, i) => (
                <GfxCard key={p.src} item={p} index={ci * 2 + i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
