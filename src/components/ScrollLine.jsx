import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { ACCENT } from '../data/content';

// A decorative thread that draws itself from the first scroll in the hero to the
// end of "Sobre mí". It rides a fixed layer sitting above every background layer
// but below <main>, so it is always visible against the page colour yet can
// never cover text, the avatar canvas, or the header.
//
// Control points as fractions of the viewport. Kept in the left margin so the
// stroke never crosses the avatar canvas in the middle column.
const POINTS = [
  [0.06, 0.24],
  [0.11, 0.4, 0.02, 0.53, 0.07, 0.67],
  [0.13, 0.82, 0.04, 1.08]
];

const buildPath = (w, h) => {
  const [m, c, s] = POINTS;
  const x = (v) => (v * w).toFixed(1);
  const y = (v) => (v * h).toFixed(1);
  return (
    `M ${x(m[0])} ${y(m[1])} ` +
    `C ${x(c[0])} ${y(c[1])}, ${x(c[2])} ${y(c[3])}, ${x(c[4])} ${y(c[5])} ` +
    `S ${x(s[0])} ${y(s[1])}, ${x(s[2])} ${y(s[3])}`
  );
};

export default function ScrollLine() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const hero = document.getElementById('hero');
    const about = document.getElementById('sobre-mi');
    if (!path || !hero || !about) return undefined;

    // The viewBox tracks the viewport in CSS pixels, so user units are pixels:
    // the stroke keeps an even weight without `non-scaling-stroke`, which would
    // otherwise move the dash pattern into screen space and shatter the line
    // into repeating dashes. `pathLength="1"` then makes the dash maths
    // resolution-independent — no measuring, and resizing cannot desync it.
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      path.setAttribute('d', buildPath(w, h));
    };
    resize();
    window.addEventListener('resize', resize);

    const mm = gsap.matchMedia();
    mm.add(
      { reduce: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' },
      (context) => {
        // Reduced motion: show the finished stroke, never animate it.
        if (context.conditions.reduce) {
          gsap.set(path, { strokeDashoffset: 0 });
          return;
        }
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              // Absolute 0 rather than the hero's "top top": the hero is pinned,
              // which pushes that marker to the end of its pin, and the stroke is
              // meant to begin on the very first scroll.
              trigger: hero,
              start: 0,
              endTrigger: about,
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
              // Below the hero pin (3) that inflates the page above it, above the
              // pins further down, so every refresh measures top-down.
              refreshPriority: 2
            }
          }
        );
      }
    );

    return () => {
      window.removeEventListener('resize', resize);
      mm.revert();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
    >
      <path
        ref={pathRef}
        pathLength="1"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1"
        opacity="0.5"
      />
    </svg>
  );
}
