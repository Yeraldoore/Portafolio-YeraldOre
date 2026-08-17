import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import VideoCard from './VideoCard';
import { ACCENT } from '../data/content';

// Where the screen sits inside documentales-bg.png, as percentages of the image
// itself — measured from the file's own alpha hole (1182x561, the cut-out is a
// 100% solid transparent rectangle). Tweak here if the landing needs a nudge;
// keep the aspect in .documental-frame in sync with the image's dimensions.
const SCREEN_TARGET = { left: 33.16, top: 28.52, width: 35.28, height: 41.53 };

// The background is rescaled to cover the frame, which leaves the edge of its
// cut-out softly resampled — landing exactly on SCREEN_TARGET therefore lets a
// ~2px seam show around the video. Bleed a hair past the calibration to tuck the
// video edge under the bezel. In percentage points, and asymmetric because the
// frame is ~2.1:1, so a point of width covers about twice the pixels a point of
// height does. Set both to 0 to sit exactly on the measured rectangle.
const OVERSCAN = { x: 0.26, y: 0.44 };

const MEDIA_BOX = {
  left: SCREEN_TARGET.left - OVERSCAN.x,
  top: SCREEN_TARGET.top - OVERSCAN.y,
  width: SCREEN_TARGET.width + OVERSCAN.x * 2,
  height: SCREEN_TARGET.height + OVERSCAN.y * 2
};

// Timeline landmarks, as a fraction of the pinned scroll. The video holds its
// opening size for the whole dwell — the reveal only starts once the viewer has
// spent real scroll with it as the protagonist.
const DWELL_END = 0.35; // phase 1 ends; pull-back and reveal begin
const FIT_AT = 0.76; // media has landed in SCREEN_TARGET
const REVEAL_AT = 0.8; // background finished pulling back
const BLUR_FROM = 0.84; // phase 5 hand-off begins

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
        // Longer than it needs to be for the pull-back alone: the dwell eats the
        // first third, so this keeps the reveal itself as unhurried as before.
        const scrollLen = narrow ? 2000 : 2600;

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

        // Phase 1 — dwell. The video holds its opening size while the room stays
        // zoomed and out of focus behind it. A 2% drift over the whole stretch
        // keeps it from reading as a frozen screenshot without starting the
        // pull-back early.
        gsap.set(bg, { scale: 1.12, filter: 'blur(5px)' });
        tl.fromTo(
          media,
          { x: () => start.x, y: () => start.y, scale: () => start.scale },
          { x: () => start.x, y: () => start.y, scale: () => start.scale * 1.02, ease: 'none', duration: DWELL_END },
          0
        );
        tl.addLabel('dwellEnd', DWELL_END);

        // Phase 2 — the pull-back proper, from the dwell size down to the screen.
        tl.to(media, { x: 0, y: 0, scale: 1, ease: 'none', duration: FIT_AT - DWELL_END }, 'dwellEnd');
        tl.addLabel('fit', FIT_AT);

        // Phase 3 — the room is revealed as the camera backs off, coming into
        // focus as it settles: the depth cue that scale alone cannot sell.
        tl.fromTo(bg, { scale: 1.12 }, { scale: 1, ease: 'none', duration: REVEAL_AT - DWELL_END }, 'dwellEnd');
        tl.fromTo(
          bg,
          { filter: 'blur(5px)' },
          { filter: 'blur(0px)', ease: 'none', duration: (REVEAL_AT - DWELL_END) * 0.8 },
          'dwellEnd'
        );
        tl.fromTo(copy, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.18 }, 'dwellEnd');

        // Phase 5 — hand off to the next category.
        tl.addLabel('blurStart', BLUR_FROM);
        tl.to(inner, { filter: 'blur(14px)', opacity: 0, ease: 'none', duration: 1 - BLUR_FROM }, 'blurStart');

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
          {/* The artwork's screen is a real alpha cut-out, so anything not
              covered by the video would show whatever sits behind it. Back it
              with the same solid the cards use, so a sliver left by a future
              OVERSCAN or aspect change reads as black rather than see-through. */}
          <div style={{ position: 'absolute', inset: 0, background: '#0E0E10' }} />
          <img
            ref={bgRef}
            className="documental-bg"
            src="/assets/documentales-bg.png"
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
