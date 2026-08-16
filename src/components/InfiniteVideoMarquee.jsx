import { useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

const AUTO_SPEED = 26; // px/s, leftward drift
const RETURN_RATE = 2.6; // how fast release-momentum eases back to AUTO_SPEED
const MAX_FLING = 2600; // px/s cap so a hard flick still settles in ~2s
const COPIES = 3; // enough repeats to cover ~2x the widest viewport seamlessly

// A seamless, always-moving horizontal film strip. One rAF loop owns a single
// `offset` scalar: it drifts at AUTO_SPEED on its own, is driven directly while
// dragging, and after release keeps the fling velocity and eases exponentially
// back to the drift. `offset` is taken modulo the width of one copy of the list,
// so the strip wraps with no jump, no snapping and no visible start or end.
export default function InfiniteVideoMarquee({ videos, cardWidth = 'clamp(158px,17vw,236px)', gap = 18 }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const s = useRef({ offset: 0, vel: AUTO_SPEED, dragging: false, lastX: 0, lastT: 0, setW: 0, moved: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;
    const st = s.current;

    const measure = () => {
      st.setW = track.scrollWidth / COPIES;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const down = (e) => {
      st.dragging = true;
      st.moved = 0;
      st.lastX = e.clientX;
      st.lastT = performance.now();
      st.vel = 0;
      viewport.style.cursor = 'grabbing';
      if (e.pointerId != null && viewport.setPointerCapture) {
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch (err) {
          /* noop */
        }
      }
    };

    const move = (e) => {
      if (!st.dragging) return;
      const now = performance.now();
      const dx = e.clientX - st.lastX;
      const dt = Math.max(8, now - st.lastT) / 1000;
      st.lastX = e.clientX;
      st.lastT = now;
      st.moved += Math.abs(dx);
      st.offset -= dx;
      // Smooth the per-event velocity so a jittery pointer doesn't fling wildly.
      const inst = Math.max(-MAX_FLING, Math.min(MAX_FLING, -dx / dt));
      st.vel = st.vel * 0.72 + inst * 0.28;
    };

    const up = (e) => {
      if (!st.dragging) return;
      st.dragging = false;
      viewport.style.cursor = 'grab';
      if (e && e.pointerId != null && viewport.releasePointerCapture) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch (err) {
          /* noop */
        }
      }
      // Let VideoCard's click guard see the drag distance, then clear it.
      setTimeout(() => {
        st.moved = 0;
      }, 60);
    };

    viewport.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);

    let raf;
    let t0 = performance.now();
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - t0) / 1000);
      t0 = t;
      if (!st.dragging) {
        st.vel += (AUTO_SPEED - st.vel) * (1 - Math.exp(-RETURN_RATE * dt));
        st.offset += st.vel * dt;
      }
      if (st.setW > 0) st.offset = ((st.offset % st.setW) + st.setW) % st.setW;
      track.style.transform = `translate3d(${-st.offset}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      viewport.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  const strip = [];
  for (let c = 0; c < COPIES; c++) {
    videos.forEach((v, i) => {
      strip.push(
        <VideoCard
          key={`${c}-${v.id}-${i}`}
          video={v}
          aspect="9/16"
          portrait
          reveal={false}
          radius={14}
          frameInset={10}
          frameRadius={8}
          onBeforeOpen={() => s.current.moved <= 6}
          style={{ flex: 'none', width: cardWidth }}
        />
      );
    });
  }

  return (
    <div
      ref={viewportRef}
      data-cursor="drag"
      style={{
        position: 'relative', width: '100%', overflow: 'hidden', cursor: 'grab',
        touchAction: 'pan-y', userSelect: 'none',
        WebkitMaskImage: 'linear-gradient(90deg,transparent 0,#000 5%,#000 95%,transparent 100%)',
        maskImage: 'linear-gradient(90deg,transparent 0,#000 5%,#000 95%,transparent 100%)'
      }}
    >
      <div ref={trackRef} style={{ display: 'flex', gap, width: 'max-content', willChange: 'transform' }}>
        {strip}
      </div>
    </div>
  );
}
