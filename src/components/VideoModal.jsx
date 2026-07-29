import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useVideoModal } from '../context/VideoModalContext';

// The video lightbox: the backdrop cross-fades in while the player box
// morphs in from wherever the clicked thumbnail was on screen (computed by
// VideoModalContext.openVideo), matching the source design's "grow from the
// card" feel without needing a post-render measurement pass.
export default function VideoModal() {
  const { playing, closeVideo } = useVideoModal();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeVideo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeVideo]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          onClick={closeVideo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(16px,5vw,60px)', background: 'rgba(6,6,8,.86)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)'
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={playing.anim ? { x: playing.anim.x, y: playing.anim.y, scale: playing.anim.scale, opacity: 0 } : { scale: 0.92, opacity: 0 }}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
            transition={{ duration: playing.anim ? 0.72 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', width: 'min(1200px,100%)', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#000', boxShadow: '0 40px 120px rgba(0,0,0,.7)' }}
          >
            <iframe
              src={playing.src}
              title={playing.title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          </motion.div>
          <button
            onClick={closeVideo}
            data-cursor="link"
            style={{
              position: 'absolute', top: 'clamp(16px,3vw,34px)', right: 'clamp(16px,3vw,34px)', width: 46, height: 46, borderRadius: '50%',
              border: '1px solid rgba(244,241,236,.28)', background: 'rgba(255,255,255,.06)', color: '#F4F1EC', fontSize: 18, lineHeight: 1, cursor: 'pointer'
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
