import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useBreakpoints } from '../hooks/useBreakpoints';
import VideoCard from './VideoCard';
import DocumentalStage from './DocumentalStage';
import { ACCENT, reel, cats } from '../data/content';

// The horizontal "Reel / Destacados" row pins the section and scrubs its
// scroll-x against page scroll on desktop (GSAP ScrollTrigger); on narrow
// screens it just becomes a normal horizontally-scrollable strip.
export default function VideoPortfolioSection() {
  const wrapRef = useRef(null);
  const rowRef = useRef(null);
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    const wrap = wrapRef.current;
    const row = rowRef.current;
    if (!wrap || !row) return undefined;
    let trig;
    gsap.set(row, { x: 0 });

    if (!isMobile) {
      wrap.style.overflowX = 'hidden';
      const dist = () => Math.max(0, row.scrollWidth - window.innerWidth + 80);
      const tween = gsap.to(row, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap, start: 'top top', end: () => `+=${dist() + 300}`,
          pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
          // This pin adds ~2.8k px of spacer above the Documental stage further
          // down the same section. On refresh ScrollTrigger reverts every pin,
          // measures, then re-applies — so whichever trigger measures first sees
          // the page without the other's spacer. Refreshing this one first (higher
          // priority wins) means the stage below always measures against a page
          // that already includes this spacer.
          refreshPriority: 1
        }
      });
      trig = tween.scrollTrigger;
    } else {
      wrap.style.overflowX = 'auto';
      wrap.style.webkitOverflowScrolling = 'touch';
    }
    ScrollTrigger.refresh();

    return () => {
      if (trig) trig.kill(true);
      gsap.set(row, { clearProps: 'transform' });
    };
  }, [isMobile]);

  return (
    <section id="video" style={{ position: 'relative', color: '#F4F1EC' }}>
      <div ref={wrapRef} style={{ position: 'relative', height: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div ref={rowRef} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px,2.4vw,40px)', padding: '0 clamp(20px,5vw,60px)', willChange: 'transform' }}>
          <div style={{ flex: 'none', width: 'min(88vw,430px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>05</span>
              <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
              <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Portafolio de video</span>
            </div>
            <h2 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.94, letterSpacing: '-.035em' }}>
              Reel /<br />Destacados
            </h2>
            <p style={{ margin: 0, fontSize: '.98rem', lineHeight: 1.65, opacity: 0.62, maxWidth: '26em' }}>
              Una selección de piezas donde el ritmo, el color y el sonido hacen el trabajo pesado.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.45 }}>
              <span style={{ color: ACCENT }}>→</span> Sigue desplazándote
            </div>
          </div>
          {reel.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} showPlayLabel frameInset={14} frameRadius={8} style={{ flex: 'none', width: 'min(86vw,640px)' }} />
          ))}
        </div>
      </div>

      {/* "Documental" gets the pull-back stage instead of a card row, so it is
          rendered outside the max-width column to run full-bleed. The other
          categories keep the original grid untouched. */}
      {cats.map((c) =>
        c.label === 'Documental' ? (
          <DocumentalStage key={c.label} video={c.videos[0]} note={c.note} count={c.count} />
        ) : (
          <div key={c.label} style={{ padding: 'clamp(70px,10vh,130px) clamp(20px,5vw,60px)', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(20px,2.6vw,34px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
              <h3 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(1.4rem,2.8vw,2.3rem)', lineHeight: 1, letterSpacing: '-.025em' }}>{c.label}</h3>
              {c.note && <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.45 }}>{c.note}</span>}
              <span style={{ flex: 1, minWidth: 20, height: 1, background: 'currentColor', opacity: 0.14 }} />
              <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.2em' }}>{c.count}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: 'clamp(14px,1.6vw,22px)' }}>
              {c.videos.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} radius={12} frameRadius={7} />
              ))}
            </div>
          </div>
        )
      )}
    </section>
  );
}
