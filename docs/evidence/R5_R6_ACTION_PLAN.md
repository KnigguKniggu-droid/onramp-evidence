# OnRamp R5/R6 Action Plan — October 2026

**Status:** In progress  
**Phase:** Frontend reference (R5) and browser QA (R6)  
**Deadline:** October 18, 2026, 11:59 PM EDT (6 days)  
**Owner:** Claude Code (frontend/QA) + human (browser automation/final approval)  

---

## Completed (R0–R5 groundwork)

- ✓ **R0 reconciliation:** `RELEASE_STATE_2026-10-12.md` (git state, deployed SHA, blockers recorded)
- ✓ **UI-01 design brief:** `EVIDENCE_EXPLORER_DESIGN_BRIEF.md` (tokens, hierarchy, a11y standards, judge-first IA)
- ✓ **QA framework:** `EVIDENCE_EXPLORER_UI_QA_2026-10.md` (template for UI-02 through UI-10)
- ✓ **Code improvement #1:** Added `@media (prefers-reduced-motion: reduce)` to disable smooth scroll (commit b281b15)

---

## Remaining Critical Path (R5/R6)

### Phase 1: Code Review & Quick Wins (this session)

**Objective:** Identify and fix accessibility/responsive issues that don't require browser screenshots.

#### Issue A: Focus outline on form controls

**Status:** ⚠️ NEEDS REVIEW

Current CSS at line 15:
```css
a:focus-visible,button:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
```

**Potential issue:** Some browsers may not render focus outline on `<select>` elements consistently.

**Fix candidate:** Add explicit `select:focus { outline: ... }` rule as fallback.

**Action:** Review in browser; if focus is invisible on selects, add fallback rule.

---

#### Issue B: Label association for form controls

**Status:** ✓ VERIFIED (code review shows correct `<label for="id">` usage)

Lines 96-103 in HTML show:
```html
<label>Baseline run<select id="baseSel">...</select></label>
<label>Later run<select id="curSel">...</select></label>
```

**Finding:** Labels are present and visible; `id` attributes match (implicit label association).

**Recommendation:** Keep as-is; fully accessible.

---

#### Issue C: Verdict announcement timing

**Status:** ⚠️ NEEDS BROWSER TEST

Line 105:
```html
<div id="verdict" class="verdict" role="status" aria-live="polite" hidden></div>
```

**Potential issue:** `aria-live="polite"` announcements timing; need to verify text is announced before cards render.

**Action:** Test with screen reader; ensure verdict text fully describes result (e.g., "5 regressions found").

---

#### Issue D: Skip-to-main link (optional enhancement)

**Status:** NOT PRESENT (optional; good UX but not required)

**Candidate improvement:** Add hidden skip link for keyboard users.

```html
<a href="#main" class="skip-to-main">Skip to content</a>
```

```css
.skip-to-main {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: #fff;
  padding: 8px;
  text-decoration: none;
}
.skip-to-main:focus {
  top: 0;
}
```

**Priority:** LOW (nice-to-have; not blocking UI gates).

---

### Phase 2: Browser QA (requires interactive session + Playwright/Chrome automation)

**Objective:** Capture real evidence for UI-02 through UI-10.

#### 2.1 Responsive Testing (UI-08)

**Widths to test:** 320, 375, 768, 1440 px

**Steps for each width:**
1. Open https://kniggukniggu-droid.github.io/onramp-evidence/ in Chrome DevTools device emulation
2. Set viewport width to target width
3. Screenshot full page (capture SHA and viewport in filename)
4. Scroll and test:
   - No horizontal overflow (check with `document.documentElement.scrollWidth === window.innerWidth`)
   - Tables and diffs scroll horizontally without document-level overflow
   - Sticky nav doesn't trap focus
   - All CTAs and buttons are tappable (44×44px minimum)
   - Text remains readable
5. Test 200% browser zoom: navigate page, no layout breakage
6. Record findings in `EVIDENCE_EXPLORER_UI_QA_2026-10.md`

**Expected outcomes:**
- 4 × 2 (before/after) screenshots = 8 total screenshots
- All UI-08 gates marked PASS or FAIL with evidence

---

#### 2.2 Accessibility Testing (UI-09)

**Keyboard navigation trace:**
1. Open site in Chrome
2. Press Tab repeatedly; record path:
   - nav anchor links (Try it → Baseline → Blind fix → ... → GitHub)
   - hero CTAs (Try, GitHub kit, Pitch deck, Corrections)
   - fixture selects (baseline, later run)
   - run button
   - section links (if any)
   - footer links (if any)
3. For each focusable element: verify 2px outline is visible
4. Test no keyboard traps: from every element, Tab moves away

**Screen reader test (Windows Narrator or NVDA):**
1. Navigate with screen reader
2. Verify:
   - Page title announced ("OnRamp · Know what's broken before you fix it")
   - Heading hierarchy (H1 → H2 sections)
   - Form labels read with controls ("Baseline run, select")
   - Verdict announced after classification
3. Capture console output or recording

**Contrast verification (WebAIM tool):**
1. For each color pair in design brief, verify ≥4.5:1 ratio
2. Special focus: body text, links, status colors (ok/bad/warn)
3. Test both light and dark modes

**Reduced-motion test:**
1. In Chrome: enable "Prefer reduced motion" (Settings → Accessibility)
2. Reload page
3. Verify smooth scroll is disabled (`scroll-behavior: auto`)
4. Button hover still works (brightness filter is instant, not animation)

**Expected outcomes:**
- Tab trace screenshot/recording
- Screen reader interaction log
- Contrast report (all ≥4.5:1)
- Reduced-motion verification

