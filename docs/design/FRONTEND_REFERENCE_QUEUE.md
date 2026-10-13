# Frontend reference queue: decisions and evidence

> **Revision, 2026-10-13 (evening).** At the participant's direction, the previously rejected families are now implemented: 3D (Three.js suite map), liquid gradient, scroll-played sequence (GSAP ScrollTrigger), cloth/parallax/chime, cinematic reveals and Magic UI-style beams and tickers. Each serves a stated purpose with a fallback; see `REFERENCE_REGISTRY.md` § Revision and the design brief. The table below is the earlier record.

Claude Code, 2026-10-13. Each candidate family was evaluated against one question: does it help a judge **explain, orient, prove, compare or guide**? The default was no new dependency. Four families were implemented and the rest rejected, with reasons.

| Candidate family | Serves | Decision | What was built, or why not | Static fallback / reduced motion | Evidence |
|---|---|---|---|---|---|
| Judge-first hierarchy and spacing audit | Orient | **IMPLEMENTED** | Hero: one message, one primary CTA, a decision-rules panel and a proof line. The stats band sits directly under it. Each section follows the pattern number, heading, one-line takeaway, then evidence. | No motion involved | `docs/qa/screenshots/after-redesign-*`, `final-2026-10-13-*` |
| Layered composition (the GetLayers principle) | Explain | **IMPLEMENTED (principle only)** | Three hero layers, each with one job: statement, how-it-decides rules, proof. Depth comes only from panels and borders, with no blur over content. | Same | Same |
| Meaningful loading and failure states (the reactive-scene principle) | Guide / prove | **IMPLEMENTED** | Text loading state with `aria-busy`. Offline and failed-load message. Stale-result guard. `noscript` message. Crashed runs show "Inconclusive — no verdict". The targeted-run verdict is amber, never green. | Text only, no looping loader | `QA_RESULTS_2026-10-13_extra.md`; UI QA report |
| Purposeful micro-detail | Compare | **IMPLEMENTED** | Chips coloured by state (inherited, regression, fixed, not run). A coloured top edge on each run card shows its outcome. Monospace section numbers. Each scenario is tagged real or synthetic. | No transitions | Screenshots |
| Prepublish / SEO gate | Guide | **IMPLEMENTED** | Canonical, `og:url`, Twitter title and description, a robots meta tag, `robots.txt`, `sitemap.xml` and a 404 page | — | UI QA report §SEO |
| 3D / liquid / gradient / depth / distortion | — | **REJECTED** | Nothing on the page needs a 3D or liquid metaphor, and each would add GPU cost and a separate fallback | — | — |
| Scroll-played sequence | Explain | **REJECTED** | The four-step blind-fix timeline is clearer as static numbered steps | Static steps are the only version | — |
| Cloth / parallax / chime | — | **REJECTED** | No state change benefits from it, and audio would be inappropriate | — | — |
| Cinematic section motion (MotionSites / Awesmos) | — | **REJECTED** | Reveal-on-scroll would delay reading of evidence | — | — |
| Animated component libraries (Magic UI, Motion, GSAP) | — | **REJECTED** | They need a React toolchain or a non-OSI licence, for no comprehension gain | — | — |

The only motion on the page is native smooth scrolling for in-page anchors, which `prefers-reduced-motion: reduce` turns off. There are no CSS transitions or animations.
