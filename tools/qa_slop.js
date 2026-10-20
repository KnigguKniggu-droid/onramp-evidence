// Anti-slop design metrics (the team). Measures a rendered page so design variants can be compared with numbers,
// not impressions. Each metric maps to a common "AI slop" tell: too many ad-hoc sizes/colours/radii, decorative
// gradients/shadows everywhere, emoji as icons, everything centred, overly long lines, CTA spam, broken heading order.
function onrampSlopAudit(doc) {
  const win = doc.defaultView;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = win.getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const all = [...doc.querySelectorAll('body *')].filter(vis);
  const textEls = all.filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  const set = f => { const s = new Map(); all.forEach(el => { const v = f(el); if (v) s.set(v, (s.get(v) || 0) + 1); }); return s; };
  const fontSizes = new Map(); textEls.forEach(el => { const v = win.getComputedStyle(el).fontSize; fontSizes.set(v, (fontSizes.get(v) || 0) + 1); });
  const colors = new Map(); textEls.forEach(el => { const v = win.getComputedStyle(el).color; colors.set(v, (colors.get(v) || 0) + 1); });
  const radii = set(el => { const v = win.getComputedStyle(el).borderTopLeftRadius; return v !== '0px' ? v : null; });
  const shadows = all.filter(el => win.getComputedStyle(el).boxShadow !== 'none').length;
  const gradients = all.filter(el => /gradient/.test(win.getComputedStyle(el).backgroundImage)).length;
  const blur = all.filter(el => /blur/.test(win.getComputedStyle(el).filter + win.getComputedStyle(el).backdropFilter)).length;
  const emoji = (doc.body.innerText.match(/\p{Extended_Pictographic}/gu) || []).length;
  const centred = textEls.filter(el => win.getComputedStyle(el).textAlign === 'center' && el.textContent.trim().length > 40).length;
  // measure: characters per line for paragraphs
  const measures = [...doc.querySelectorAll('p')].filter(vis).map(p => { const cs = win.getComputedStyle(p); const ch = parseFloat(cs.fontSize) * 0.5; return Math.round(p.getBoundingClientRect().width / ch); });
  const longLines = measures.filter(m => m > 90).length;
  const vh = win.innerHeight;
  const ctasAboveFold = [...doc.querySelectorAll('a.btn, button.btn, .btn')].filter(el => vis(el) && el.getBoundingClientRect().top < vh).length;
  const hs = [...doc.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skips++;
  const h1 = doc.querySelector('h1'); const h1Top = h1 ? Math.round(h1.getBoundingClientRect().top) : null;
  const proofAboveFold = [...doc.querySelectorAll('.stat, .rules')].filter(el => el.getBoundingClientRect().top < vh).length;
  const cards = all.filter(el => { const cs = win.getComputedStyle(el); return cs.borderTopWidth !== '0px' && cs.borderTopLeftRadius !== '0px' && el.getBoundingClientRect().height > 60; }).length;
  const top = m => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => k + '×' + v);
  return {
    distinctFontSizes: fontSizes.size, fontSizes: top(fontSizes).slice(0, 14),
    distinctTextColors: colors.size, distinctRadii: radii.size, radii: top(radii),
    boxShadows: shadows, gradientBackgrounds: gradients, blurFilters: blur, emoji, centredLongText: centred,
    paragraphsOver90ch: longLines, maxMeasureCh: Math.max(0, ...measures), ctasAboveFold, headingSkips: skips,
    h1TopPx: h1Top, proofBlocksAboveFold: proofAboveFold, borderedCards: cards, elements: all.length,
  };
}
