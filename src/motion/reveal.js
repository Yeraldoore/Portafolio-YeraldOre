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
