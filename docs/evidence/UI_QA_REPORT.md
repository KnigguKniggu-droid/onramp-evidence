# UI QA report: Evidence Explorer (Claude Code, 2026-10-13)

**Status:** R5/R6 pass on automated and programmatic evidence. The human screen-reader pass is open. The release verdict stays **NOT_SUBMISSION_CLEAN**.

## Run context
| Field | Value |
|---|---|
| Tested URL | https://kniggukniggu-droid.github.io/onramp-evidence/ |
| Source SHA | `c42070f` (onramp-evidence `main` = `origin/main`) |
| Deployed SHA | `c42070f`: Pages deploy run 38461455845 succeeded for this SHA |
| Parity CI | Run 38461456091, success at `c42070f` |
| Kit SHA | `30bb017`: Tests, Mypy and Coverage all succeeded |
| Browsers | Chrome 154 (live checks via Claude in Chrome); Microsoft Edge headless on Windows 11 (captures) |
| Timestamps | 2026-10-13, 18:49–20:20 UTC |
| Rollback target | `b717ce8`, the last pre-redesign site commit: `git revert` the range, or redeploy that commit |

## Results
| Check | Method | Result | Evidence |
|---|---|---|---|
| Responsive 320/375/768/1440 | True-width iframes in headless Edge (`tools/qa_capture.ps1`) | No document overflow | `docs/qa/screenshots/final-2026-10-13-{320,375,768,1440}.png` + metrics |
| 200% zoom | DPR 2 at a 640 px CSS viewport (`tools/qa_extra.ps1`) | No overflow, dark and light | `r6-extra-zoom200-*.png`, `final-2026-10-13-extra-metrics.jsonl` |
| Contrast | Computed-style WCAG audit, 327 elements (`tools/qa_contrast.js`) | 0 failures; minimum 5.17 dark, 5.0 light. The first run found 13 light-theme failures at 4.41, fixed in 7958b88. | Metrics jsonl |
| Classifier verdicts | Clicked all four scenarios | Full: green, 0 regressions. Targeted: amber, not full-suite. Synthetic: 1 regression. Crashed: inconclusive. | Metrics jsonl; live check |
| Python/JS parity | `py/parity_check.py` locally, plus CI | All golden cases ok | CI run above |
| Keyboard / focus | Programmatic `focus()` on every control (2026-10-12) | All visible; skip link works | `QA_RESULTS_2026-10-12.md` |
| Accessibility tree | Claude in Chrome, DOM inspection | Named landmarks; headings without skipped levels; labelled radios; `aria-pressed`; live region; no unnamed links or images; `lang=en`; no duplicate ids | `QA_RESULTS_2026-10-13_extra.md` |
| Reduced motion | CSS inspection | No animations or transitions; smooth scroll disabled | `template` CSS |
| Loading / slow | Local server delaying data by 4 s (`tools/qa_netserver.py`) | Loading text plus `aria-busy`; the last selection wins | extra QA doc |
| Error / offline | Data connection dropped | Amber, cause stated, no cards drawn | extra QA doc |
| No JavaScript | `noscript` | Message explains that nothing is classified and points to the raw logs | Page source |
| Fonts blocked | Edge `--host-resolver-rules` | Fallback renders cleanly | `r6-extra-fonts-blocked-1280.png` |
| Console | Claude in Chrome, live | 0 errors or exceptions | Live check at 63e1499 |
| Network | Resource timing, live | 0 failed requests; same-origin plus Google Fonts only | Live check |
| Performance | PerformanceObserver, 3 live loads | LCP 124 / 100 / 88 ms. CLS 0 (0.1085 before 9121f3d). | `MOTION_AND_PERFORMANCE_BUDGET.md` |
| Links | curl crawl of every `href` on the live page | 38 of 38 return 200. The 3 flagged items were the data-URI favicon and the font preconnect origins, not links. | Live crawl at 63e1499 |
| SEO / metadata | Live HTML and HTTP | title, description, canonical, `og:*`, `twitter:*`, robots meta, favicon all present. `robots.txt` and `sitemap.xml` return 200. `/no-such-page` returns 404 with the custom page. | Live check |

## Defects found and fixed this cycle
| Defect | Fix commit | Retest |
|---|---|---|
| 478 px overflow at 320/375 (table forcing a `1fr` column) | 5fa5428 | No overflow |
| Run 1 card wrongly said "Unknown" was its bug | 39b30f5 | Copy correct |
| Light status chips at 3.6–3.8:1; dark red at 4.48:1 | a8ae827 | ≥ 5.4 / ≥ 4.7 |
| Light accent on band at 4.41:1 | 7958b88 | 0 failures |
| Stale result possible under slow network | 7958b88 | Race test passes |
| Targeted run shown green | 63e1499 | Amber |
| Kit commit and upstream pin conflated | 63e1499 (site), 30bb017 (README) | Text verified |
| No canonical, robots, sitemap, 404 or noscript | 63e1499 | Live checks pass |
| CLS 0.1085 from font swap | 9121f3d | CLS 0 ×3 |
| 7 radii and 11 type sizes | c42070f | Re-QA passes |

## Remaining limitations
- No human screen-reader listening pass yet (NVDA or Narrator).
- Performance was measured on one desktop machine with a warm cache. Throttled mobile was not measured, and neither was INP.
- Keyboard focus was checked programmatically, because simulated Tab presses don't move focus when Chrome lacks OS focus.
- `robots.txt` under the `/onramp-evidence/` subpath is not read by crawlers. The meta tag is the effective directive.
- No demo-video link yet.
