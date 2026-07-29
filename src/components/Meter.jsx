import { motion } from 'framer-motion';
import { ACCENT } from '../data/content';

export default function Meter({ pct }) {
  return (
    <div style={{ position: 'relative', height: 3, borderRadius: 3, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: '0%' }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, margin: '0px 0px -5% 0px' }}
        transition={{ duration: 1.5, ease: [0.16, 0.84, 0.24, 1] }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, borderRadius: 3, background: `linear-gradient(90deg,rgba(230,196,141,.28),${ACCENT})` }}
      />
    </div>
  );
}
