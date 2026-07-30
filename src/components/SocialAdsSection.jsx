import { useMemo } from 'react';
import { bindEngineRef, engineState } from '../engine/refs';
import { useBreakpoints } from '../hooks/useBreakpoints';
import VideoCard from './VideoCard';
import { ACCENT, buildSocialRing } from '../data/content';

// A cylindrical 3D ring of vertical ad cards: auto-rotates, can be grabbed
// and spun by mouse/touch (with inertia on release — driven by SceneEngine),
// dims and disables pointer events on the back-facing cards, and reveals
// itself as the section scrolls into view.
export default function SocialAdsSection() {
  const { isMobile } = useBreakpoints();
  const radius = isMobile ? 250 : 480;
  const ring = useMemo(() => buildSocialRing(radius), [radius]);

  return (
    <section
      id="social"
      style={{
        position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 'clamp(26px,4vh,50px)', padding: 'clamp(90px,13vh,150px) 0', color: '#F4F1EC', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', padding: '0 clamp(20px,5vw,60px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>05</span>
          <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Social Ads</span>
        </div>
        <h2 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.1rem,5.6vw,4.4rem)', lineHeight: 0.94, letterSpacing: '-.04em' }}>
          Piezas que detienen<br />el scroll
        </h2>
        <p style={{ margin: 0, maxWidth: '30em', fontSize: '.98rem', lineHeight: 1.65, opacity: 0.6 }}>
          Formato vertical, primer segundo decisivo. Haz clic en cualquier pieza para reproducirla.
        </p>
      </div>

      <div
        ref={bindEngineRef('ringStage')}
        data-cursor="drag"
        style={{ position: 'relative', zIndex: 1, height: 'clamp(300px,54svh,540px)', perspective: 1500, perspectiveOrigin: '50% 46%', cursor: 'grab', touchAction: 'pan-y' }}
      >
        <div ref={bindEngineRef('car')} style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d', willChange: 'transform', opacity: 0 }}>
          {ring.map((v, i) => (
            <div
              key={`${v.id}-${i}`}
              data-ringcard={v.angle}
              style={{ position: 'absolute', left: 0, top: 0, width: 'clamp(140px,min(15vw,26svh),240px)', backfaceVisibility: 'hidden', transform: v.transform }}
            >
              <VideoCard
                video={v}
                aspect="9/16"
                radius={14}
                frameInset={10}
                frameRadius={8}
                portrait
                reveal={false}
                glowVariant="halo"
                className="ring-card"
                onBeforeOpen={() => engineState.dragMoved <= 6}
                style={{ width: '100%', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 34px 80px rgba(0,0,0,.55)' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.4 }}>
        <span style={{ color: ACCENT }}>◦</span> Arrastra para girarlo · clic para reproducir
      </div>
    </section>
  );
}
