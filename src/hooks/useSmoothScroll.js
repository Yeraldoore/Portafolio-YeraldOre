import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset;
  if (lenisInstance) lenisInstance.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

// Sets up Lenis smooth scroll wired into GSAP's ticker + ScrollTrigger, and
// makes any in-page `#hash` link use the smooth-scroll instead of the browser default.
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.7
    });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    document.addEventListener('click', onClick);

    const onKey = (e) => {
      if (e.key === 'Escape') return;
    };
    document.addEventListener('keydown', onKey);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function stopScroll() {
  if (lenisInstance) lenisInstance.stop();
}
export function startScroll() {
  if (lenisInstance) lenisInstance.start();
}
