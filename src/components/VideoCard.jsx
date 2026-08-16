import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { registerPreviewCard } from '../engine/previewManager';
import { useVideoModal } from '../context/VideoModalContext';
import { revealVariants } from '../motion/reveal';
import GlowRing from './GlowRing';
import { ACCENT } from '../data/content';

function PreviewIframe({ id, portrait }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 260);
    return () => clearTimeout(t);
  }, []);
  const src =
    `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
    '&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&fs=0';
  const cover = portrait ? { width: '320%', height: '100%', left: '-110%', top: 0 } : { width: '100%', height: '100%', left: 0, top: 0 };
  return (
    <iframe
      title="Preview"
      src={src}
      allow="autoplay; encrypted-media"
      frameBorder="0"
      style={{ position: 'absolute', ...cover, border: 0, zIndex: 0, pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity 1.1s ease' }}
    />
  );
}

// A single video thumbnail: lazy-loads its YouTube thumbnail (with a
// mobile/desktop resolution split and a maxres→hq fallback), registers
// itself with the global preview manager so it can get an autoplaying
// muted loop when it's one of the closest cards to the viewport center,
// and opens the shared lightbox on click.
export default function VideoCard({
  video,
  aspect = '16/9',
  showPlayLabel = false,
  portrait = false,
  className = '',
  style,
  onBeforeOpen,
  radius = 14,
  frameInset = 10,
  frameRadius,
  index = 0,
  reveal = true,
  ...rest
}) {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { isMobile } = useBreakpoints();
  const { openVideo } = useVideoModal();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          let url = video.thumb;
          const fallback = video.thumbFallback || url.replace('maxresdefault', 'hqdefault');
          if (isMobile && url.indexOf('maxresdefault') > -1) url = fallback;
          else if (url !== fallback) {
            img.addEventListener(
              'error',
              () => {
                img.src = fallback;
              },
              { once: true }
            );
          }
          img.src = url;
          setLoaded(true);
          io.disconnect();
        });
      },
      { rootMargin: '60% 0px' }
    );
    io.observe(img);
    return () => io.disconnect();
  }, [video.thumb, isMobile]);

  useEffect(() => {
    return registerPreviewCard({ getEl: () => rootRef.current, setActive });
  }, []);

  const handleClick = () => {
    if (onBeforeOpen && onBeforeOpen() === false) return;
    openVideo(video, rootRef.current);
  };

  return (
    <motion.div
      ref={rootRef}
      className={`video-card ${className}`}
      data-cursor="view"
      onClick={handleClick}
      style={{
        position: 'relative', aspectRatio: aspect, borderRadius: radius, overflow: 'hidden', cursor: 'pointer',
        background: '#0E0E10', border: '1px solid rgba(255,255,255,.08)', ...style
      }}
      {...(reveal ? revealVariants(index) : {})}
      whileHover={{ scale: 1.045, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } }}
      {...rest}
    >
      <img ref={imgRef} loading="lazy" decoding="async" alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#0E0E10' }} />
      {active && loaded && <PreviewIframe id={video.id} portrait={portrait} />}
      <GlowRing />
      <div
        className="video-cap"
        style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 16,
          background: 'linear-gradient(to top,rgba(8,8,10,.72),rgba(8,8,10,.06) 46%,rgba(8,8,10,0) 70%)'
        }}
      >
        <div style={{ position: 'absolute', inset: frameInset, border: '1px solid rgba(244,241,236,.3)', borderRadius: frameRadius ?? Math.max(0, radius - 6), pointerEvents: 'none' }} />
        {showPlayLabel ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 16 }}>
            <span className="clash" style={{ fontSize: '1.05rem', fontWeight: 500, letterSpacing: '-.01em' }}>{video.title}</span>
            <span style={{ color: ACCENT, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase' }}>Reproducir</span>
          </div>
        ) : (
          <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{video.title}</span>
        )}
      </div>
    </motion.div>
  );
}
