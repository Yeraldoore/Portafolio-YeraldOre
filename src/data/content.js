// Site content — Spanish copy is verbatim from the approved design.
export const ACCENT = '#E6C48D';
export const ACCENT_ORANGE = '#FF7A45';

const vid = (id, title) => ({
  id,
  url: `https://www.youtube.com/embed/${id}`,
  thumb: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  title
});

export const reel = ['2Qiew1WM5ZM', 'gogdTxpk9MQ', 'OvD_yLMQ8TY', 'Kb2r8l0GxT4', 'z24ZvCIXJlw'].map((id, i) =>
  vid(id, `Destacado ${String(i + 1).padStart(2, '0')}`)
);

const mkCat = (label, ids, note) => ({
  label,
  note: note || '',
  count: String(ids.length).padStart(2, '0'),
  videos: ids.map((id, i) => vid(id, `${label} ${String(i + 1).padStart(2, '0')}`))
});

export const cats = [
  mkCat('Motion Graphics', ['u-W9ZeMbPUA', 'Kw7vt0N0yUU', 'oKIzBN716ik', 'xDQZmGhrDWk', 'mn0O2D7U9Sc']),
  mkCat('Documental', ['Rk4qp4PSoU4'], 'Nominado al Festival MIRA UPC 2025'),
  mkCat('Cortometrajes', ['UZkgjoVXCHw', 'T70Ub5FbqgE'])
];

const socialIds = ['-Gr4EBik6kM', 'gHqbHcQMnkA', 'dzC67cUfTJE', 'DZ1tMiczQbk', 'H4vm2YUhQak'];
export function buildSocialRing(radius) {
  const ringN = socialIds.length * 2;
  const step = 360 / ringN;
  const items = [];
  for (let i = 0; i < ringN; i++) {
    const v = vid(socialIds[i % socialIds.length], `Social Ad ${String((i % socialIds.length) + 1).padStart(2, '0')}`);
    v.angle = i * step;
    v.transform = `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(${radius}px)`;
    items.push(v);
  }
  return items;
}

export const musicales = ['jJxaYph3Vyg', 'fvC4s3SsBA8', 'uRIiIzs70wo'].map((id, i) =>
  vid(id, `Video musical ${String(i + 1).padStart(2, '0')}`)
);

export const skills = [
  { name: 'Adobe Premiere Pro', level: 'Avanzado', pct: 95 },
  { name: 'CapCut', level: 'Avanzado', pct: 92 },
  { name: 'Canva', level: 'Avanzado', pct: 88 },
  { name: 'Flow (IA para edición)', level: 'Intermedio', pct: 74, highlight: true },
  { name: 'Adobe After Effects', level: 'Intermedio', pct: 70 },
  { name: 'Adobe Photoshop', level: 'Intermedio', pct: 68 },
  { name: 'DaVinci Resolve', level: 'Intermedio', pct: 66 },
  { name: 'Adobe Illustrator', level: 'Básico', pct: 30 }
];

export const gfxCols = [
  {
    offset: 0,
    items: [
      { src: '/assets/inmo-01.jpg', ratio: '1080/1350', title: 'Campaña inmobiliaria', kind: 'Flyer · Redes' },
      { src: '/assets/papeles.jpg', ratio: '1/1', title: 'Papelillos BOB', kind: 'Packaging · Producto' }
    ]
  },
  {
    offset: 44,
    items: [
      { src: '/assets/vapes.jpg', ratio: '1200/1644', title: 'Lanzamiento vape', kind: 'Branding · Producto' },
      { src: '/assets/wraps.jpg', ratio: '1/1', title: 'Double Diamond wraps', kind: 'Packaging · Producto' }
    ]
  },
  {
    offset: 18,
    items: [
      { src: '/assets/inmo-03.jpg', ratio: '1080/1350', title: 'Proyecto inmobiliario', kind: 'Flyer · Redes' },
      { src: '/assets/inmo-02.jpg', ratio: '1080/1350', title: 'Captación inmobiliaria', kind: 'Flyer · Redes' }
    ]
  }
];

export const gear = [
  { n: '01', title: 'Manejo de cámara', desc: 'Foto y video: exposición, diafragma, ISO y elección de lente según la intención del plano.' },
  { n: '02', title: 'Cámaras mirrorless', desc: 'Configuración de perfiles de imagen, enfoque y monitoreo en sistemas mirrorless profesionales.' },
  { n: '03', title: 'Gimbal / estabilización', desc: 'Operación de gimbal para movimientos limpios: travellings, seguimientos y planos en movimiento.' },
  { n: '04', title: 'Grabación de audio', desc: 'Micrófonos de solapa, boom y grabadora: niveles, referencia y sonido utilizable desde el set.' },
  { n: '05', title: 'Iluminación', desc: 'Esquemas de luz con key, relleno y contra; difusión y temperatura de color para dar volumen.' }
];

export const achievements = [
  'Nominado al Festival MIRA UPC 2025',
  'Director de fotografía y editor principal en múltiples rodajes universitarios',
  'Reconocido por docentes por su creatividad, liderazgo técnico y proactividad'
];

export const education = [
  'Universidad Peruana de Ciencias Aplicadas (UPC) — Comunicación Audiovisual y Medios Interactivos',
  'Mención en Industrias Musicales y del Entretenimiento — UPC',
  'Inglés intermedio — Asociación Cultural Peruano Británica'
];

export const aboutParagraph =
  'Soy Yeraldo Bishop Ore, comunicador audiovisual formado en la Universidad Peruana de Ciencias Aplicadas (UPC). Me especializo en edición y soy filmmaker para redes sociales, integrando inteligencia artificial en mis flujos de edición. Domino Adobe Premiere (avanzado), After Effects (intermedio), Photoshop (intermedio), CapCut (avanzado) y DaVinci Resolve, además de herramientas de IA como Flow. También manejo cámara de forma técnica (exposición, diafragma, iluminación), redacción de guiones y diseño sonoro. Actualmente busco sumarme a un equipo donde pueda seguir contando historias con impacto visual.';

// Background/foreground colors per "world" (section), used to cross-fade the
// fixed page background + header ink color as the user scrolls between sections.
export const worlds = [
  { id: 'hero', bg: '#0A0A0A', fg: '#F4F1EC' },
  { id: 'sobre-mi', bg: '#EFEBE3', fg: '#0C0B0A' },
  { id: 'habilidades', bg: '#16120E', fg: '#F4F1EC' },
  { id: 'camara', bg: '#0C0F14', fg: '#F4F1EC' },
  { id: 'video', bg: '#08080A', fg: '#F4F1EC' },
  { id: 'social', bg: '#0B0D12', fg: '#F4F1EC' },
  { id: 'musicales', bg: '#17120F', fg: '#F4F1EC' },
  { id: 'diseno', bg: '#E8E3D9', fg: '#0C0B0A' },
  { id: 'contacto', bg: '#0A0A0A', fg: '#F4F1EC' }
];

export const CONTACT = {
  whatsapp: 'https://wa.me/51991363732',
  whatsappLabel: '+51 991 363 732',
  instagram: 'https://www.instagram.com/yeraldoore/',
  instagramLabel: '@yeraldoore',
  email: 'mailto:yeral.ore.ru@gmail.com',
  emailLabel: 'yeral.ore.ru@gmail.com'
};
