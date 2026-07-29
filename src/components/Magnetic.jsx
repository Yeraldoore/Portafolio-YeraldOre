import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Magnetic hover effect for the "Contáctame" pill buttons: the element
// leans toward the cursor within a radius of its own size, then eases back
// with a soft spring when the cursor leaves.
export default function Magnetic({ as = 'a', children, className, style, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.6 });

  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rad = Math.max(b.width, b.height) * 1.15;
      if (Math.abs(dx) < rad && Math.abs(dy) < rad + 20) {
        x.set(dx * 0.32);
        y.set(dy * 0.38);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  const Comp = motion[as] || motion.a;
  return (
    <Comp ref={ref} className={className} style={{ ...style, x: sx, y: sy }} {...props}>
      {children}
    </Comp>
  );
}
