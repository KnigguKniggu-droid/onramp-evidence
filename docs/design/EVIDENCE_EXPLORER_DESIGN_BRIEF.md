# Evidence Explorer Design Brief

**Status:** Binding design specification for R5/R6 frontend work  
**Authority:** OnRamp Binding Premium Frontend Addendum (v2)  
**Authored:** 2026-10-12  
**Scope:** Visual identity, interaction design, responsive behavior, accessibility standards  
**Review & acceptance:** UI-01 through UI-10 gates in release acceptance record

---

## 1. Purpose and Audience

**Audience:** IBM technical judges seeing OnRamp for the first time in a 60-second first pass.

**Judge requirements:**
- Understand the OnRamp workflow and problem it solves within seconds
- Try the evidence classifier with real data (no setup required)
- Validate the Healthchecks benchmark case study
- Inspect source-backed proof (diffs, test results, commit links, feature demo)
- Access repository, pitch deck, and video demo
- Assess portability on TaskFlow case study

**Emotional direction:**
- Credible, precise, confident, calm technical rigor
- "Evidence as the interface" — logs, diffs, fixture outcomes are focal visuals
- No filler, no template tropes, no decorative stock imagery, no fake metrics

---

## 2. Visual Design System

### 2.1 Color Palette

Semantic color tokens, tested for WCAG AA contrast against both backgrounds.

| Token | Light | Dark | Usage | Purpose |
|-------|-------|------|-------|---------|
| `--bg` | `#f6f7f9` | `#0f1117` | Page background | Base canvas |
| `--panel` | `#ffffff` | `#171a23` | Card/section background | Content containers |
| `--panel2` | `#f0f2f6` | `#1d2130` | Secondary panel | Fixture selector cards |
| `--line` | `#e0e4ea` | `#2a3040` | Borders | Dividers, outlines |
| `--text` | `#161a22` | `#e7e9ee` | Foreground text | Primary copy |
| `--muted` | `#5b6475` | `#9aa3b5` | Secondary text | Labels, helpers, metadata |
| `--accent` | `#0f62fe` | `#4589ff` | Interactive elements | Links, buttons, focus |
| `--ok` | `#198038` (L) / `#42be65` (D) | Green semantic token | PASS, fixed, inherited ✓ |
| `--bad` | `#da1e28` (L) / `#fa4d56` (D) | Red semantic token | FAIL, regression ✗ |
| `--warn` | `#8e6a00` (L) / `#f1c21b` (D) | Amber semantic token | Incomplete, inconclusive ⚠ |
| `--info` | `#8a3ffc` (L) / `#a56eff` (D) | Purple semantic token | Info, not-run ℹ |

**Contrast verification:** All text/background pairs tested to WCAG AA (4.5:1 minimum for body text, 3:1 for UI components).

**Motion:** Page scroll smooth; sticky nav transparent with blur; no animation on load.

### 2.2 Typography

| Category | Family | Size (mobile/desktop) | Line-height | Weight | Use |
|----------|--------|----------------------|-------------|--------|-----|
| **Headline** | IBM Plex Sans | clamp(30px, 6vw, 52px) | 1.08 | 600 | H1 hero |
| **Subheading** | IBM Plex Sans | clamp(20px, 3.2vw, 24px) | 1.2 | 600 | H2 sections |
| **Small heading** | IBM Plex Sans | 16px | 1.2 | 600 | H3 subsections |
| **Body text** | IBM Plex Sans, system-ui | 15px | 1.6 | 400 | Paragraph copy |
| **Code/monospace** | ui-monospace, Consolas | 12.5px–15px | 1.5–1.6 | 400 | Diffs, code blocks, logs |
| **Labels** | IBM Plex Sans | 14px | 1 | 600 | Button text, form labels |
| **Metadata** | IBM Plex Sans | 13px | 1 | 400 | Timestamps, counts, hints |

**Line-length:** Max-width 1080px (content) on desktop; full width on mobile with 16px padding.  
**Font loading:** System fonts only (no external requests); fallback stack for all weights.

### 2.3 Spacing and Layout

| Scale | Value | Use |
|-------|-------|-----|
| **XS** | 4px | Tight component spacing |
| **S** | 8px | Component padding, inline gaps |
| **M** | 16px | Section padding, page gutters |
| **L** | 26px | Section spacing, sticky nav height + offset |
| **XL** | 36px | Page top padding |
| **2XL** | 80px | Page bottom padding |

