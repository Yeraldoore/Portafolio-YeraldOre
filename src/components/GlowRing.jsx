const CONIC = 'conic-gradient(from var(--angle),#ff2d95,#7b2ff7,#2d9cff,#2dffb0,#ffd02d,#ff2d95)';

const edgeStyle = {
  position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', boxSizing: 'border-box', padding: 2,
  borderRadius: 'inherit', background: CONIC,
  WebkitMask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor', maskComposite: 'exclude',
  animation: 'yoSpin 4s linear infinite'
};

// A thin animated rainbow edge ring, revealed on hover by the `.glow-ring`
// rules in global.css. Masked to the border box only, so it never washes over
// the video or artwork it frames.
export default function GlowRing() {
  return <div className="glow-ring" aria-hidden="true" style={edgeStyle} />;
}
