// Coordinates which video cards get an autoplaying muted preview iframe.
// Mirrors the original behaviour: keep at most 4 previews (2 on mobile)
// active at a time, prioritizing whichever cards sit closest to the
// vertical center of the viewport, and tearing the rest down so the page
// never has more than a handful of hidden YouTube iframes loaded at once.
const cards = new Set();
let paused = false;
let raf = null;
let lastRun = 0;

export function registerPreviewCard(entry) {
  cards.add(entry);
  return () => {
    cards.delete(entry);
    if (entry.setActive) entry.setActive(false);
  };
}

export function setPreviewsPaused(v) {
  paused = v;
  if (v) cards.forEach((c) => c.setActive(false));
}

function tick(now) {
  raf = requestAnimationFrame(tick);
  if (now - lastRun < 360) return;
  lastRun = now;
  if (paused) return;

  const vh = window.innerHeight;
  const cy = vh / 2;
  const max = window.innerWidth > 900 ? 4 : 2;
  const visible = [];
  // Cards that must keep playing regardless of where they sit — used by the
  // Documental stage, whose card is mid-transform and so cannot be judged by
  // its distance to the viewport centre.
  const keep = new Set();

  cards.forEach((c) => {
    if (c.force && c.force()) {
      keep.add(c);
      return;
    }
    const el = c.getEl();
    if (!el) return;
    const b = el.getBoundingClientRect();
    if (b.width < 130 || b.bottom < vh * 0.12 || b.top > vh * 0.88) return;
    if (getComputedStyle(el).opacity === '0') return;
    visible.push({ c, d: Math.abs(b.top + b.height / 2 - cy) });
  });

  visible.sort((a, b) => a.d - b.d);
  for (let i = 0; i < visible.length && keep.size < max; i++) keep.add(visible[i].c);

  cards.forEach((c) => c.setActive(keep.has(c)));
}

export function startPreviewManager() {
  if (raf) return () => {};
  raf = requestAnimationFrame(tick);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };
}
