# Experiment B: Anthropic `frontend-design` skill applied to the Evidence Explorer

**Prompt used:** https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md (Apache-2.0, last commit 2026-09-03). It was found by the web/GitHub research agent, and its process was followed as written: plan, review against the brief, build, critique screenshots, remove one accessory.

Variant **A** is the page as deployed at f2414fd. Variant **B** is the same page rebuilt from the plan below. Both are measured by the same bench (`tools/qa_variant.ps1`: overflow, rendered contrast, anti-slop metrics; plus `qa_capture.ps1` for the demo verdicts).

## Pass 1: design plan
- **Subject:** test evidence for a code change made by an AI agent in an unfamiliar repo.
- **Audience:** hackathon judges, who scan, then verify.
- **Primary job:** show that OnRamp never mistakes an inherited failure for a regression, and prove it with real runs.
- **Colour (named hex):**
  - Night `#0d0f14` (ground)
  - Ink `#e8eaef`
  - Signal blue `#5b9aff` (actions and focus only)
  - Status: Inherited amber `#f1c21b`, Regression red `#ff6b74`, Fixed green `#42be65`, Not-run violet `#b48cff` (data, not decoration)
- **Type:** IBM Plex Sans for everything readable. IBM Plex Mono **only** for real artifacts: logs, diffs, hashes, test ids.
- **Layout:** left-aligned throughout.
  ```
  [H1 problem statement        ] [Truth table: how OnRamp decides]
  [lede, 2 specific CTAs       ] [ (the product's actual logic)   ]
  [Summary table, Jepsen style: Baseline | After fix | Blind fix | Built by Bob]
  [Classifier: pick a run -> flow -> verdict | Fig. 1 Suite map (3D)]
  [Explore table] [Fix: Fig. 2/3 diffs, then 4 steps with real excerpts] [Build figures] [Reuse runs] [Provenance]
  ```
- **Principles:**
  - Evidence over ornament.
  - Spend boldness in one place: the live classifier plus the suite map.
  - Every monospace string is real data.
  - Figures are captioned with their source.

## Review against the brief (what read as a generic default, and what changed)
| A had | Why it reads generic (skill / research) | B does instead |
|---|---|---|
| Tracked ALL-CAPS kicker above the H1 | Template chrome; "unnecessary typographic labels above content" | Removed. The event context is a plain sentence under the CTAs. |
| Big-number stat cards with a bar | "A big number with a small label, supporting stats… is the default treatment" | A Jepsen-style summary table: row label, number, plain-language evidence with commit/file references |
| Radial-gradient haze plus parallax in the hero | Ambient "spotlight haze" decoration; motion not answering an action | Removed. The hero's one visual is the truth table, which explains the product. |
| Mono uppercase section labels ("01 · EXPLORE") | Mono as costume; tracked caps; middle-dot meta strings | Removed. Headings carry the meaning. Mono is kept for code only. |
| Middle-dot strings and spaced em dashes in copy | Listed as a tell | Rewritten as sentences, commas or colons |
| ✓ glyphs as icons in proof lists and the verdict strip | Unicode glyphs as icons | Proof list dropped (the summary table replaces it). Strip items carry text and a small status shape. |
| Fade-up reveal on every section, hover lift on every card | "Fade-and-slide-up entrances on each section and hover transitions on every card… read as AI-generated" | Kept only: the scroll-played blind-fix sequence (one orchestrated moment) and motion that answers the user (verdict, cards, map recolour). |
| Glowing node (zero-offset glow) | Dark-glow tell | Solid ring, no glow |
| Generic CTA labels ("Get the kit") | CTA should say what happens | "Run the classifier", "Read the kit on GitHub", "Pitch deck (PDF)" |
| Browser defaults | Craft floor (impeccable, Vercel) | `::selection`, `theme-color`, `scrollbar-color`, `caret-color`, `text-wrap: balance/pretty`, `tabular-nums`, 68ch measure, deep-linkable run (`#run=…`) |

## Critique pass (screenshots), and "remove one accessory"
- "Corrections & limitations" wrapped alone under the CTAs. It now sits in the context sentence.
- The rules panel had an accent-coloured glow shadow. Removed.
- **Accessory removed:** the decorative dot grid behind the demo (a texture-only background, the research's tell #29).
- Added from the handoff-package sweep (Open Design anti-slop rules, Apache-2.0, matched by name only): one easing curve `cubic-bezier(.2,0,0,1)` at 150 ms, and a 15-second "still loading" fallback so the loading state never hangs silently.

## Results: same bench, both variants, both colour schemes
Tools: `tools/qa_variant.ps1` with `qa_slop.js` and `qa_contrast.js`; `qa_capture.ps1` for the demo verdicts. File mode, headless Edge.

| Metric | A (f2414fd) | B (promoted) |
|---|---|---|
| Paragraphs > 90 characters per line (768 / 1024 / 1440 px) | 21 / 7 / 8 | **0 / 0 / 0** |
| Longest paragraph measure | 154 ch | **73 ch** |
| Gradient backgrounds | 4 | **1** |
| Distinct text sizes (1440 px) | 13 | **12** |
| Distinct radii | 7 | **6** |
| CTAs above the fold | 3 | **2** (one primary, one secondary; deck is a text link) |
| Middle-dot strings in the page | 25 | **5** (remaining in `<title>`/meta and generated evidence labels) |
| Rendered contrast failures (dark / light) | 0 / 0 | 0 / 0 |
| Overflow at 320 / 375 / 768 / 1024 / 1440 px and at 200 % zoom | none | none |
| Demo verdicts (4 scenarios) | correct | correct |
| Python/JS parity (7 golden cases) | ok | ok |

**Decision:** B is promoted. A is kept locally as `template_a.html` for rollback.

**Not changed, with reasons:**
- The 3D suite map, scroll-played steps and opt-in chime stay. They answer the user or explain an order, which the skill allows.
- Bordered containers (~33) remain the main open taste item. Most are real UI fragments (scenario options, result counts, run cards, diff panes) rather than decoration.

## Second opinion: ChatGPT consultation, 2026-10-13
**Question asked:** should the effects removed in B (haze, parallax/tilt, section fade-ins, count-up tickers) come back? ChatGPT inspected the public commit 754caeb.

**Recommendation:** keep B, and keep all four effects removed:
- **Haze:** the truth table is the better hero visual.
- **Tilt:** it makes evidence behave like a promotional card.
- **Fade-ins:** evidence must be visible immediately.
- **Tickers:** "numbers are evidence, not entertainment".

It found these issues, all fixed in this commit:
- Result cards still counted up from zero. Now the final numbers show immediately, with a 200 ms opacity confirmation.
- "Pause motion" didn't cover everything. It now also suppresses the result transitions and the 3D colour fade; classification itself is never paused.
- **The sound toggle wrote its label into the SVG icon** (a regression from the icon change). Fixed to update the text span.
- Terminal evidence lines were hidden until scrolled to. They are now always visible; scroll only moves the progress node and marks the active step.
- The selected-scenario border beam span. It is now a static 2px border.
- The suite map is now captioned as "a visual index of outcomes, not a dependency graph". Idle auto-rotation was removed; the map only turns when dragged.
- The tooltip is clamped inside narrow containers.
- Nav, sound and pause controls are 44 px. Inline text links are exempt under WCAG 2.5.8.

**Process note it raised:** B was promoted before the participant approved it. Future design swaps go to a preview first, with screenshots and approval. The A rollback is kept.
