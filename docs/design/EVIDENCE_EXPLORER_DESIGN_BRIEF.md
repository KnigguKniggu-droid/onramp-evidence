# Evidence Explorer: design brief (the team, updated 2026-10-13)

## Objective and audience
**Objective:** let a hackathon judge understand OnRamp in seconds and check its claims in minutes. OnRamp is an IBM Bob kit that separates inherited test failures from new regressions.

**Audience:**
- **Primary:** AngelHack × IBM judges, scanning quickly on a laptop.
- **Secondary:** engineers who open the raw logs and the diffs.

## Judge-first information architecture
1. **Hero (first viewport):**
   - **Problem statement:** "Know what's broken before you fix it."
   - **The kit's role:** the lede.
   - **One primary action:** "Try the classifier".
   - **Secondary links:** kit, deck, and later the video.
   - **"Corrections & limitations":** a text link.
   - **How it decides:** a rules panel.
   - **Stats band:** sourced numbers.
2. **Try it.** A real classifier over normalized real and synthetic runs. The result is visible on load.
3. **01 Explore.** Inherited failures and why they fail.
4. **02 Fix.** The blind fix against the maintainer's: the verdict strip and diffs first, then the steps. The brief and the limits of the seal are in a `<details>`.
5. **03 Build.** #1090 before and after.
6. **04 Reuse.** The three portability runs.
7. **05 Provenance.** What Bob did and what the team did, then the commits.

The classifier is the product proof. These four things are presented as distinct:
- the Healthchecks benchmark
- the TaskFlow portability runs
- the browser viewer
- Bob's modes inside the IDE

## Design tokens
| Role | Dark | Light | Used for |
|---|---|---|---|
| `--bg`, `--band`, `--panel`, `--panel2` | #0d0f14, #11141b, #161a23, #1d2130 | #f6f7f9, #eef1f5, #fff, #f7f8fa | page, alternating sections, cards, neutral cells |
| `--text`, `--muted` | #e8eaef, #a0a8ba | #161a22, #525c6e | body, secondary |
| `--accent` | #5b9aff | #0050e6 | links, focus, selection |
| `--btn` | #2563eb | #0f62fe | primary button (white text) |
| `--ok` | #42be65 | #0e6027 | fixed, no regressions, real-run tag |
| `--bad` | #ff6b74 | #a2191f | regression, new failure |
| `--warn` | #f1c21b | #684e00 | inherited, synthetic, targeted / inconclusive |
| `--info` | #b48cff | #6929c4 | not run |

Colour always carries meaning, and every state also has a text label, so nothing relies on colour alone. Tinted backgrounds are the state colour at 13–14% via `color-mix`.

## Typography and spacing
- **Typefaces:** IBM Plex Sans for text and IBM Plex Mono for code and section numbers. Both load with `display=optional` and fall back to system-ui / Consolas.
- **Display sizes:**
  - h1: `clamp(34px, 6vw, 58px)`
  - h2: `clamp(24px, 3.4vw, 34px)`
  - lede: `clamp(16px, 2vw, 19px)`
- **Body sizes:** 16 / 14 / 13 / 12 px. This was consolidated on 2026-10-13 from 11 sizes.
- **Measure:** takeaways are capped at 780px and the lede at 620px.
- **Spacing:**
  - 8px base rhythm, with gaps of 6/8/10/12/16/22 px
  - sections 56px tall, 40px under 640px
  - page gutter 20px
- **Radii:** 6 (focus ring), 8 (skip link), 12 (every container) and pill. Consolidated from 7 values.

## Component inventory
- **Nav:** sticky and horizontally scrollable on phones, with a 32px minimum target height.
- **Buttons:** primary and secondary, 44px minimum height.
- **Rules grid:** ARIA table.
- **Stats band.**
- **Scenario radio group:** a fieldset with a legend; each option shows real/synthetic tags.
- **Verdict:** `role=status`, polite.
- **Result buttons:** `aria-pressed`; they reveal a list of test IDs.
- **Tables:** inside a `.scroll` wrapper.
- **Diffs:** bounded horizontal scroll.
- **Steps, figures, run cards, provenance panels, timeline.**
- **`<details>` disclosures.**
- **Footer.**

