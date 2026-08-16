import Magnetic from './Magnetic';
import { bindEngineRef } from '../engine/refs';
import { ACCENT_ORANGE, CONTACT } from '../data/content';

const navLinks = [
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#social', label: 'Social' },
  { href: '#camara', label: 'Cámara' },
  { href: '#video', label: 'Video' },
  { href: '#ia', label: 'IA' },
  { href: '#diseno', label: 'Diseño' }
];

const ctaStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 20px', borderRadius: 999,
  background: 'linear-gradient(135deg,#F0D6A6 0%,#E6C48D 45%,#C9A365 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55),inset 0 -8px 18px rgba(151,110,49,.35),0 8px 30px rgba(230,196,141,.18)',
  color: '#0A0A0A', fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase'
};

export default function Header() {
  return (
    <header
      ref={bindEngineRef('header')}
      className="site-header"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: 'clamp(16px,2.2vw,26px) clamp(20px,5vw,60px)', color: '#F4F1EC',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)'
      }}
    >
      <a
        href="#hero"
        data-cursor="link"
        className="clash"
        style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', fontWeight: 600, fontSize: 15, letterSpacing: '-.01em', flex: 'none', whiteSpace: 'nowrap' }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ACCENT_ORANGE, display: 'block' }} />
        Yeraldo Ore
      </a>
      <nav className="site-nav">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-cursor="link"
            className="nav-link"
            style={{ color: 'inherit', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.7 }}
          >
            {l.label}
          </a>
        ))}
        <Magnetic href={CONTACT.whatsapp} target="_blank" rel="noopener" data-cursor="link" className="nav-cta" style={ctaStyle}>
          Contáctame
        </Magnetic>
      </nav>
    </header>
  );
}
