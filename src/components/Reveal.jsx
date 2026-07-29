import { motion } from 'framer-motion';
import { revealVariants } from '../motion/reveal';

// Generic scroll-triggered fade/blur/scale-in used for cards, pills, and
// paragraphs throughout the site. `index` staggers grids of these in groups
// of 4, matching the rhythm of the original design.
export default function Reveal({ children, index = 0, as = 'div', className, style, ...props }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp className={className} style={style} {...revealVariants(index)} {...props}>
      {children}
    </Comp>
  );
}
