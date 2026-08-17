import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import VideoCard from './VideoCard';
import { ACCENT } from '../data/content';

// Where the screen sits inside documentales-bg.jpg, as percentages of the
// image itself. Calibrated against the 1477x704 file — tweak here if the
// landing needs a nudge.
const SCREEN_TARGET = { left: 32.77, top: 28.55, width: 35.14, height: 41.05 };

// The background is upscaled to cover the frame, which leaves its screen edge
// softly resampled — landing exactly on SCREEN_TARGET therefore lets a ~2px
// green seam show around the video. Bleed a hair past the calibration to swallow
// it. In percentage points, and asymmetric because the frame is ~2.1:1, so a
// point of width covers about twice the pixels a point of height does. Set both
// to 0 to sit exactly on the measured rectangle.
const OVERSCAN = { x: 0.26, y: 0.44 };

const MEDIA_BOX = {
  left: SCREEN_TARGET.left - OVERSCAN.x,
  top: SCREEN_TARGET.top - OVERSCAN.y,
  width: SCREEN_TARGET.width + OVERSCAN.x * 2,
  height: SCREEN_TARGET.height + OVERSCAN.y * 2
};

// Native size of that background, used to lock the frame's aspect so the
// percentages above stay valid at any viewport shape.
const BG_W = 1477;
const BG_H = 704;

// Timeline landmarks, as a fraction of the pinned scroll.
const FIT_AT = 0.62; // media has landed in SCREEN_TARGET
const REVEAL_AT = 0.7; // background finished pulling back
const BLUR_FROM = 0.83; // phase 5 hand-off begins

export default function DocumentalStage({ video, note, count }) {
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const frameRef = useRef(null);
  const bgRef = useRef(null);
  const mediaRef = useRef(null);
  const copyRef = useRef(null);
  // Read by previewManager every tick, so the card keeps playing through the
  // whole choreography instead of being judged on its distance to the centre.
  const forcePreviewRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    const inner = innerRef.current;
    const bg = bgRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    if (!stage || !media) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 899px)'
      },
      (context) => {
        const { reduce, narrow } = context.conditions;

        // Reduced motion: show the end state — already fitted into the screen —
        // and skip the pin entirely.
        if (reduce) {
          gsap.set(media, { x: 0, y: 0, scale: 1, clearProps: 'pointerEvents' });
          gsap.set(bg, { scale: 1, filter: 'blur(0px)' });
          gsap.set(inner, { opacity: 1, filter: 'blur(0px)' });
          gsap.set(copy, { opacity: 1 });
          forcePreviewRef.current = true;
          return;
        }

        const startSize = narrow ? 0.92 : 0.82;
        const startHeight = narrow ? 0.52 : 0.74;
        const scrollLen = narrow ? 1400 : 1800;

        // Measured fresh on every refresh (mount, resize, orientation change)
        // so the landing is exact at any size rather than baked in at mount.
        const start = { x: 0, y: 0, scale: 1 };
        const measure = () => {
          gsap.set(media, { x: 0, y: 0, scale: 1 });
          const s = stage.getBoundingClientRect();
          const m = media.getBoundingClientRect();
          if (!m.width || !m.height) return;
          const startW = Math.min(s.width * startSize, s.height * startHeight * (m.width / m.height));
          start.scale = startW / m.width;
          start.x = s.left + s.width / 2 - (m.left + m.width / 2);
          start.y = s.top + s.height / 2 - (m.top + m.height / 2);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: `+=${scrollLen}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            // Must measure after the reel pin above it (refreshPriority 1), whose
            // spacer sits between the top of the page and this stage.
            refreshPriority: 0,
            onRefreshInit: measure,
            onToggle: (self) => {
              forcePreviewRef.current = self.isActive;
            },
            onUpdate: (self) => {
              // Clicking mid-transform would open the lightbox from a rect the
              // card is still moving through, so only arm it once it has landed.
              media.style.pointerEvents = self.progress >= FIT_AT ? 'auto' : 'none';
            }
          }
        });

        // Phases 1-2: the media pulls back from filling the viewport to the
        // screen inside the image.
        tl.fromTo(
          media,
          { x: () => start.x, y: () => start.y, scale: () => start.scale },
          { x: 0, y: 0, scale: 1, ease: 'none', duration: FIT_AT },
          0
        );

        // Phase 3: the room is revealed as the camera backs off, coming into
        // focus as it settles — the depth cue that scale alone cannot sell.
        tl.fromTo(bg, { scale: 1.12 }, { scale: 1, ease: 'none', duration: REVEAL_AT }, 0);
        tl.fromTo(bg, { filter: 'blur(5px)' }, { filter: 'blur(0px)', ease: 'none', duration: REVEAL_AT * 0.8 }, 0);
        tl.fromTo(copy, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.3 }, 0);

        // Phase 5: hand off to the next category.
        tl.to(inner, { filter: 'blur(14px)', opacity: 0, ease: 'none', duration: 1 - BLUR_FROM }, BLUR_FROM);

        measure();
        ScrollTrigger.refresh();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className="documental-stage"
      style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: '#08080A' }}
    >
      <div ref={innerRef} className="documental-inner" style={{ position: 'absolute', inset: 0, overflow: 'hidden', willChange: 'opacity, filter' }}>
        <div ref={frameRef} className="documental-frame">
          <img
            ref={bgRef}
            className="documental-bg"
            src="/assets/documentales-bg.jpg"
            alt=""
            aria-hidden="true"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform, filter' }}
          />
          <div
            ref={mediaRef}
            className="documental-media"
            style={{
              position: 'absolute',
              left: `${MEDIA_BOX.left}%`,
              top: `${MEDIA_BOX.top}%`,
              width: `${MEDIA_BOX.width}%`,
              height: `${MEDIA_BOX.height}%`,
              transformOrigin: 'center center',
              willChange: 'transform',
              pointerEvents: 'none'
            }}
          >
            <VideoCard
              video={video}
              reveal={false}
              radius={4}
              frameInset={6}
              frameRadius={2}
              forcePreview={() => forcePreviewRef.current}
              style={{ width: '100%', height: '100%', aspectRatio: 'auto', border: 'none' }}
            />
          </div>
        </div>
      </div>

      <div
        ref={copyRef}
        className="documental-copy"
        style={{
          position: 'absolute', left: 'clamp(20px,5vw,60px)', top: 'clamp(76px,11vh,120px)', zIndex: 3,
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16, maxWidth: 'min(90vw,700px)',
          color: '#F4F1EC', pointerEvents: 'none', willChange: 'opacity'
        }}
      >
        <h3 className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(1.4rem,2.8vw,2.3rem)', lineHeight: 1, letterSpacing: '-.025em' }}>
          Documental
        </h3>
        {note && <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.45 }}>{note}</span>}
        <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.2em' }}>{count}</span>
      </div>
    </div>
  );
}