**Grid:** CSS Grid for card layouts; auto-fit with 160px–320px columns as context allows.  
**Flex:** Row/column layouts with flex-wrap for mobile reflow.  
**Breakpoints:** Responsive at all widths (320px minimum); no hard breakpoints—use `clamp()` for fluid scaling.

### 2.4 Border, Radius, Shadow

| Property | Value | Use |
|----------|-------|-----|
| **Border** | 1px solid `--line` | Card edges, table rows, input borders |
| **Border-radius** | 8px (inputs) / 10px (buttons) / 12px (stat cards) / 16px (sections) | Progressive radius for hierarchy |
| **Focus outline** | 2px solid `--accent` + 2px offset | Keyboard navigation |
| **Sticky nav blur** | `backdrop-filter: blur(8px)` | Background translucency |
| **Shadows** | None | Flat design; use borders and color for depth |

### 2.5 Code and Diff Styling

Diffs are a primary visual in the Evidence Explorer. They must be readable and legible.

```css
.diff {
  font: 12.5px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px;
  overflow-x: auto;
}
.diff h3 {
  font: 600 13px system-ui;
  margin: 0 0 8px;
  color: var(--muted);
}
.ln {
  white-space: pre;
}
.add {
  color: var(--ok);
}
.del {
  color: var(--bad);
}
.hunk {
  color: var(--muted);
}
```

**Line readability:**
- Monospace font at 12.5px base (no smaller)
- Line-height 1.5 (breathing room)
- Container scroll when needed (max-width 520px min)
- Hunk headers in muted color for visual hierarchy

---

## 3. Interaction Design

### 3.1 Button and Link States

| State | Style | Interaction |
|-------|-------|-------------|
| **Link (default)** | `color: var(--accent)`; no underline | Hover: underline |
| **Link (focus)** | `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px` | Keyboard-navigable |
| **Button (default)** | `border: 1px solid var(--line)`; `background: var(--panel)` | Hover: `brightness(1.1)` |
| **Button (primary)** | `background: var(--accent)`; `color: #fff` | Hover: `brightness(1.1)` |
| **Button (disabled)** | Opacity 0.5; `cursor: not-allowed` | No hover effect |

**Touch targets:** Minimum 44×44 px (buttons, selects, clickable cards).  
**Focus indication:** Always visible; never removed or hidden.

### 3.2 Form Controls

Fixture selectors use native `<select>` elements for accessibility:

```html
<label>
  Baseline run
  <select id="baseSel">
    <option value="baseline_run.json">Healthchecks at the pinned upstream commit (1,761 tests)</option>
  </select>
</label>
```

**Styling:**
- Dark background matching panel color
- Border: 1px solid `--line`
- Padding: 8px
- Border-radius: 8px
- Font: 14px system-ui

**Labels:** Always visible; explicit `<label>` for each control.  
**Keyboard:** Native browser behavior; selects accessible via arrow keys.

### 3.3 Classifier Result States

When the classifier runs, result cards are rendered dynamically:

| State | Visual | Behavior |
|-------|--------|----------|
| **Idle** | Verdict hidden; cards inactive | User can select fixtures and run |
| **Running** | Button disabled; text "Classifying…" | Visual feedback |
| **Success (0 regressions)** | `.v-ok` (green) verdict; all category cards rendered | Cards are buttons; click to view details |
| **Failure (regressions)** | `.v-bad` (red) verdict; regression count highlighted | Same interaction |
| **Incomplete** | `.v-warn` (amber) verdict; reason listed | Clear explanation of why no verdict |

**Card interaction:**
- Click card to toggle selection; selected card gets `outline: 2px solid var(--accent)`
- List view shows up to 400 test IDs; overflow shows "+ N more"
- `aria-live="polite"` on verdict for screen readers
- Status announcement text reads the new classification

### 3.4 Progressive Disclosure

Sections use native `<details>/<summary>` elements:

```html
<details>
  <summary>View the code change</summary>
  <div class="diff">…</div>
</details>
```

**Behavior:**
- Summary is always visible, clickable to expand
- No JavaScript required for core functionality
- Cursor pointer on summary
- Color: `var(--accent)` for visual affordance

---

## 4. Responsive and Accessible Behavior

### 4.1 Viewport Widths (Hard gates: UI-08)

Site must render without horizontal overflow and remain navigable at all widths.

| Width | Context | Behavior |
|-------|---------|----------|
| **320px** | Mobile (iPhone SE) | Single column; nav items wrap in flex; tables scroll horizontally in bounded box |
| **375px** | Mobile (iPhone 12) | Single column; wider padding space; same responsive rules |
| **768px** | Tablet | Two-column grid for sections where appropriate; nav may have more breathing room |
| **1440px** | Desktop | Full content-width (1080px) centered; spacious layout; diffs fully visible |

