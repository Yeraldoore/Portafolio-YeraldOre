import { useEffect, useState } from 'react';

function read() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isSmall: false, isTouch: false, width: 1200 };
  }
  return {
    isMobile: window.innerWidth < 900,
    isSmall: window.innerWidth < 660,
    isTouch: !!(window.matchMedia && window.matchMedia('(hover: none)').matches),
    width: window.innerWidth
  };
}

export function useBreakpoints() {
  const [state, setState] = useState(read);

  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setState(read()), 140);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, []);

  return state;
}
