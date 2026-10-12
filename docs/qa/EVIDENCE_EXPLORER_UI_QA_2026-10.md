# Evidence Explorer UI QA Report — October 2026

**Test period:** 2026-10-12 to 2026-10-18  
**Tested SHA:** d35d3fc (current main)  
**Deployed URL:** https://kniggukniggu-droid.github.io/onramp-evidence/  
**Test environment:** Chrome/Edge on Windows 11, mobile viewports  
**QA lead:** Claude Code  

---

## 1. Responsive Testing (UI-08: IN PROGRESS)

### 1.1 Viewport: 320px (Mobile SE)

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **No document-level overflow** | PENDING | Not yet tested with actual browser | Screenshot required |
| **Sticky nav reflow** | PENDING | Navigation should be readable at 320px | Screenshot + focus trace |
| **Button/CTA readability** | PENDING | Primary CTA "▶ Try the classifier" should fit | Screenshot at 320px |
| **Table horizontal scroll** | PENDING | Baseline error table should have scroll affordance | Screenshot + interaction test |
| **Code diff readability** | PENDING | Monospace 12.5px in scrollable container | Screenshot + overflow check |
| **Touch target sizing** | PENDING | All interactive elements ≥44×44px | Measure buttons, selects, cards |
| **Form control sizing** | PENDING | `<select>` elements readable and tappable | Screenshot |

### 1.2 Viewport: 375px (iPhone 12)

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Full content visible** | PENDING | Hero, statistics, demo, sections | Screenshot |
| **CTA button spacing** | PENDING | Flex-wrap working; no overlap | Screenshot |
| **Navigation overflow** | PENDING | Sticky nav not wrapping aggressively | Screenshot |
| **Readability (lede text)** | PENDING | `clamp(16px, 2.2vw, 18px)` working | Screenshot |

### 1.3 Viewport: 768px (Tablet)

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Grid layouts** | PENDING | auto-fit columns adjust for medium width | Screenshot |
| **Table readability** | PENDING | Not requiring horizontal scroll if possible | Screenshot |
| **Diff side-by-side** | PENDING | Two diffs (Bob vs maintainer) layout | Screenshot |

### 1.4 Viewport: 1440px (Desktop)

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Full-width utilization** | PENDING | Content centered at 1080px; padding balanced | Screenshot |
| **Sticky nav positioning** | PENDING | Stays visible, not interfering with content | Screenshot |
| **All sections readable** | PENDING | No line-length issues; hierarchy clear | Screenshot |

### 1.5 Zoom and Reflow

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **200% browser zoom** | PENDING | Page reflows; nav remains usable; no overlap | Screenshot at 200% |
| **No layout shifts** | PENDING | CLS (Cumulative Layout Shift) = 0 | Chrome DevTools metrics |
| **Text scaling** | PENDING | All text increases proportionally | Screenshot |

---

## 2. Accessibility Testing (UI-09: IN PROGRESS)

### 2.1 Keyboard Navigation

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Tab order** | PENDING | Tab moves through nav → hero CTAs → selects → run button → sections → footer | Tab trace |
| **Focus indicator** | PENDING | 2px outline with 2px offset visible on all focusable elements | Screenshot (each state) |
| **No keyboard traps** | PENDING | User can tab away from every element without dead-end loops | Interaction test |
| **Sticky nav keyboard** | PENDING | Focusing nav anchors; keyboard can navigate between sections | Tab trace |
| **Fixture selects** | PENDING | Both `<select>` elements (baseline, later run) arrow-navigable | Keyboard test |
| **Run button** | PENDING | Enter/Space triggers classifier | Keyboard test |
| **Details/summary** | PENDING | Space or Enter toggles code diff reveal | Keyboard test |

