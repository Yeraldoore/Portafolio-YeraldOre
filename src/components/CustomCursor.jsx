import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { ACCENT } from '../data/content';

const MODES = {
  default: { scale: 1, bg: 'rgba(244,241,236,0)', border: 'rgba(244,241,236,.55)', label: '', dotScale: 1 },
  view: { scale: 2.15, bg: 'rgba(244,241,236,.92)', border: 'rgba(244,241,236,0)', label: 'Ver', dotScale: 0 },
  drag: { scale: 2.15, bg: 'rgba(244,241,236,.92)', border: 'rgba(244,241,236,0)', label: 'Gira', dotScale: 0 },
  link: { scale: 1.7, bg: 'rgba(244,241,236,.9)', border: 'rgba(244,241,236,0)', label: '', dotScale: 0 }
};

const PALETTE = ['255,45,149', '123,47,247', '45,156,255', '45,255,176', '255,208,45'];

// Replaces the native pointer with a two-part cursor (small dot + trailing
// ring) that reads hover intent off `data-cursor="link|view|drag"` anywhere
// in the document, plus a short-lived bokeh trail of colored blobs that
// follows fast mouse movement. Disabled entirely on touch devices.
export default function CustomCursor() {
  const { isTouch } = useBreakpoints();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState('default');
  const trailBoxRef = useRef(null);
  const lastTrail = useRef({ x: null, y: null, t: 0, i: 0 });

  useEffect(() => {
    if (isTouch) return undefined;
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    const spawnTrail = (cx, cy) => {
      const box = trailBoxRef.current;
      if (!box) return;
      const now = performance.now();
      const last = lastTrail.current;
      if (last.x == null) {
        last.x = cx;
        last.y = cy;
        return;
      }
      const dist = Math.hypot(cx - last.x, cy - last.y);
      if (now - last.t < 26 || dist < 8) return;
      last.t = now;
      last.x = cx;
      last.y = cy;
      last.i = (last.i + 1) % PALETTE.length;
      const c = PALETTE[last.i];
      const size = 34 + Math.min(46, dist * 1.6);
      const d = document.createElement('span');
      d.style.cssText =
        `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
        `margin:${-size / 2}px 0 0 ${-size / 2}px;border-radius:50%;` +
        `background:radial-gradient(circle,rgba(${c},.55) 0%,rgba(${c},.22) 45%,transparent 72%);` +
        `filter:blur(${(10 + size * 0.16).toFixed(1)}px);opacity:.85;transform:scale(.7);` +
        `transition:opacity 1s ease-out,transform 1s cubic-bezier(.2,.7,.2,1)`;
      box.appendChild(d);
      requestAnimationFrame(() => {
        d.style.opacity = '0';
        d.style.transform = 'scale(1.85)';
      });
      setTimeout(() => d.remove(), 1100);
      while (box.children.length > 26) box.removeChild(box.firstChild);
    };

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      spawnTrail(e.clientX, e.clientY);
    };
    const onOver = (e) => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      setMode(t ? t.getAttribute('data-cursor') || 'link' : 'default');
    };
    const onOut = (e) => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      if (t && (!e.relatedTarget || !t.contains(e.relatedTarget))) setMode('default');
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.body.style.cursor = prevCursor;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;
  const m = MODES[mode] || MODES.link;

  return (
    <>
      <div
        ref={trailBoxRef}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 988, pointerEvents: 'none', overflow: 'hidden', mixBlendMode: 'screen' }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 991,
          width: 6,
          height: 6,
          marginTop: -3,
          marginLeft: -3,
          borderRadius: '50%',
          background: ACCENT,
          pointerEvents: 'none',
          x,
          y
        }}
        animate={{ scale: m.dotScale }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 990,
          width: 38,
          height: 38,
          marginTop: -19,
          marginLeft: -19,
          borderRadius: '50%',
          borderWidth: 1,
          borderStyle: 'solid',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: '#0A0A0A',
          mixBlendMode: 'difference',
          x: ringX,
          y: ringY
        }}
        animate={{ scale: m.scale, backgroundColor: m.bg, borderColor: m.border }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        initial={false}
      >
        {m.label}
      </motion.div>
    </>
  );
}
