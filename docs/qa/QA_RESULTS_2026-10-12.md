# Evidence Explorer QA results: observed, 2026-10-12 (Claude Code)

This file records results that were actually observed. `EVIDENCE_EXPLORER_UI_QA_2026-10.md` is the checklist; anything not listed here is still **open**. Release verdict: **NOT_SUBMISSION_CLEAN**.

## Method
- **Tool:** `tools/qa_capture.ps1`, which runs headless Microsoft Edge on Windows 11.
- **Why iframes:** headless Edge does not go below a 492px viewport. A direct `--window-size=320` screenshot is only a crop of a 492px layout. The first 320/375 "before" screenshots taken that way were invalid and were deleted.
- **How phone widths are rendered:** the page loads inside same-origin iframes at exactly 320, 375, 768 and 1440 CSS px (file://, `--allow-file-access-from-files`). For each width, the collector records clientWidth/scrollWidth, the elements extending past the viewport (scroll containers excluded), the count of interactive elements smaller than 24px, and the classifier verdict after clicking Classify.
- **Limits:** this is an evidence capture, not a WCAG certification.

## R6: BEFORE (deployed commit d35d3fc, worktree of that commit)
Files: `screenshots/before-d35d3fc-{320,375,768,1440}.png` and `before-d35d3fc-metrics.jsonl`.

| Width | Document overflow | Classifier verdict | Interactive elements under 24px |
|---|---|---|---|
| 320 | none (320/320) | No regressions · FULL · 29 inherited | 48 |
| 375 | none | same | 47 |
| 768 | none | same | 45 |
| 1440 | none | same | 49 |

Observed issues:
- Stat cards and result cards stack one per row on phones, which makes a very tall page.
- Navigation links are under 24px tall.
- There is no skip link.
- The reduced-motion rule (b281b15) existed only in the generated `index.html`, so the next rebuild would have removed it.

## Changes made (template.html, Claude Code)
- Stats and result-card grids use `minmax(min(100%,132px|118px),1fr)`, giving two columns at 320px.
- Navigation links get padding and a 32px minimum height.
- A skip link to the classifier demo.
- Explicit focus-visible outlines for selects and buttons.
- The `prefers-reduced-motion` rule moved into the template, and it now also disables transitions and animations.
- `<main id="main">`.

## R6: AFTER (working tree before commit)
Files: `screenshots/after-final-*.png` and `after-final-metrics.jsonl` (re-captured after the contrast fix; identical metrics).

| Width | Document overflow | Classifier verdict | Interactive elements under 24px |
|---|---|---|---|
| 320 | none | No regressions · FULL · 29 inherited | 40 |
| 375 | none | same | 40 |
| 768 | none | same | 38 |
| 1440 | none | same | 42 |

The remaining small targets are mostly inline text links inside paragraphs, which WCAG 2.5.8 exempts, and links in the collapsed commit list. This has not yet been checked element by element.

## R1: normalizer and classifier tests
```
python -m unittest discover -s py -p "test_*.py"
```
Result: 20 tests, OK. They cover:
- full, targeted, new failure, regression, fixed, skipped
- expected failure / unexpected success
- empty, crashed and timeout runs, and count mismatch
- terminal status disagreeing with the per-test results
- mid-line warnings and docstring lines
- unsupported schema and invalid baseline
- CRLF/LF equality, and BOM/UTF-16 JSON

The parity gate `python py/parity_check.py` gives 5/5 cases identical between Python and the browser. CI has run it on every push since d35d3fc.

## R2: fresh install (kit commit 93c611d)
Raw output: private `tooling/state/onramp/R2_fresh_install_2026-10-12.txt`.

Procedure: copy only `.bob/` into an untouched clone, run `init-profile --write`, run the verbose test suite, then `normalize` and `classify`.

| Clone | Generated profile | Normalized run | Classified |
|---|---|---|---|
| Django (Healthchecks at upstream 0968fa2) | framework `django` | valid, 1761 tests | FULL, 29 inherited, 0 regressions |
| Flask (TaskFlow at a380909) | framework `unittest` | valid, 4 tests | FULL, 1 inherited, 0 regressions |

**Defect found and fixed:** the first R2 attempt failed. PowerShell's `>` writes JSON with a UTF-8 BOM, and `classify` could not read it. Kit commit 93c611d adds `load_run()` and a test for this.

## Deployed AFTER: commit 39a3dcf (Pages deployment and parity CI both success for this SHA)
Checked in Chrome through the Claude in Chrome extension against https://kniggukniggu-droid.github.io/onramp-evidence/, plus curl.

| Check | Result |
|---|---|
| Links | 34 unique. The 6 same-site links return 200. All 28 GitHub links (repo, deck PDF, corrections, actions, commits) return 200 via `curl -L`. |
| Console | No errors or exceptions after load and classification. |
| Focus | 36 elements are reachable while all sections are collapsed, and every one shows a visible focus outline after `focus()`. 23 commit links inside the closed "All Bob commits" `<details>` are correctly unreachable until it is opened. |
| Tab order | Skip link, then the 7 nav links, then the CTAs, then the demo controls (DOM order, no positive tabindex). |
| Skip link | Visible on focus (top 8px). |
| Structure | 1 h1, 6 h2. Both selects are wrapped in `<label>`. The verdict uses `role=status` with `aria-live=polite`. |
| Error state | A missing data file shows the warning verdict "could not load missing_file.json", and the button re-enables. |
| Classifier on the deployed site | Full: 0 regressions, 29 inherited. Targeted: 1,761 not run, 0 fixed. Synthetic: 1 regression. Crash: INCONCLUSIVE. |

Test-method limit: simulated Tab key presses from the extension did not move focus, because the Chrome window lacked OS focus. Focus was therefore checked programmatically, not by a human pressing Tab.

## Still open
- **Screen-reader pass:** NVDA or Narrator, needs a human.
- **Measured contrast ratios:** not taken.
- **200% zoom:** not tested directly. The 375 and 768px reflow results are the proxy.
- **Slow and offline network:** not tested.
- **Demo video link:** none yet.
- **#1090 before/after screenshots:** not taken.

## Contrast (computed from the palette tokens, WCAG relative-luminance formula)
- Before: dark-theme white text on the blue primary buttons was **3.35:1** (fails AA 4.5:1). Light-theme status/accent colours on the result-card background (#f0f2f6) were 4.45–4.48:1 (just under).
- Fix: new `--btn` token (dark #2563eb, 5.17:1; light #0f62fe, 5.0:1) for primary buttons, Classify and the skip link; light `--panel2` #f7f8fa (all text colours ≥ 4.69:1).
- After: every text/background pair in both themes is ≥ 4.5:1 (lowest: light status colours on cards, 4.69:1).
- Not measured by a tool on rendered pixels; computed from the CSS values.

## 200% zoom
Not tested directly. At 200% zoom a 1440px window lays out at 720 CSS px; the 768 and 375px captures show no overflow, so reflow at that size is expected to hold. Recorded as approximate.