### 2.2 Screen Reader (ARIA, Semantics)

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Page structure** | PENDING | One H1; H2s for sections; nav, main, footer roles present | DOM inspection |
| **Heading hierarchy** | PENDING | No skipped levels (H1 → H2 → H3) | Scan with axe or Wave |
| **Form labels** | PENDING | Each select has explicit `<label>` with `for` attribute | Code review + screen reader test |
| **Button labels** | PENDING | All buttons have visible text (not icon-only) | Visual + screen reader |
| **Verdict announcement** | PENDING | Verdict div has `role="status" aria-live="polite"`; text fully descriptive | Screen reader test |
| **Live region timing** | PENDING | Verdict text announces before cards render (appropriate delay) | Screen reader + timing test |
| **Image alt text** | PENDING | Evidence screenshots (if present) have meaningful alt or empty alt | Code review |
| **Code block semantics** | PENDING | Diffs are `<pre>` or `.diff` with readable structure (not image) | Visual + AT test |
| **List semantics** | PENDING | Test result lists use `<ul>` or semantic structure | Code review |

### 2.3 Contrast (WCAG AA)

| Element | Light (rgb) | Dark (rgb) | Ratio | Status |
|---------|------------|-----------|-------|--------|
| Body text | #161a22 on #f6f7f9 | #e7e9ee on #0f1117 | — | PENDING |
| Muted text | #5b6475 on #f6f7f9 | #9aa3b5 on #0f1117 | — | PENDING |
| Links (accent) | #0f62fe on #f6f7f9 | #4589ff on #0f1117 | — | PENDING |
| OK/green | #198038 on #fff | #42be65 on #171a23 | — | PENDING |
| Bad/red | #da1e28 on #fff | #fa4d56 on #171a23 | — | PENDING |
| Warn/amber | #8e6a00 on #fff | #f1c21b on #171a23 | — | PENDING |
| Info/purple | #8a3ffc on #fff | #a56eff on #171a23 | — | PENDING |
| Button borders | Default border vs `--line` | — | — | PENDING |

**Tool:** WebAIM Contrast Checker.  
**Acceptance:** All ≥ 4.5:1 for body text; ≥ 3:1 for UI components.

### 2.4 Reduced Motion

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Prefers-reduced-motion** | PENDING | Smooth scroll disabled; no transitions animate for users with this setting | CSS inspection + browser setting test |
| **Button state** | PENDING | Hover visual change (brightness) still works; not animation-dependent | Visual test |
| **No animation on load** | PENDING | Page renders immediately; no fade-in or scroll-triggered effects | Chrome DevTools FCP/LCP |

---

## 3. Functional Testing (UI-04, UI-10: IN PROGRESS)

### 3.1 Classifier Functionality

| Test | Status | Finding | Evidence |
|------|--------|---------|----------|
| **Baseline selection** | PENDING | Can select baseline_run.json | Interaction test |
| **Later run selection** | PENDING | Can select full, targeted, synthetic options | Interaction test |
| **Classification runs** | PENDING | Click "Classify" button → results appear | Interaction test |
| **Result cards render** | PENDING | Inherited, regression, fixed, not-run, new-test, unchanged-pass categories shown | Screenshot of results |
| **Card interactivity** | PENDING | Click card → list view shows test IDs | Interaction test |
| **Verdict text** | PENDING | Clear explanation (e.g., "No regressions · full run · 29 inherited") | Screenshot |
| **List overflow** | PENDING | >400 tests shown with "+ N more" indicator | Test with large result set |
| **Golden fixture parity** | PENDING | Browser output matches Python implementation exactly | CI parity workflow passing |

### 3.2 Link and CTA Verification

| Link | Target | Status | Notes |
|------|--------|--------|-------|
| "▶ Try the classifier" | #demo | PENDING | Scroll to demo section |
| "GitHub kit & install" | https://github.com/KnigguKniggu-droid/onramp | PENDING | External; opens in new context |
| "Pitch deck (PDF)" | https://github.com/KnigguKniggu-droid/onramp/blob/main/docs/deck/OnRamp-pitch-deck.pdf | PENDING | PDF; verify existence |
| "Corrections & limitations" | https://github.com/KnigguKniggu-droid/onramp/blob/main/docs/evidence/CLAUDE_CORRECTIONS_2026-10-11.md | PENDING | Verify file exists |
| GitHub (in nav) | https://github.com/KnigguKniggu-droid/onramp | PENDING | Same as kit link |
| Sticky nav anchors | #demo, #baseline, #blind, #feature, #portability, #provenance | PENDING | All sections scroll correctly |
| Timeline commit links | https://github.com/KnigguKniggu-droid/onramp/commit/{SHA} | PENDING | Sample 5 commits; verify 404s |

