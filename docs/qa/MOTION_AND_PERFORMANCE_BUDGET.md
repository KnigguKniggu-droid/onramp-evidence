# Motion and performance budget: measured (the team, 2026-10-13)

**Measurement conditions:**
- live site https://kniggukniggu-droid.github.io/onramp-evidence/
- Chrome 154 on Windows 11, desktop viewport, home network
- `PerformanceObserver` in the page

These are lab numbers on a fast machine, not field data or throttled mobile.

| Metric | Budget | Measured | Result |
|---|---|---|---|
| LCP | ≤ 2.5 s | 124 / 100 / 88 ms over 3 loads at 9121f3d; the LCP element is the h1 | PASS (desktop, warm cache) |
| CLS | ≤ 0.10 | **0.1085 at 63e1499 (FAIL)**, then 0 / 0 / 0 at 9121f3d | PASS after the fix |
| FCP | — | 132 ms at 63e1499 | — |
| DOMContentLoaded / load | — | 124 ms / 184 ms | — |
| Page weight | — | HTML 12 KB transferred. 6 resources, 12 KB total transfer on that load (fonts were cached). | — |
| Failed requests | 0 | 0 | PASS |
| New third-party scripts | 0 | 0 scripts. Fonts come from Google Fonts (registry: ADOPTED). | PASS |
| JS added by the redesign | ≤ 20 KB | ~3 KB inline, plus the existing `classifier.js` | PASS |
| WebGL / canvas | none | none | PASS |
| Motion | purposeful only, ≤ 220 ms | No transitions or animations. Smooth anchor scroll only, disabled under reduced motion. | PASS |
| 200% zoom / 320px reflow | no loss | no overflow | PASS |
| Slow / offline | no fake green | loading state, then the result; offline shows a warning and draws no cards | PASS |

**The CLS fix:** the only layout shift came at 177 ms, when IBM Plex replaced the fallback font. The wider glyphs rewrapped the hero proof line and pushed the content down 28px. Loading the font with `display=optional` removed the shift. The trade-off is that a first visit on a slow connection may render in system-ui for that page view.

**Not measured:**
- INP, because there are no long tasks to provoke it
- LCP on throttled mobile, or with a cold cache across a CDN edge

## Re-measurement with the enhancement layer (live 9973efb, 2026-10-13)
Same machine and Chrome; one cold load of the deployed site.

| Metric | Budget | Measured | Result |
|---|---|---|---|
| LCP | ≤ 2.5 s | 304 ms | PASS |
| CLS | ≤ 0.10 | 0 | PASS |
| Failed requests / console errors | 0 | 0 / 0 | PASS |
| Three.js loading | Lazy | Not requested before the suite map scrolled into view; loaded after | PASS |
| Total transfer after scrolling to the map | — | ~300 KB (GitHub Pages compression) | — |
| JS added | Budget raised for the 3D map | `three.module.min.js` 670 KB raw; GSAP + ScrollTrigger 115 KB raw; `fx.js` ~15 KB | ACCEPTED (justified exception, see below) |
| WebGL | Allowed for the suite map only | One canvas; the render loop idles 6 s after the last interaction or colour change; no rendering while off-screen or in a hidden tab | PASS |
| Motion | Purposeful; reduced motion respected | All CSS keyframes (including pseudo-elements), GSAP tweens and 3D rotation are off under `prefers-reduced-motion`; captures `fx-http-reduced-*` | PASS |

**Budget exception:** the 20 KB JS budget assumed no 3D. The participant directed that Three.js be used. It is kept off the critical path (lazy, idle-time load, module script), and LCP and CLS are unchanged. The rows measured earlier at 9121f3d are kept above as history.
