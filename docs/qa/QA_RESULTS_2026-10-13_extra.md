# R6 remaining checks, 2026-10-13 (Claude Code)

## Rendered contrast (`tools/qa_extra.ps1` + `tools/qa_contrast.js`)
- **Method:** with every `<details>` opened, all 327 visible text-owning elements were checked. For each one the script computes its text colour against its effective background, compositing alpha up the ancestor chain, using the WCAG 2.x formula. Large text must reach 3:1; everything else 4.5:1.
- **First run:**
  - Dark theme: 0 failures, minimum 5.17:1.
  - Light theme: 13 failures at 4.41:1. These were the accent links and section labels on the grey band sections. The earlier token calculation had missed this pair.
- **Fix:** light `--accent` changed from #0f62fe to #0050e6.
- **Re-run:**
  - Dark theme: 0 failures, minimum 5.17:1.
  - Light theme: 0 failures, minimum 5.0:1.
- **Limit:** this reads computed styles, not screen pixels. Text over images or gradients would be skipped, and none was found.

## Direct 200% zoom
- **Method:** Edge rendered the page at `--force-device-scale-factor=2` with a 640px CSS viewport. That is the layout a 1280px window produces at 200% browser zoom, including which media queries match.
- **Result:** no horizontal overflow in either theme, and the verdict renders.
- **Screenshots:** `r6-extra-zoom200-{dark,light}.png`.

## Slow and offline network (`tools/qa_netserver.py`, local server)
- **Slow** (every `data/*.json` response delayed 4 s):
  - The verdict shows "Loading test runs and classifying…" and the cards carry `aria-busy=true`.
  - In a 300 ms double-click race (synthetic run, then the crashed run), the final verdict matched the last selection.
  - A sequence guard added in this pass stops an earlier, slower load from drawing over a newer selection.
- **Offline** (connection dropped for data requests): the page renders and both images load. The demo shows the warning "The demo data could not be loaded (Failed to fetch) — nothing was classified. Reload or pick a run again to retry." No cards are drawn and `aria-busy` is cleared. The page fails closed.
- **Fonts blocked** (Edge `--host-resolver-rules` maps the Google Fonts hosts to NOTFOUND): the page falls back to system fonts with the layout intact (`r6-extra-fonts-blocked-1280.png`).

## Accessibility tree (a proxy for a screen reader, not a substitute)
- **Landmarks:** nav and aside are named; header, main and footer are present.
- **Headings:** 1-2-2-2-2-3-3-2-2-2-3-3, with no skipped levels.
- **`lang`:** `en`.
- **No defects found:**
  - no duplicate ids
  - every image has alt text
  - every link has a text name; the 29 that look empty in `innerText` are inside closed `<details>`
- **Demo controls:**
  - Each radio's label reads its name, size and real/synthetic tag, e.g. "Full suite after Bob's work 1,767 tests real run".
  - The fieldset legend is "Later run".
  - Result buttons read e.g. "29 inherited" and expose `aria-pressed`.
  - The verdict is `role=status`, `aria-live=polite`.
- **Still needs a human:** listening with NVDA or Narrator.

## Regression after these fixes
`qa_capture.ps1` shows no overflow at 320, 375, 768 or 1440px, and all four scenario verdicts are correct. `py/parity_check.py` reports ok on every golden case.