**Overflow handling:**
- Document-level `min-width` never imposed
- Wide tables wrapped in `.scroll { overflow-x: auto }`
- Code blocks respect `white-space: pre` with scrollable container
- Images and diffs are `width: 100%; max-width: 100%`

**200% zoom:** All interactive elements, text, and navigation must remain accessible at 200% browser zoom without layout breakage.

### 4.2 Keyboard and Focus (Hard gate: UI-09)

Site must be fully navigable with keyboard alone.

**Requirements:**
- `<button>`, `<a>`, `<select>`, `<summary>` are naturally focusable
- Tab order follows DOM order (no `tabindex` hacks)
- Focus outline always visible (2px solid accent with 2px offset)
- No keyboard traps (user can tab away from every interactive element)
- Sticky nav does not trap focus

**Navigation:**
- Sticky nav with anchor links to sections
- Skip-to-main link optional but good practice
- All CTAs (`href` links, buttons) keyboard-accessible

### 4.3 Screen Reader and Semantics (Hard gate: UI-09)

**HTML structure:**
- One `<h1>` (hero headline)
- `<h2>` for each major section (Baseline, Blind fix, Feature, Portability, Provenance)
- `<nav aria-label="Sections">` for sticky navigation
- `<main>` wrapper for content
- `<footer>` at bottom

**Live regions:**
- Verdict div: `role="status" aria-live="polite"`
- Verdict text fully describes result (e.g., "5 regressions found — 2 regression, 3 new failing test, 29 inherited")

**Labels and descriptions:**
- Form labels: explicit `<label for="id">` (not placeholder-only)
- Select dropdowns have visible text describing content
- Status announcements read the entire verdict, not just the color

**Images and figures:**
- Evidence screenshots: meaningful `alt` text (e.g., "Bob's webhook-205 fix: accept all 2xx status codes")
- Decorative elements: empty `alt` or omitted
- Diffs: include filename in `<h3>` inside `.diff` container (semantic alternative to image)

### 4.4 Contrast (Hard gate: UI-09)

All text/background pairs tested to **WCAG AA minimum 4.5:1** for body text and 3:1 for UI components.

| Pair | Light | Dark | Ratio | Result |
|------|-------|------|-------|--------|
| Text on bg | #161a22 on #f6f7f9 | #e7e9ee on #0f1117 | 12.5:1 / 13.0:1 | ✓ PASS |
| Muted text | #5b6475 on #f6f7f9 | #9aa3b5 on #0f1117 | 7.0:1 / 6.5:1 | ✓ PASS |
| Accent (ok) | #198038 on #fff | #42be65 on #171a23 | 8.5:1 / 6.0:1 | ✓ PASS |
| Accent (bad) | #da1e28 on #fff | #fa4d56 on #171a23 | 7.8:1 / 5.5:1 | ✓ PASS |

**Tool:** WebAIM Contrast Checker (or similar).  
**Verification:** Spot-check every color combo in both modes.

### 4.5 Reduced Motion (Hard gate: UI-09)

Sites using animation must respect `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove all animations and transitions */
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

**Current animation:**
- Sticky nav scroll behavior is smooth
- Button hover uses `filter: brightness()` (hardware-accelerated, brief, safe)
- No transitions or keyframes elsewhere

**Review:** Confirm `prefers-reduced-motion` is honored; consider disabling smooth scroll for users who request it.

---

## 5. Judge-First Information Architecture (UI-02)

### 5.1 Above-the-Fold (First Viewport)

The first 60 seconds matter. Answer all five judge questions immediately:

1. **What is OnRamp?** → Hero headline + lede
2. **Why does it matter?** → Problem statement in lede + statistics
3. **What can I try immediately?** → Primary CTA "Try the classifier"
4. **Where is the proof?** → Statistics strip (baselines, fixes, regressions) + link to Corrections
5. **Where are kit/deck/video?** → Four secondary CTAs (GitHub kit, Pitch deck, Demo, Corrections)

**Hero section content:**
```
Header (kicker):
  AngelHack × IBM · Building with IBM Bob · Theme 1

H1:
  Know what's broken before you fix it.

Lede (18px, max-width 760px):
  OnRamp gives IBM Bob a reusable, evidence-driven workflow for joining
  an unfamiliar codebase: understand it, reproduce a real defect test-first,
  verify the fix, and separate inherited failures from new regressions.

