import SplitReveal from './SplitReveal';
import { ACCENT, CONTACT } from '../data/content';

function ContactRow({ label, value, href, valueSize }) {
  return (
    <>
      <div style={{ height: 1, background: 'currentColor', opacity: 0.14 }} />
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener' : undefined}
        data-cursor="link"
        className="contact-row"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 'clamp(20px,2.6vw,32px) 4px', color: 'inherit' }}
      >
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(14px,2vw,28px)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.45 }}>{label}</span>
          <span className="clash" style={{ fontSize: valueSize, fontWeight: 500, letterSpacing: '-.025em' }}>{value}</span>
        </span>
        <span style={{ color: ACCENT, fontSize: 'clamp(1.1rem,2vw,1.6rem)' }}>↗</span>
      </a>
    </>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contacto"
      style={{
        position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(100px,16vh,190px) clamp(20px,5vw,60px) clamp(40px,6vh,70px)', color: '#F4F1EC'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(40px,6vw,80px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: ACCENT, fontSize: 11, letterSpacing: '.24em' }}>08</span>
            <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.35, display: 'block' }} />
            <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6 }}>Contacto</span>
          </div>
          <SplitReveal as="h2" className="clash" style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(2.8rem,11vw,10rem)', lineHeight: 0.86, letterSpacing: '-.045em' }}>
            Trabajemos<br />
            <span style={{ color: ACCENT }}>juntos</span>
          </SplitReveal>
          <p style={{ margin: 0, maxWidth: '30em', fontSize: 'clamp(1rem,1.35vw,1.2rem)', lineHeight: 1.65, opacity: 0.7 }}>
            ¿Tienes una idea, una marca o un proyecto en camino? Escríbeme y lo conversamos.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ContactRow label="WhatsApp" value={CONTACT.whatsappLabel} href={CONTACT.whatsapp} valueSize="clamp(1.3rem,3.2vw,2.4rem)" />
          <ContactRow label="Instagram" value={CONTACT.instagramLabel} href={CONTACT.instagram} valueSize="clamp(1.3rem,3.2vw,2.4rem)" />
          <ContactRow label="Email" value={CONTACT.emailLabel} href={CONTACT.email} valueSize="clamp(1.05rem,2.6vw,2.1rem)" />
          <div style={{ height: 1, background: 'currentColor', opacity: 0.14 }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.42 }}>
          <span>© 2026 Yeraldo Oré — Lima, Perú</span>
          <span>Comunicación audiovisual · UPC</span>
        </div>
      </div>
    </section>
  );
}
