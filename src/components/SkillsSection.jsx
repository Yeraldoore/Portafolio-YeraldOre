import Reveal from './Reveal';
import SplitReveal from './SplitReveal';
import Meter from './Meter';
import { ACCENT, skills } from '../data/content';
import { rgba } from '../utils/color';

export default function SkillsSection() {
  return (
    <section id="habilidades" style={{ position: 'relative', padding: 'clamp(90px,15vh,180px) clamp(20px,5vw,60px)', color: '#F4F1EC' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(36px,5vw,64px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>02</span>
              <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
              <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Habilidades</span>
            </div>
            <SplitReveal as="h2" className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2rem,4.6vw,3.9rem)', lineHeight: 0.96, letterSpacing: '-.035em' }}>
              Herramientas que domino
            </SplitReveal>
          </div>
          <p style={{ margin: 0, maxWidth: '28em', fontSize: '.98rem', lineHeight: 1.65, opacity: 0.6 }}>
            Flujo de trabajo completo: desde el guion y el rodaje hasta el corte final, el motion y el sonido.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,330px),1fr))', gap: 'clamp(14px,1.6vw,22px)' }}>
          {skills.map((s, i) => (
            <Reveal
              key={s.name}
              index={i}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, padding: '24px 26px', borderRadius: 16,
                background: 'rgba(255,255,255,.035)',
                border: s.highlight ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,.08)',
                boxShadow: s.highlight ? `0 0 0 1px ${rgba(ACCENT, 0.35)}, 0 18px 50px ${rgba(ACCENT, 0.16)}, inset 0 0 40px ${rgba(ACCENT, 0.07)}` : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                <span className="clash" style={{ fontWeight: 600, fontSize: 'clamp(1.02rem,1.5vw,1.28rem)', letterSpacing: '-.01em' }}>{s.name}</span>
                <span style={{ flex: 'none', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.55 }}>{s.level}</span>
              </div>
              <Meter pct={s.pct} />
            </Reveal>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, paddingTop: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', opacity: 0.5 }}>Habilidades complementarias</span>
          <span style={{ flex: 1, minWidth: 20, height: 1, background: 'currentColor', opacity: 0.14 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ padding: '10px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,.16)', fontSize: '.85rem' }}>Guionismo</span>
            <span style={{ padding: '10px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,.16)', fontSize: '.85rem' }}>Diseño sonoro</span>
          </div>
        </div>
      </div>
    </section>
  );
}
