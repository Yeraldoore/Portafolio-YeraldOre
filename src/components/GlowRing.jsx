const CONIC = 'conic-gradient(from var(--angle),#ff2d95,#7b2ff7,#2d9cff,#2dffb0,#ffd02d,#ff2d95)';

const edgeStyle = {
  position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', boxSizing: 'border-box', padding: 2,
  borderRadius: 'inherit', background: CONIC,
  WebkitMask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor', maskComposite: 'exclude',
  animation: 'yoSpin 4s linear infinite'
};

const haloStyle = {
  position: 'absolute', inset: '-8%', zIndex: 2, pointerEvents: 'none', borderRadius: 'inherit',
  background: CONIC, filter: 'blur(26px)', animation: 'yoSpin 4s linear infinite'
};

// A thin animated rainbow edge ring, revealed on hover by the parent's
// `.glow-edge` / `.glow-halo` / `.glow-ring` CSS rules (see global.css).
//   - "pair"  → edge ring (full opacity) + blurred halo behind it (half opacity)
//   - "edge"  → edge ring only, full opacity on hover (gear + graphic design cards)
//   - "halo"  → blurred halo only, full opacity on hover (social ring cards)
export default function GlowRing({ variant = 'edge' }) {
  if (variant === 'pair') {
    return (
      <>
        <div className="glow-edge" aria-hidden="true" style={edgeStyle} />
        <div className="glow-halo" aria-hidden="true" style={haloStyle} />
      </>
    );
  }
  if (variant === 'halo') {
    return <div className="glow-ring" aria-hidden="true" style={haloStyle} />;
  }
  return <div className="glow-ring" aria-hidden="true" style={edgeStyle} />;
}
