import { createContext, useContext, useEffect, useRef } from 'react';

const MouseCtx = createContext(null);

export function MouseProvider({ children }) {
  const mouse = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.clientX = e.clientX;
      mouse.current.clientY = e.clientY;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <MouseCtx.Provider value={mouse}>{children}</MouseCtx.Provider>;
}

export function useMouseRef() {
  return useContext(MouseCtx);
}
