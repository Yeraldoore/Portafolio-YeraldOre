// Shared scroll-reveal animation spec (fade + blur + gentle scale-down),
// used by <Reveal>, <VideoCard>, and the graphic-design cards so hover/click
// components don't need an extra wrapper element just to animate in.
export function revealVariants(index = 0) {
  const delay = (index % 4) * 0.08;
  return {
    initial: { opacity: 0, filter: 'blur(14px)', y: 18, scale: 1.035 },
    whileInView: { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 },
    viewport: { once: true, amount: 0.08, margin: '0px 0px -6% 0px' },
    transition: { duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] }
  };
}

// Reversible variant of the above, for blocks big enough that they should also
// recede as they leave the top of the viewport instead of just snapping away.
// Unlike revealVariants this distinguishes "not yet reached" (rises into place
// from below) from "already passed" (drifts slightly away), so scrolling back
// up replays the entrance exactly.
export const IN_OUT_VARIANTS = {
  below: { opacity: 0, y: 40, scale: 0.96 },
  in: { opacity: 1, y: 0, scale: 1 },
  above: { opacity: 0, y: 0, scale: 1.02 }
};

// Matches the viewport criteria revealVariants uses, so both feel the same.
export const IN_OUT_VIEWPORT = { threshold: 0.08, rootMargin: '0px 0px -6% 0px' };

// cubic-bezier approximation of an ease-out quad (GSAP's power2.out).
export const IN_OUT_TRANSITION = { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] };
