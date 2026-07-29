import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Progressively types out `text` when it scrolls into view, with a blinking
// caret while typing. A hidden full-text ghost in the same grid cell keeps
// the paragraph's box from collapsing before typing starts.
export default function Typewriter({ text, as: Tag = 'p', className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -16% 0px' });
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const step = Math.max(2, Math.round(text.length / 190));
    const id = setInterval(() => {
      i = Math.min(text.length, i + step);
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 16);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <Tag ref={ref} className={className} style={{ ...style, display: 'grid' }}>
      <span style={{ gridArea: '1 / 1', visibility: 'hidden' }} aria-hidden="true">
        {text}
      </span>
      <span style={{ gridArea: '1 / 1' }}>
        {out}
        {inView && !done && (
          <span
            style={{
              display: 'inline-block',
              width: '.06em',
              height: '1.02em',
              marginLeft: '.07em',
              verticalAlign: '-.14em',
              background: 'currentColor',
              animation: 'yoPulse .9s steps(2,start) infinite'
            }}
          />
        )}
      </span>
    </Tag>
  );
}