### 3.3 Fixture and Data Files

| File | Path | Status | Evidence |
|------|------|--------|----------|
| Baseline run | `fixtures/baseline_run.txt` | PENDING | Verify readable |
| Full run | `fixtures/full_run_after_fix.txt` | PENDING | Verify readable |
| Targeted run | `fixtures/targeted_run.txt` | PENDING | Verify readable |
| Normalized JSON (full) | `data/full_run_after_fix.json` | PENDING | Verify JSON valid |
| Normalized JSON (targeted) | `data/targeted_run.json` | PENDING | Verify JSON valid |
| Normalized JSON (synthetic) | `data/synthetic_new_failure.json`, `synthetic_crashed_run.json` | PENDING | Verify JSON valid |
| Classifier source | `classifier.js` | PENDING | Verify syntax, no errors |
| Parity workflow | `.github/workflows/parity.yml` | PENDING | Verify runs on push |

### 3.4 Error and Edge States

| Scenario | Expected behavior | Status | Evidence |
|----------|-------------------|--------|----------|
| **Invalid fixture** | Verdict shows "INCONCLUSIVE"; reason explained | PENDING | Test with corrupted JSON |
| **Missing file** | Fetch error shown; no silent failure | PENDING | Test with 404 fixture |
| **Slow network** | Loading state visible; no timeout surprise | PENDING | Throttle network; screenshot |
| **Offline (no data/)** | Error message; not blank page | PENDING | Disconnect network; test load |
| **Incomparable runs** | Verdict: "INCONCLUSIVE; cannot compare" | PENDING | Test mismatched schema |

---

## 4. Performance (Informational)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **FCP (First Contentful Paint)** | <1.5s | — | PENDING |
| **LCP (Largest Contentful Paint)** | <2.5s | — | PENDING |
| **CLS (Cumulative Layout Shift)** | <0.1 | — | PENDING |
| **Time to Interactive** | <3.5s | — | PENDING |
| **Bundle size** | <50KB HTML+CSS | — | PENDING |

**Tool:** Chrome DevTools Lighthouse.  
**Notes:** No third-party analytics, ads, or external font CDN; fonts are system stack only.

---

## 5. Content and Claim Audit (UI-05, UI-06, UI-07)

### 5.1 Statistics Accuracy

| Claim | Source | Status | Verified | Link |
|-------|--------|--------|----------|------|
| "1,761 Healthchecks tests" | `baseline_run.json` | PENDING | — | Link to fixture |
| "29 failures inherited" | Parsed count from normalized JSON | PENDING | — | Verify count |
| "0 regressions" | `full_run_after_fix.json` parsed | PENDING | — | Verify count |
| "23 commits by IBM Bob" | GitHub onramp repo log | PENDING | — | Count commits with "Generated-by" |
| "Actions passing" | GitHub Actions badge or linked run | PENDING | — | Verify latest run |

### 5.2 Benchmark Comparison

| Element | Status | Finding |
|---------|--------|---------|
| **Seal timestamp and hash** | PENDING | Record visible and readable |
| **Bob's fix code** | PENDING | Actual commit 5f16187e; correct diff |
| **Maintainer's fix code** | PENDING | Upstream 0a9bff9; correct diff |
| **Policy explanation** | PENDING | "Bob: all 2xx; Maintainer: only 200–205" clear |
| **Link to full evidence** | PENDING | https://github.com/KnigguKniggu-droid/onramp/blob/main/docs/evidence/REPORT_webhook-205.md |

### 5.3 Feature Evidence (#1090)

