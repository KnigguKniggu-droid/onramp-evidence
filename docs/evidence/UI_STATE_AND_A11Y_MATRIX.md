# UI state and accessibility matrix: results (the team, 2026-10-13)

Site SHA c42070f, unless a row says otherwise.

| Component | State / scenario | Expected | Observed | Result |
|---|---|---|---|---|
| Hero / nav | 320–1440 px, 200% zoom | No overflow; nav scrolls horizontally | scrollWidth = clientWidth at 320/375/768/1440, and at 640 CSS px with DPR 2 | PASS |
| Hero / nav | Keyboard | Skip link first, visible focus | Skip link is visible on focus. 36 reachable controls all show an outline (programmatic check, 2026-10-12). | PASS (programmatic) |
| Hero / nav | No JavaScript | Content and links still available | All content is static HTML. The demo shows a `noscript` message. | PASS (by construction) |
| Scenario selector | Full run | Green "No regressions · full run · 29 inherited" | As expected | PASS |
| Scenario selector | Targeted run | Never green; states what it does not prove | Amber "Targeted run, not a full-suite result … 1,761 baseline tests did not run, so none count as fixed" | PASS |
| Scenario selector | Synthetic regression | Red, counted as a regression | "1 new failure found (1 regression, 0 new failing test)" | PASS |
| Scenario selector | Crashed / unsupported schema | No verdict | "Inconclusive — no verdict …"; unsupported_schema is invalid in parity | PASS |
| Scenario selector | Rapid re-selection | No stale result | 300 ms double selection on a 4 s delayed server: the final verdict matched the last pick (sequence guard) | PASS |
| Scenario selector | Slow network | Visible loading state | "Loading test runs and classifying…", with `aria-busy=true` | PASS |
| Scenario selector | Offline / failed fetch | No green, readable reason | Amber "The demo data could not be loaded (Failed to fetch) — nothing was classified…", no cards drawn | PASS |
| Result buttons | Click / keyboard | List of test IDs; `aria-pressed` | Names read e.g. "29 inherited"; `aria-pressed` toggles | PASS |
| Verdict | Announcement | Live region | `role=status`, `aria-live=polite` | PASS (tree); listening pass OPEN |
| Links | All | Resolve | 38 of 38 page links return 200 (live crawl at 63e1499; no links added since) | PASS |
| Diffs / tables | 320 px | Scroll inside their own container | No document overflow | PASS |
| `<details>` | Collapsed / expanded | Native Enter/Space; content not lost | Native `<details>`; the contrast audit ran with all of them open | PASS |
| Motion | `prefers-reduced-motion` | No motion | No animations or transitions exist; smooth scroll is disabled | PASS (CSS inspection) |
| Contrast | Dark / light | ≥ 4.5:1 (3:1 for large text) | 327 elements, 0 failures; minimum 5.17 (dark), 5.0 (light) | PASS |
| Fonts blocked | Google Fonts unreachable | Readable fallback | system-ui, layout intact | PASS |
| Metadata | Title, description, canonical, OG, Twitter, robots | Present and correct | Present in the live HTML | PASS |
| 404 / deep links | `/no-such-page`; `#blind` | Real 404 with a way back; anchor resolves | 404 status with the custom page; `#blind` returns 200 and the target `id="blind"` exists (the scroll itself is native browser behaviour) | PASS |
| Screen reader | NVDA / Narrator listening pass | Coherent reading order and announcements | Accessibility-tree proxy passed | **OPEN (human)** |
