import { rgba } from '../utils/color';

// A stylized monogram badge standing in for each tool's logo, tinted with that
// brand's colour and finished in the site's glass/gradient language so the set
// reads as one system rather than a row of mismatched vendor assets.
export default function ToolLogo({ mark, brand, size = 36 }) {
  return (
    <span
      aria-hidden="true"
      className="clash"
      style={{
        flex: 'none', width: size, height: size, borderRadius: size * 0.28,
        display: 'grid', placeItems: 'center', lineHeight: 1,
        background: `linear-gradient(150deg,${rgba(brand, 0.34)},${rgba(brand, 0.08)})`,
        border: `1px solid ${rgba(brand, 0.5)}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.2),0 6px 18px ${rgba(brand, 0.18)}`,
        color: brand, fontWeight: 600, fontSize: size * (mark.length > 2 ? 0.3 : 0.38), letterSpacing: '-.02em'
      }}
    >
      {mark}
    </span>
  );
}