| Element | Status | Finding |
|---------|--------|----------|
| **Code diff present** | PENDING | Pretty-print JSON implementation visible |
| **Non-ASCII test mentioned** | PENDING | e4032c2 commit for "café" fix |
| **Download Original link** | PENDING | Verify still works; not modified |

### 5.4 Provenance Timeline

| Element | Status | Finding |
|---------|--------|---------|
| **First 11 key commits** | PENDING | All present; timestamps UTC; descriptions accurate |
| **Expandable 23-commit list** | PENDING | Details toggle works; all commits shown |
| **All commit links** | PENDING | Sample 5; verify 200 OK on GitHub |
| **Attribution** | PENDING | All Bob commits say "Generated-by: IBM Bob"; no false attribution |

---

## 6. Visual/Design Gate Assessment (UI-02, UI-03)

### 6.1 Judge-First Hero

| Element | Status | Finding |
|---------|--------|---------|
| **Hero headline visible above fold** | PENDING | Screenshot |
| **Lede explains OnRamp** | PENDING | Screenshot; readable at 375px+ |
| **Primary CTA prominent** | PENDING | "Try the classifier" button largest, highest contrast |
| **All 5 judge questions answered** | PENDING | What/Why/Try/Proof/Links → screenshot |

### 6.2 Classifier Demo Prominence

| Element | Status | Finding |
|---------|--------|---------|
| **Demo section before long copy** | PENDING | "Try it" section appears high on page |
| **Fixture selection easy** | PENDING | Two selects, clearly labeled |
| **Run button obvious** | PENDING | Primary button style, clear label |
| **Results interpretation easy** | PENDING | Cards + verdict text; no jargon |

---

## 7. Summary and Next Actions

### Blocked Gates (Cannot pass yet)

- **All UI gates (UI-01 through UI-10):** Require actual browser testing with real screenshots/console logs

### Completion Path

1. ✓ **UI-01:** Design brief complete (`EVIDENCE_EXPLORER_DESIGN_BRIEF.md`)
2. **UI-02 through UI-10:** Require actual browser QA
   - Open deployed site in Chrome at 320, 375, 768, 1440 px widths
   - Capture before screenshots
   - Test keyboard-only navigation (Tab, Enter, Space)
   - Check contrast (WebAIM tool)
   - Verify all links
   - Record console/network errors
   - Test classifier with each fixture
   - Capture after screenshots
   - Document findings here

### Identified Improvement Candidates (pending screenshots)

From code review:

1. **Reduced-motion media query:** Add `@media (prefers-reduced-motion: reduce)` to disable smooth scroll
2. **Figure/image alt text:** If any screenshots added, ensure meaningful alt
3. **Skip-to-main link:** Optional; improves keyboard UX for power users
4. **Form control focus:** Verify focus outlines on selects are visible
5. **Details/summary styling:** Cursor pointer already set; verify keyboard interaction

---

## 8. Pass/Fail Acceptance Record

**Final gate:** ALL gates must be PASS before "SUBMISSION_CLEAN" label.

| UI | Result | Evidence | Approval |
|----|--------|----------|----------|
| UI-01 | PASS | docs/design/EVIDENCE_EXPLORER_DESIGN_BRIEF.md | — |
| UI-02 | PENDING | Screenshot @ hero + CTAs verified | — |
| UI-03 | PENDING | Screenshot + classifier interaction | — |
| UI-04 | PENDING | CI parity workflow green | — |
| UI-05 | PENDING | Benchmark section audit | — |
| UI-06 | PENDING | Feature #1090 links verified | — |
| UI-07 | PENDING | Provenance timeline verified | — |
| UI-08 | PENDING | Responsive screenshots 320–1440 px | — |
| UI-09 | PENDING | Keyboard trace + contrast audit | — |
| UI-10 | PENDING | Error state testing | — |

---

**QA report status:** Framework complete; browser testing required to populate findings.  
**Next reviewer:** Human (for submission) or QA lead (for R6 sign-off).
