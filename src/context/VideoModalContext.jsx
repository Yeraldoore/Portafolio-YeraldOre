import { createContext, useCallback, useContext, useState } from 'react';
import { setPreviewsPaused } from '../engine/previewManager';
import { stopScroll, startScroll } from '../hooks/useSmoothScroll';

const Ctx = createContext(null);

export function VideoModalProvider({ children }) {
  const [playing, setPlaying] = useState(null); // { src, title, rect }

  const openVideo = useCallback((video, el) => {
    let anim = null;
    if (el) {
      const rect = el.getBoundingClientRect();
      const pad = Math.min(60, Math.max(16, window.innerWidth * 0.05));
      const boxW = Math.min(1200, window.innerWidth - pad * 2);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const srcCx = rect.left + rect.width / 2;
      const srcCy = rect.top + rect.height / 2;
      anim = { x: srcCx - cx, y: srcCy - cy, scale: Math.max(0.12, rect.width / boxW) };
    }
    setPreviewsPaused(true);
    stopScroll();
    setPlaying({ src: `${video.url}?autoplay=1&rel=0&modestbranding=1`, title: video.title, anim });
  }, []);

  const closeVideo = useCallback(() => {
    setPlaying(null);
    setPreviewsPaused(false);
    startScroll();
  }, []);

  return <Ctx.Provider value={{ playing, openVideo, closeVideo }}>{children}</Ctx.Provider>;
}

export function useVideoModal() {
  return useContext(Ctx);
}