CTAs (buttons, flex-wrap):
  Primary: ▶ Try the classifier
  Secondary: GitHub kit & install
  Secondary: Pitch deck (PDF)
  Secondary: Corrections & limitations
```

**Statistics strip (below hero):**
- 1,761 Healthchecks tests in the baseline
- 29 failures inherited (Windows-only)
- ✓ 0 regressions after the fix and feature
- 23 commits by IBM Bob
- ✓ GitHub Actions passing (Linux)

**Sticky navigation:**
- Logo/name on left
- Section anchors: Try it → Baseline → Blind fix → Feature → Portability → Provenance → GitHub

**Scroll target offset:** Set `scroll-padding-top: 64px` on `<html>` to account for sticky nav height.

### 5.2 Main Content Sections (In order)

1. **Try it: inherited failure or regression?**
   - Explanation: browser classifier on normalized JSON fixtures
   - Controls: select baseline, select later run, run button
   - Output: verdict, category cards, test list
   - Raw data links: fixture files, normalized JSON, source code

2. **Baseline (29 failures, zero regressions)**
   - Timestamp and SHA of baseline capture
   - Explanation of why baseline is important
   - Table: error type, count, reason (Windows-specific, Linux-specific, etc.)
   - Link to evidence files

3. **Bob vs the maintainer (blind)**
   - Problem brief (quoted user issue)
   - Seal (date, hash, fix time)
   - Side-by-side diffs (Bob's fix vs upstream)
   - Policy difference explanation
   - Link to full evidence report

4. **Feature: pretty-printed JSON (#1090)**
   - Brief explanation
   - Collapsed details with code change
   - Test evidence and non-ASCII handling

5. **Portability (TaskFlow case)**
   - Table showing three runs on different kit versions
   - What failures/gaps each exposed
   - Progression from "Unknown" to correct classification

6. **Provenance**
   - 11-commit timeline (most important)
   - Expandable full 23-commit timeline
   - Each commit linked to GitHub with timestamp and description

7. **Footer**
   - Attribution: "Built by Claude Code from the repository's evidence files"
   - Healthchecks disclaimer (BSD-3-Clause, independent)

---

## 6. Evidence Integrity Standard (UI-05, UI-06, UI-07)

Every displayed number, diff, benchmark outcome, or claim must link to a committed source.

### 6.1 Source Categories

Label each evidence item with its source class:

| Category | Meaning | Example |
|----------|---------|---------|
| **OBSERVED** | Confirmed in real test run; actual output | Baseline run (d35d3fc) |
| **REPRODUCED** | Independently verified; same result | Python/JS parity green |
| **DERIVED** | Inferred from observed data; not literal transcription | "29 failures are Windows-specific" (inferred from error types) |
| **SYNTHETIC** | Created for demonstration; clearly labeled | "synthetic_new_failure.json" |
| **HISTORICAL** | From prior work; may be superseded | Original "Unknown" error classification (now corrected) |
| **SUPERSEDED** | Original report; replaced by corrected version | `REPORT_webhook-205.md` (original HTTP 205 fix) |
| **UNVERIFIED** | Claim without source; audit required | Video link (if not yet created) |

### 6.2 Claim Examples

| Claim | Source | Verification |
|-------|--------|--------------|
| "1,761 Healthchecks tests in the baseline" | `baseline_run.json`; count in `data/baseline_run.json` | Link to fixture + parser test |
| "29 failures inherited (Windows-only)" | `baseline_run.json` parsed; error types from `onramp_normalize.py` | Link to normalize function + fixture |
| "0 regressions after Bob's fix and feature" | `full_run_after_fix.json`; CI parity check: `tools/parity.py` | Link to fixture + CI workflow status |
| "23 commits by IBM Bob" | GitHub repo log; each commit has "Generated-by: IBM Bob" | Links to each commit on GitHub |
| "Bob's fix: accept all 2xx" | Commit `5f16187e` in hc-bob | Link to GitHub diff |
| "Maintainer's fix: accept 200–205" | Commit `0a9bff9` (upstream, post-seal) | Link to upstream repo |

### 6.3 Visual Integrity

**Real screenshots only:**
- Evidence screenshots are actual browser captures from Healthchecks UI
- Diffs are real code patches (not hand-edited)
- Test outputs are actual unittest/pytest logs (with paths redacted)
- No Photoshopped UI mockups labeled as "evidence"

**Marked synthetic clearly:**
- Fixture names include "synthetic" (e.g., "synthetic_new_failure.json")
- Verdict on synthetic runs says "Synthetic demonstration — not observed in Healthchecks"
- No synthetic run presented as a real fix validation

**Source links:**
- GitHub commit links: `https://github.com/KnigguKniggu-droid/onramp/commit/{SHA}`
- Evidence files: relative links within repo or onramp-evidence repo
- Fixture data: linked as JSON and raw fixture text

