import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { revealVariants, IN_OUT_VARIANTS, IN_OUT_VIEWPORT, IN_OUT_TRANSITION } from '../motion/reveal';

// One-shot entrance: fades/blurs in the first time it reaches the viewport and
// then stays put. This is the default and what every card grid on the site uses.
function RevealOnce({ Comp, children, index = 0, className, style, ...props }) {
  return (
    <Comp className={className} style={style} {...revealVariants(index)} {...props}>
      {children}
    </Comp>
  );
}

// Reversible entrance/exit, opted into with `inOut`. Driven by an observer
// rather than `whileInView` because the exit state has to differ from the entry
// state: leaving past the top drifts away, while not having arrived yet waits
// below. Only ever animates opacity/transform on this wrapper — children keep
// their identity across every phase change, so anything stateful inside (a
// running rAF, a scroll position) survives untouched.
function RevealInOut({ Comp, children, className, style, ...props }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('below');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setPhase('in');
      else setPhase(e.boundingClientRect.top < 0 ? 'above' : 'below');
    }, IN_OUT_VIEWPORT);
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Comp
      ref={ref}
      className={className}
      style={style}
      variants={IN_OUT_VARIANTS}
      initial="below"
      animate={phase}
      transition={IN_OUT_TRANSITION}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Generic scroll-triggered reveal used for cards, pills, and paragraphs
// throughout the site. `index` staggers grids of these in groups of 4, matching
// the rhythm of the original design.
export default function Reveal({ as = 'div', inOut = false, ...rest }) {
  const Comp = motion[as] || motion.div;
  return inOut ? <RevealInOut Comp={Comp} {...rest} /> : <RevealOnce Comp={Comp} {...rest} />;
}