## Interaction states
- **Verdict states:**

  | State | Treatment |
  |---|---|
  | loading | neutral, `aria-busy` |
  | full and clean | green |
  | full with regressions | red |
  | targeted | amber, never green |
  | invalid or crashed | amber "Inconclusive — no verdict" |
  | load failure or offline | amber, with retry guidance |
  | no JavaScript | `noscript` message |

- **Rapid re-selection:** a sequence guard draws only the latest selection.

## Motion
- The page has no animations or transitions.
- In-page anchors use smooth scroll, which `prefers-reduced-motion: reduce` disables.
- There is no scroll-jacking or parallax, and no content is revealed only by animation.

## Responsive behaviour
- **Grid columns:** all use `minmax(0,1fr)`, so a wide child scrolls inside itself instead of widening the page.
- **900px breakpoint:** the hero stacks, results go to 4 columns, steps to 2, run cards to 1.
- **640px breakpoint:** stats, scenarios and results go to 2 columns; panels go to 1.

## Accessibility requirements
- **Contrast:** WCAG 2.2 AA (4.5:1 text, 3:1 large text) in both themes, measured on computed styles.
- **Keyboard:** fully operable, with a visible `:focus-visible` outline and a skip link.
- **Structure:** semantic landmarks and no skipped heading levels.
- **Labels:** labelled controls.
- **Announcements:** live-region verdicts.
- **Reflow:** 200% zoom without loss.
- **Targets:** at least 44px except inline links, which WCAG 2.5.8 exempts.

## Evidence integrity rules
- Every number is generated by `build_site.py` from the evidence files and git, and nothing is typed in by hand.
- Python normalizes the raw logs. JS only classifies validated `onramp.run/1` JSON, and CI checks that the two agree exactly.
- A targeted run never shows green. Runs that didn't execute are "not run", never "fixed".
- The historical report is linked as superseded, and the corrected report is primary.
- Synthetic runs are labelled on the control itself.
- The demo is described as a browser classifier, not a live Bob session.

## Design audit (derived discipline; no Apple assets or trade dress)
| Check | Result, 2026-10-13 |
|---|---|
| Message understood immediately | The h1 states the problem; the rules panel shows the mechanism in the same viewport |
| One primary action per decision point | Hero: "Try the classifier". Demo: the scenario choice. Sections: one optional disclosure each. |
| Rational type scale, readable measure | Consolidated scale; measure capped |
| Consistent spacing, radii, controls | Consolidated; one card treatment, one button system |
| Colour means something | Only state colours plus one accent |
| Every element earns its place | Each section has one takeaway; secondary detail sits in `<details>` |
| Composed at phone width | 320 and 375 px screenshots |
| Evidence above effects | There are no effects |
| Credible when JS, fonts or network fail | noscript, font fallback and offline message, all tested |

## Anti-vibe-coding gate
| Failure mode | Status |
|---|---|
| Gradients, glassmorphism, glow | None, apart from the one translucent sticky nav |
| Card soup | Cards only group like items: scenarios, results, runs |
| Hero pushing proof below the fold | The stats band is visible in the first 1440×900 viewport |
| Decorative 3D | None |
| Inconsistent radii, spacing, controls | Fixed (consolidation) |
| Dead buttons | Every button and link is exercised by QA, and all 38 links return 200 |
| Fake metrics or placeholder copy | Every metric is generated from the evidence. The video button appears only when `VIDEO_URL` exists. |
| Loading state that never resolves | Loads resolve or fail into a message; there is no infinite spinner |
| Vague error copy | Errors name the cause (offline, or the fetch error) and say what to do |
| Scroll-jacking, motion blocking reading | None |
| Breaks at 320 / 375 / 768 / 1440 | No overflow (captures) |
| Simulated demo presented as live Bob | Explicitly labelled as not a live Bob session |