---

#### 2.3 Functional Testing (UI-04, UI-10)

**Classifier parity (UI-04):**
1. Open demo section
2. Run each fixture combination:
   - Baseline vs Full run after fix → expect "0 regressions"
   - Baseline vs Targeted run → expect "TARGETED, 1,761 not run, 0 fixed" (corrected 2026-10-12; earlier text was wrong)
   - Baseline vs Synthetic new failure → expect "1 regression"
   - Baseline vs Synthetic crashed → expect "inconclusive"
3. Compare results with `py/parity_check.py` expected output
4. Verify CI parity workflow is green (latest push)

**Link verification (UI-05, UI-06, UI-07):**
1. Check each CTA/link:
   - "Try the classifier" → scroll to #demo (no external request)
   - "GitHub kit & install" → https://github.com/KnigguKniggu-droid/onramp (200 OK)
   - "Pitch deck (PDF)" → GitHub raw URL, PDF loads
   - "Corrections & limitations" → GitHub file, markdown renders
   - Sticky nav links → all scroll to sections, no 404
   - Commit links in timeline → sample 5, all resolve to GitHub
2. Record HTTP status for external links
3. Record any redirect chains

**Error and edge states (UI-10):**
1. Test missing fixture:
   - Manually edit selector to non-existent file
   - Click run
   - Verify error is displayed (not blank page or crash)
2. Test slow network:
   - Chrome DevTools: throttle to "Fast 3G"
   - Click run
   - Verify loading state visible; result appears
   - No uncaught JS errors in console
3. Test offline:
   - Close network
   - Reload page
   - Verify site is still functional (offline with cached assets)
   - Try to run classifier
   - Error message (not crash)

**Expected outcomes:**
- Parity verification pass/fail
- Link audit (all working)
- Error state screenshots (non-green failures)
- Console error log (should be clean)

---

#### 2.4 Claim Validation (UI-05, UI-06, UI-07)

**Evidence audit:**
1. Verify each displayed statistic:
   - "1,761 tests": Count in `data/baseline_run.json` matches
   - "29 failures": Parse count matches table in #baseline section
   - "0 regressions": `data/full_run_after_fix.json` parsed correctly
   - "23 commits": GitHub API or manual count of Bob's commits
2. Verify links to evidence files:
   - `fixtures/baseline_run.txt` (raw text, readable)
   - `data/baseline_run.json` (valid JSON)
   - Diffs (code snippets match GitHub commits)
3. Verify benchmark comparison:
   - Bob's fix: commit 5f16187e (GitHub link opens)
   - Maintainer's fix: upstream 0a9bff9 (reference only; not in repo)
   - Seal timestamp readable and verifiable

**Expected outcomes:**
- All statistics verified against sources
- No broken links
- Benchmark comparison is accurate

---

### Phase 3: Decision and Iteration (if issues found)

**If UI gates FAIL:**
1. Prioritize by judge impact:
   - Responsive rendering (UI-08) — if images break, fix immediately
   - Focus/keyboard (UI-09) — if site is unusable without mouse, fix immediately
   - Link verification (UI-05/07) — if links are broken, fix before deadline
   - Classifier parity (UI-04) — if result is wrong, escalate to Bob
2. Make minimal targeted fixes (no redesigns)
3. Re-test affected gates
4. Document findings and rollback plan

**If all UI gates PASS:**
1. Mark each gate as PASS with evidence in `EVIDENCE_EXPLORER_UI_QA_2026-10.md`
2. Proceed to R7–R9 release gates
3. Sign off: no blockers remain for submission

---

## Summary of R5/R6 Deliverables

### Required documentation
- ✓ `docs/design/EVIDENCE_EXPLORER_DESIGN_BRIEF.md` (complete, binding specification)
- ⏳ `docs/qa/EVIDENCE_EXPLORER_UI_QA_2026-10.md` (framework complete; needs QA results populated)
- ⏳ `docs/qa/screenshots/` folder with before/after at 320/375/768/1440 px

### Required evidence
- ⏳ Browser screenshots at all widths (8 total: 4 widths × before+after)
- ⏳ Keyboard focus trace (screenshot or recording)
- ⏳ Contrast audit report
- ⏳ Link verification log
- ⏳ Parity check results (CI passing)

### Required code changes
- ✓ Reduced-motion media query (commit b281b15)
- ⏳ Any fixes from QA (if issues found)

---

## Resource Constraints and Workarounds

**Constraint:** Non-interactive session; no browser automation in this session.

**Workaround:** Document the exact steps for human to follow with Playwright or manual testing.

**Next action:** 
1. Human opens Chrome/Playwright with automation
2. Follows step-by-step instructions from Phase 2 above
3. Captures real screenshots and records results
4. Returns findings to Claude for iteration

**Escalation points:**
- If parity check fails: escalate to Bob (kit issue, not UI issue)
- If links are broken: check Bob's latest commits on GitHub
- If accessibility tests reveal issues: identify specific CSS/HTML fix needed

---

## Final Acceptance Criteria

**R5/R6 PASS when:**
- [ ] All 10 UI gates (UI-01 through UI-10) are marked PASS
- [ ] Evidence captured for each gate
- [ ] No false-positive passes (evidence is real, not fabricated)
- [ ] All claims verified against sources
- [ ] No unfixed blockers remain
- [ ] Signed QA report

**Ready for R7–R9/S1:** After R5/R6 sign-off.

---

**Action plan finalized:** 2026-10-12  
**Next step:** Human to execute Phase 2 (browser QA) and report findings.
