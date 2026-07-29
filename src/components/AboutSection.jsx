import Reveal from './Reveal';
import SplitReveal from './SplitReveal';
import Typewriter from './Typewriter';
import { ACCENT, achievements, education, aboutParagraph } from '../data/content';

export default function AboutSection() {
  return (
    <section id="sobre-mi" style={{ position: 'relative', padding: 'clamp(90px,16vh,190px) clamp(20px,5vw,60px)', color: '#F4F1EC' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(32px,5vw,90px)', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>01</span>
            <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
            <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Sobre mí</span>
          </div>
          <SplitReveal
            as="h2"
            className="clash"
            style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.1rem,5.2vw,4.4rem)', lineHeight: 0.95, letterSpacing: '-.035em', textWrap: 'balance' }}
          >
            Cuento historias con impacto visual.
          </SplitReveal>
          <div style={{ height: 1, background: 'currentColor', opacity: 0.14, marginTop: 8 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
            <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', opacity: 0.5 }}>Formación</span>
            {education.map((e) => (
              <div key={e} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '2px 0' }}>
                <span style={{ flex: 'none', width: 5, height: 5, borderRadius: '50%', background: ACCENT, marginTop: 9 }} />
                <span style={{ fontSize: '.95rem', lineHeight: 1.55, opacity: 0.78 }}>{e}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(26px,3vw,40px)' }}>
          <Reveal as="div">
            <Typewriter
              text={aboutParagraph}
              as="p"
              style={{ margin: 0, fontSize: 'clamp(1.05rem,1.5vw,1.35rem)', lineHeight: 1.72, opacity: 0.82, textWrap: 'pretty' }}
            />
          </Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {achievements.map((a, i) => (
              <Reveal
                key={a}
                index={i}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999,
                  border: '1px solid currentColor', fontSize: '.82rem', lineHeight: 1.3, letterSpacing: '.01em', maxWidth: '100%'
                }}
              >
                <span style={{ flex: 'none', width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                {a}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