## Visual feature register
| Feature | Purpose | Responsive | Reduced motion | Fallback | Cost | Source | QA |
|---|---|---|---|---|---|---|---|
| Rules panel | Explain classification | Stacks under the hero ≤900px | Static | Plain HTML | ~1 KB CSS | Classifier rules in `classifier.js` | Screenshots, contrast |
| Stats band | Prove | 4 columns, then 2 | Static | Plain HTML | ~0.3 KB | `baseline.json`, git log | Values match the evidence |
| Scenario cards + verdict | Prove / compare | 4 columns, then 2 | Static | noscript message | Inline JS ~3 KB + `classifier.js` | Normalized fixtures | 4 verdicts, slow, offline, race |
| Verdict strip + diffs | Compare | 2 columns, then 1; diff scrolls internally | Static | Plain HTML | ~1 KB | Bob 5f16187 / upstream 0a9bff9 | Screenshots |
| #1090 figures | Prove the feature | 2 columns, then 1 | Static | Alt text | 2 PNGs, cropped | Local dev-server captures | Images load at 660px |
| Run cards | Compare runs | 3 columns, then 1 | Static | Plain HTML | ~0.5 KB | TaskFlow baselines | Copy check (run 2 note) |
| IBM Plex | Hierarchy, IBM context | — | — | system-ui | 2 requests; `display=optional` | IBM/plex (OFL-1.1) | CLS 0 after the fix |

## Enhancement layer (added 2026-10-13 evening)
| Feature | Purpose | Owner | Responsive | Reduced motion | Fallback | Cost | QA |
|---|---|---|---|---|---|---|---|
| Liquid-gradient hero | Depth and identity behind the statement | CSS `.liquid` | Clipped inside the hero | Static | Static gradient | 3 radial gradients, no blur, paused off-screen | Contrast audit 0 failures; no overflow |
| Hero parallax and panel tilt | Spatial continuity (cloth/parallax idea) | `fx.js` + GSAP `quickTo` | Fine pointers only | Off | Static | Negligible | Manual pointer check |
| Bento proof band | Shows 1,761 = 1,732 passing + 29 failing at a glance | CSS `.stats`, `.suitebar` | 4, then 2 columns | Static | — | — | Screenshots |
| Evidence-flow beam | Shows the pipeline state while classifying, then the verdict colour | CSS `.flow` + inline script | Classifier node hidden ≤640px | No sweep | Text loading state | CSS only | 4 scenarios |
| Border beam | Marks the selected run | CSS `@property` conic gradient, 2 iterations | — | Off | Static accent border | Brief repaint | — |
| 3D suite map | Shows *which* tests a run classifies how; modules form bands (the 26 AF_UNIX failures cluster) | `fx.js` + Three.js r160 | Full width ≤900px | No auto-rotation, no colour fade | No-WebGL text; the cards carry the counts | 670 KB JS, loaded lazily when visible and idle; render loop idles after 6 s | Live test: targeted run turns the whole sphere "not run" |
| Scroll-played blind-fix steps | Makes the order sealed → test → fix → reveal felt, not just read | GSAP ScrollTrigger scrub, no pin | — | Static, full opacity | Static steps | — | Measured progress 0 → 0.11 → 0.34 → 0.57 → 0.91 while scrolling |
| Number tickers | Draw the eye to proof numbers | GSAP | — | Off | Final numbers | — | Accessible names keep the final value (`aria-label` / `.sr` span) |
| Opt-in chime | Audible verdict: rising = clean, falling = regression, flat = inconclusive or targeted | WebAudio, `fx.js` | — | Allowed (sound is not motion) but **off by default** | Silent | No files | Toggle: `aria-pressed` with a constant name |
| Keys 1–4 | Fast scenario switching (UI UX Pro Max "keyboard shortcuts" must-have) | Inline script | Hint hidden ≤640px | — | Radios | — | Active only while focus is in the demo (WCAG 2.1.4) |

## Rejected directions
Still rejected: React or Svelte rewrites, pinned or scroll-jacked sections, autoplaying sound, blur-filter glassmorphism over evidence, and testimonials or vanity metrics. 3D, liquid gradient, scroll-played sequences, parallax and an opt-in chime were **adopted** on 2026-10-13 (see the enhancement layer above). The reasons are in `FRONTEND_REFERENCE_QUEUE.md`.

## Acceptance criteria
All of these are met; the evidence is in `docs/evidence/UI_QA_REPORT.md`:
- no document overflow at 320, 375, 768 or 1440 px, nor at 200% zoom
- 0 contrast failures in both themes
- all four demo verdicts correct, with Python/JS parity green in CI
- no console errors and no failed requests
- CLS ≤ 0.10 and LCP ≤ 2.5 s, as measured
- every link resolves
- correct 404 behaviour

Still open, and needing a human: a screen-reader listening pass, and the video link.
