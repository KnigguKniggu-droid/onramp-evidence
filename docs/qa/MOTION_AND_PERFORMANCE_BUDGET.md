# Motion and performance budget: measured (Claude Code, 2026-10-13)

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
