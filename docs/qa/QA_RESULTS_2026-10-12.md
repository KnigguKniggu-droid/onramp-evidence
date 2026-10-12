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
Files: `screenshots/after-wip-*.png` and `after-wip-metrics.jsonl`.

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

## Still open
- **Keyboard trace and screen reader:** not done.
- **200% zoom and contrast measurement:** not done.
- **Link and HTTP check on the deployed AFTER site:** not done.
- **Console/network and slow/offline states:** not checked on the deployed AFTER site.
- **Demo video link:** none exists yet.
- **Deployed-SHA association:** must be checked after publishing.
