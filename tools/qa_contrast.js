// Rendered-style contrast audit (the team). For every visible element that owns text, reads the computed
// text colour and the effective background (composited up the ancestor chain) and applies the WCAG 2.x formula.
// Large text (>=24px, or >=18.66px bold) needs 3:1, everything else 4.5:1. Not a substitute for a manual audit:
// text over images or gradients is reported as "skipped".
function onrampContrastAudit(doc) {
  const win = doc.defaultView;
  const parse = s => {
    let m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
    m = s.match(/color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)/);
    if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    return null;
  };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  const lum = c => { const v = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  function background(el) {
    const layers = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = win.getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && e.tagName !== 'BODY' && e.tagName !== 'HTML') return null;
      const c = parse(cs.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    let bg = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return bg;
  }
  const out = { checked: 0, skipped: 0, failures: [], min: null };
  doc.querySelectorAll('body *').forEach(el => {
    if (!Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) return;
    const r = el.getBoundingClientRect(); const cs = win.getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const bg = background(el); const fgRaw = parse(cs.color);
    if (!bg || !fgRaw) { out.skipped++; return; }
    const fg = over(fgRaw, bg); const cr = ratio(fg, bg);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    out.checked++;
    if (!out.min || cr < out.min.ratio) out.min = { ratio: +cr.toFixed(2), text: el.textContent.trim().slice(0, 40), tag: el.tagName.toLowerCase() };
    if (cr < need) out.failures.push({ ratio: +cr.toFixed(2), need, text: el.textContent.trim().slice(0, 40), tag: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') });
  });
  return out;
}
