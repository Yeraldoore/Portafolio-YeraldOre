export function hex2rgb(h) {
  h = (h || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h || '000000', 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(h, a) {
  const c = hex2rgb(h);
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

export function mix(a, b, t) {
  const x = hex2rgb(a);
  const y = hex2rgb(b);
  return `rgb(${Math.round(x[0] + (y[0] - x[0]) * t)},${Math.round(x[1] + (y[1] - x[1]) * t)},${Math.round(x[2] + (y[2] - x[2]) * t)})`;
}

export function light(h, amt) {
  const c = hex2rgb(h).map((v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)))));
  return `rgb(${c.join(',')})`;
}
