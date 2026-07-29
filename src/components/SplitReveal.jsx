import React from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } }
};

const word = {
  hidden: { opacity: 0, y: '110%', rotate: 2.5 },
  show: { opacity: 1, y: '0%', rotate: 0, transition: { duration: 0.95, ease: [0.16, 0.86, 0.2, 1] } }
};

// Word-by-word "curtain" reveal for headings, triggered once as the heading
// scrolls into view. Preserves <br/> line breaks and non-text children
// (e.g. an accent-colored <span>) as atomic units, same as the source design.
export default function SplitReveal({ children, as = 'h2', className, style, ...props }) {
  const Comp = motion[as] || motion.h2;
  const parts = [];
  let wi = 0;

  React.Children.forEach(children, (child, ci) => {
    if (typeof child === 'string' || typeof child === 'number') {
      String(child)
        .split(/(\s+)/)
        .forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) {
            parts.push({ type: 'space', key: `s${wi++}` });
            return;
          }
          parts.push({ type: 'word', content: t, key: `w${wi++}` });
        });
      return;
    }
    if (child && child.type === 'br') {
      parts.push({ type: 'br', key: `br${ci}` });
      return;
    }
    parts.push({ type: 'word', content: child, key: `n${ci}` });
  });

  return (
    <Comp
      className={className}
      style={{ ...style, overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      {...props}
    >
      {parts.map((p) => {
        if (p.type === 'space') return ' ';
        if (p.type === 'br') return <br key={p.key} />;
        return (
          <motion.span
            key={p.key}
            variants={word}
            style={{ display: 'inline-block', willChange: 'transform,opacity', paddingBottom: '.09em' }}
          >
            {p.content}
          </motion.span>
        );
      })}
    </Comp>
  );
}
