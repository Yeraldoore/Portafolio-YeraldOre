import { useEffect, useRef } from 'react';
import Reveal from './Reveal';
import SplitReveal from './SplitReveal';
import Typewriter from './Typewriter';
import { gsap } from '../lib/gsap';
import { ACCENT, achievements, education, aboutParagraph } from '../data/content';

export default function AboutSection() {
  const sectionRef = useRef(null);
  const colARef = useRef(null);
  const colBRef = useRef(null);

  // The section materialises out of depth as the hero dissolves ahead of it.
  // This only governs how the section arrives — the columns are plain wrappers,
  // so the Reveal/SplitReveal/Typewriter animations inside them keep running
  // untouched (and, being Framer-owned, must not share an element with GSAP).
  useEffect(() => {
    const section = sectionRef.current;
    const cols = [colARef.current, colBRef.current];
    if (!section || cols.some((c) => !c)) return undefined;

    const mm = gsap.matchMedia();
    mm.add(
      { reduce: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' },
      (context) => {
        // Reduced motion: a plain fade in, no depth, no scaling.
        const from = context.conditions.reduce ? { opacity: 0 } : { opacity: 0, z: -420, scale: 0.86 };
        const to = context.conditions.reduce ? { opacity: 1 } : { opacity: 1, z: 0, scale: 1 };
        gsap.fromTo(cols, from, {
          ...to,
          ease: 'none',
          stagger: 0.25,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 35%',
            scrub: true,
            invalidateOnRefresh: true,
            // Below the hero pin (3), whose spacer sits above this section.
            refreshPriority: 2
          }
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="sobre-mi" style={{ position: 'relative', padding: 'clamp(90px,16vh,190px) clamp(20px,5vw,60px)', color: '#F4F1EC' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(32px,5vw,90px)', maxWidth: 1400, margin: '0 auto', perspective: 1100 }}>
        <div ref={colARef} style={{ display: 'flex', flexDirection: 'column', gap: 22, willChange: 'transform, opacity' }}>
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

        <div ref={colBRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(26px,3vw,40px)', willChange: 'transform, opacity' }}>
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