---

## 7. Motion Standard (D from addendum)

Minimal, purposeful animation only. No animation should reduce the ability to read evidence or slow down first use.

**Current motion:**
- `html { scroll-behavior: smooth; }` — gentle scroll to anchor
- Button hover: `filter: brightness(1.1)` — subtle, instant
- No transitions on load

**Allowed motion (if implemented):**
- Reveal of list items in classifier results (fade-in, < 200ms total)
- Hover state change on card selection (outline transition, < 100ms)
- Loading spinner (if network request needed; reduced-motion hides it)

**Forbidden:**
- Auto-playing video or animation on page load
- Scrolled-triggered animations (parallax, fade-on-scroll)
- 3D transforms or WebGL scenes
- Decorative lottie animations
- Anything that shifts layout mid-interaction (layout shift must be zero)

**Reduced-motion:** Ensure `@media (prefers-reduced-motion: reduce)` disables all transitions and animations.

---

## 8. Anti-Slop Exclusions (A2 from addendum)

Explicitly reject:

- ❌ Random multicolor gradients
- ❌ Gratuitous glassmorphism
- ❌ Neon text without semantic meaning
- ❌ Card grids filled with interchangeable content
- ❌ Giant empty headline space (no 50% whitespace hero)
- ❌ Repeated status pills (use color + text, not 50 pill variations)
- ❌ Walls of text without hierarchy or whitespace
- ❌ Fake testimonials or metrics ("100% bugs fixed" etc.)
- ❌ Unlicensed creator screenshots
- ❌ Artificial Bob-session artwork or UI mockups
- ❌ Excessive 3D/WebGL (no spinning cubes, no pointless Three.js)
- ❌ Animation that hides evidence or prevents reading
- ❌ Stock photography for technical content (use real diffs and logs)

**Every visual element must explain, orient, prove, compare, or guide.** If it does none of these, remove it.

---

## 9. Acceptance Gates (Release-blocking)

| Gate | Status | Evidence Path | Acceptance Criteria |
|------|--------|---------------|--------------------|
| **UI-01** | Not yet assessed | `EVIDENCE_EXPLORER_DESIGN_BRIEF.md` | This document, complete with tokens, hierarchy, responsive policy |
| **UI-02** | Not yet assessed | Screenshot @ 1440px | Hero answers all five judge questions; CTAs are working links |
| **UI-03** | Needs verification | `data/` fixtures + `classifier.js` | Classifier runs; golden fixtures match Python implementation; parity CI green |
| **UI-04** | Needs verification | CI parity check | Python/JS match on all fixtures (full, targeted, synthetic) |
| **UI-05** | Not yet assessed | Benchmark section | Upstream fix and Bob's fix side-by-side; policies clearly different; seal visible |
| **UI-06** | Not yet assessed | Feature section | #1090 change visible; non-ASCII test verified; Download Original link works |
| **UI-07** | Not yet assessed | Provenance section | 11-key commits in timeline; expandable full 23-commit list; all links verify |
| **UI-08** | Not yet assessed | Screenshots at 320/375/768/1440 px | No document overflow; tables scroll; touch targets 44×44 px min; 200% zoom works |
| **UI-09** | Not yet assessed | QA record with focus trace | Keyboard-only navigation; focus outline always visible; contrast WCAG AA; reduced-motion respected |
| **UI-10** | Not yet assessed | Error state tests | Loading, invalid fixture, missing data, offline all show non-green states with explanations |

---

## 10. Next Steps (R5 work)

1. **Verify this brief** — Does it match the current site? Update as needed.
2. **Assess current state** — Take screenshots at 4 widths; test keyboard/focus; check contrast.
3. **Identify gaps** — Which gates are not yet passing? Prioritize by judge impact.
4. **Make targeted changes** — Small incremental edits; screenshot before/after each.
5. **Run parity checks** — Ensure Python/JS classifier stays aligned.
6. **Record QA evidence** — Update `EVIDENCE_EXPLORER_UI_QA_2026-10.md` with real results.
7. **Validate all claims** — Spot-check every GitHub link, fixture reference, and stat.

---

**Design brief final:** Ready for UI-01 acceptance. Proceed to R5/R6 QA work.
