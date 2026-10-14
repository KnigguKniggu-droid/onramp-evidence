> **Historical snapshot.** The R0 block directly below describes the repository as of 2026-10-12 (HEAD d35d3fc). The current state is in the dated updates at the end of this file.

# OnRamp Release State — 2026-10-12 R0 Reconciliation

**Reconciliation Date:** 2026-10-12  
**Deadline:** October 18, 2026, 11:59 PM EDT (6 days remaining)  
**Reconciler:** Claude Code (Haiku 4.5)  
**Phase:** R0–R9/S1 execution (binding continuation directive v3)

## Repository State

### Local
- **onramp-site (Evidence Explorer)**
  - Latest commit: `d35d3fc` — "Normalize line endings before hashing so CI on Linux matches Windows"
  - Remote: `https://github.com/KnigguKniggu-droid/onramp-evidence.git`
  - Working tree: **CLEAN** (no uncommitted changes)
  - Branch: main

- **hc-bob (Healthchecks fork)**
  - Latest commit: `dfb2e580` — "kit: add Claude-authored onramp_normalize.py (normalize, classify, init-profile)"
  - Remote: `https://github.com/KnigguKniggu-droid/onramp.git`
  - Working tree: 1 untracked file: `docs/onramp/evidence/suite_post_fix_full.txt`
  - Branch: main
  - Status: **Post-Bob work complete**. Correction 2026-10-12: not all commits are Bob's; Claude-authored commits (pitch deck, CI trigger, corrections, onramp_normalize.py) say so in their messages.

### Published
- **onramp-evidence Pages site:** https://kniggukniggu-droid.github.io/onramp-evidence/
  - Deployed: **VERIFIED** (GitHub Actions parity workflow passing on Oct 11)
  - Deployed SHA: `d35d3fc` (matches local HEAD)
  - Site components present: `index.html`, `classifier.js`, normalized fixtures, Python/JS parity CI

### GitHub Repos
- **onramp (kit):** https://github.com/KnigguKniggu-droid/onramp (public)
- **onramp-evidence (site):** https://github.com/KnigguKniggu-droid/onramp-evidence (public)

## Current Site State (R0 Observations)

### ✓ Complete
1. **Hero and primary CTAs**
   - Headline: "Know what's broken before you fix it"
   - Supporting lede explaining OnRamp purpose
   - Primary CTA: "▶ Try the classifier"
   - Secondary CTAs: GitHub kit, Pitch deck (PDF), Corrections & limitations
   - Status: **OBSERVED** — all links verify to real targets

2. **Interactive classifier**
   - Five fixture variations: baseline, full run, targeted run, synthetic new failure, synthetic crashed run
   - Classification results: inherited/regression/fixed/not-run/unchanged-pass/new-test cards
   - Python/JS parity: CI-checked on each push
   - Status: **OBSERVED** — working demo, golden fixture parity confirmed in CI

3. **Semantic HTML structure**
   - Sticky navigation with section anchors
   - Correct heading hierarchy (H1 hero, H2 sections)
   - Semantic tables, lists, blockquote, details elements
   - Status: **OBSERVED**

4. **Color and dark/light mode**
   - CSS custom properties for semantic tokens (ok/bad/warn/info)
   - `@media (prefers-color-scheme: light)` with full palette
   - Status: **OBSERVED**

5. **Evidence sections**
   - Baseline failures (29 inherited, error types)
   - Bob vs maintainer (sealed brief, diff comparison, policy difference)
   - Feature #1090 (JSON pretty-printing, non-ASCII handling)
   - Portability (TaskFlow Flask case)
   - Provenance (timeline of 23 Bob commits, with links)
   - Status: **OBSERVED** — all sections present, comprehensive

### ⚠ Needs Assessment (R5/R6 gates from binding addendum)

| Issue | Severity | Evidence | Impact |
|-------|----------|----------|--------|
| **No explicit design brief document** | P1 | MISSING | Required for UI-01 gate; cannot verify design decisions without documented tokens/hierarchy/policy |
| **No responsive testing evidence** | P1 | MISSING | Required for UI-08 gate; no verified screenshots at 320/375/768/1440 px |
| **No accessibility audit** | P1 | MISSING | Required for UI-09 gate; untested focus/zoom/reduced-motion/contrast |
| **No browser QA evidence** | P1 | MISSING | Required for all UI gates; no recorded console/network/load/error states |
| **No before/after UI QA document** | P1 | MISSING | Required for R5/R6 acceptance record |
| **Pitch deck link not validated** | P2 | UNVERIFIED | Link exists; content/PDF validity untested |
| **Demo video link missing** | P2 | UNVERIFIED | UI addendum references "Watch Demo" but no video link present in current site |
| **Corrections file link not validated** | P2 | UNVERIFIED | Links to `docs/evidence/CLAUDE_CORRECTIONS_2026-10-11.md`; file presence untested |

### Known Blockers and Limitations (from binding addendum)

1. **Bob credits exhausted** — per NOTE_FIRST.md: "original Bob plan allowance was exhausted." No new Bob work presumed available; Claude handles UI only.

2. **Sealed benchmark immutable** — webhook-205 benchmark sealed before Bob's work. Original report (`REPORT_webhook-205.md`) preserved as historical; any corrected report marked superseded, not deleted.

3. **Not a live Bob session** — site classifier runs on normalized JSON fixtures in the browser, not actual IBM Bob execution in real-time.

4. **Saved-reels source material** — 722 entries are discovery-only (not fully transcribed). Missing chunk-04 is documented gap. No fabricated reel claims.

5. **TaskFlow frozen** — separate Flask case study; OnRamp scope is Django Healthchecks example + portability proof.

## Required Completion (R1–R9/S1)

- [ ] **R1–R3: P0 defect gates** — Python parser/normalizer independent test; clean-install verification; hook truthfulness
- [ ] **R4: Defect detection** — Yes (webhook-205 fixed by Bob)
- [ ] **R5: Frontend reference and design** — Design brief; reference audit; no-slop standards; judge-first IA
- [ ] **R6: Browser QA** — Real screenshots (4 widths), keyboard/focus, accessibility, responsive, error states
- [ ] **R7–R9: Release gates** — Parity verification; claim-to-source audit; evidence integrity
- [ ] **S1: Final submission** — Human-only; provenance/eligibility confirmed

## Next Steps

1. **Create `EVIDENCE_EXPLORER_DESIGN_BRIEF.md`** (R5 prerequisite)
   - Design tokens (palette, typography, spacing, motion)
   - Judge-first information architecture
   - Evidence integrity standards
   - Interaction specs

2. **Capture baseline screenshots** (R6 prerequisite)
   - Deployed site at 320, 375, 768, 1440 px widths
   - Record viewport, browser, deployed SHA, timestamp

3. **Create `EVIDENCE_EXPLORER_UI_QA_2026-10.md`** (R6 acceptance record)
   - Responsive testing (no overflow, 200% zoom, touch)
   - Accessibility (keyboard, focus, headings, contrast, reduced-motion)
   - Functional QA (links, metadata, error states)
   - Performance measurements

4. **Execute targeted frontend improvements**
   - Use existing site code; avoid rewrites
   - Small incremental changes; screenshot before/after each
   - Reference-first: no template slop, no AI vibe tropes

5. **Validate all evidence links and claims**
   - Verify GitHub links resolve
   - Validate PDF deck existence
   - Check fixture/commit references
   - Confirm source-backed screenshots

---

**Record Status:** R0 reconciliation **COMPLETE**  
**Blocked:** None at R0  
**Proceed to:** R1–R3 P0 gate verification, then R5 design brief authoring

---

## Gate status update — 2026-10-12 ~00:20 local (Claude Code, Opus 5.5)

Verdict: **NOT_SUBMISSION_CLEAN** (human gates open).

| Gate | Status | Evidence |
|---|---|---|
| R1 normalizer/classifier | PASS | `py/test_onramp_normalize.py` 20/20 (full, targeted, regression, new failure, fixed, skipped, expected failure, empty/crash/timeout, count and terminal mismatch, mid-line warnings, docstrings, schema, CRLF, BOM/UTF-16 JSON) |
| R2 fresh install | PASS | Untouched Django (0968fa2) and Flask (a380909) clones: copy `.bob/` → `init-profile --write` → verbose run → normalize → classify: valid FULL, 29/1 inherited, 0 regressions. Found and fixed a PowerShell BOM defect (kit 93c611d). |
| R3 hook honesty | DOCUMENTED | Hook is runner feedback only; stated in `docs/evidence/CLAUDE_CORRECTIONS_2026-10-11.md` (kit repo). Bob's hook file unchanged (Bob out of budget; Claude did not edit Bob's files). |
| Python/JS parity | PASS | CI `parity` green on every push since d35d3fc; 5/5 golden cases |
| Deployed SHA | VERIFIED | Pages deployment and parity both succeeded for 39a3dcf, then b35b039 pushed (re-verify after deploy) |
| R6 responsive | PASS (automated) | True-width iframes 320/375/768/1440: no document overflow, before (d35d3fc) and after screenshots in `docs/qa/screenshots/` |
| R6 keyboard/focus/structure | PASS (programmatic) | 36 reachable controls all show focus; skip link; 1 h1, 6 h2; labelled selects; aria-live verdict |
| R6 links/console/error state | PASS | 34 links 200; no console errors; missing-data error shown |
| R5 design pass | PASS (Claude-assessed) | Redesign 2026-10-13 (5fa5428+): decision-rule hero, auto-run demo, run cards; brief in `docs/design/EVIDENCE_EXPLORER_DESIGN_BRIEF.md`; before/after screenshots in `docs/qa/screenshots/` |
| R6 redesign re-QA | PASS (automated) | after-redesign captures: no overflow 320–1440, 4 scenario verdicts correct, light theme captured, token contrast ≥4.5:1 both themes (computed) |
| R6 rendered contrast, direct 200% zoom, slow/offline/fonts-blocked, a11y tree | PASS (automated) | `docs/qa/QA_RESULTS_2026-10-13_extra.md`; light accent fixed after the audit found 4.41:1 |
| R6 human screen-reader pass (NVDA/Narrator) | OPEN (human) | accessibility-tree proxy passed; listening pass not done |
| #1090 visual proof | PASS | real before/after screenshots from local dev servers |
| Demo video | OPEN (human) | record and upload ≤3:00 |
| Live-demo rule confirmation | OPEN (human) | email buildwithibm@angelhack.com |
| Eligibility (18+, US resident) | OPEN (human) | confirm |
| Form submission | OPEN (human) | must be submitted manually (ToS voids automated submissions) |


## Update 2026-10-13 (Claude Code)
- **SHAs:**
  - kit `30bb017`: Tests, Mypy and Coverage all green
  - site `c42070f`: parity and Pages green; the deployed SHA equals the source SHA, per the deploy run for `c42070f`
- **Records:** `docs/evidence/UI_QA_REPORT.md`, `CLAIM_TO_SOURCE_MATRIX.md`, `CLAIM_RISK_REGISTER.md`, `UI_STATE_AND_A11Y_MATRIX.md`, `ORCHESTRATOR_CONTRACT.md`, `WORKER_RUN_LEDGER.jsonl`; `docs/design/REFERENCE_REGISTRY.md`, `FRONTEND_REFERENCE_QUEUE.md`, the design brief; `docs/qa/MOTION_AND_PERFORMANCE_BUDGET.md`, `RESOURCE_SECURITY_REVIEW.md`.

| Gate | Status |
|---|---|
| R0 reconciliation | PASS. Local equals origin for both repos; CI and deploy are green. |
| R1 parser / classifier / P0 | PASS. Verified 2026-10-12: 23 normalizer tests, 65 Bob tests, parity golden cases. |
| R2 fresh install | PASS. Django and Flask, 2026-10-12 (private log). |
| R3 hook truthfulness | PASS. README states runner feedback only (30bb017). |
| R4 reproduction / classification | PASS. Targeted runs are never green (63e1499). |
| R5 design | PASS. Redesign plus design audit (c42070f). |
| R6 browser QA | PASS (automated / programmatic), except the human screen-reader pass, which is OPEN. |
| R7 claims and provenance | PASS for the site and README. Video and organizer confirmation are OPEN (human). |
| R8 deploy parity, metadata, 404, rollback | PASS. Rollback target `b717ce8`. |
| R9 final readiness | **NOT_SUBMISSION_CLEAN**. The video, organizer email, eligibility confirmation, screen-reader pass and form submission are all human steps. |
| S1 submission | Human only. |


## Update 2026-10-13, evening (Claude Code): enhancement layer
- **What shipped:** the participant directed that the named resources be used.
  - Three.js suite map; GSAP ScrollTrigger sequence, tickers and reveals
  - liquid-gradient hero, parallax and tilt, opt-in chime
  - Magic UI-style beams; bento band from UI UX Pro Max data; keys 1–4
- **Independent audit:** 8 parallel read-only auditor agents (workflow run wf_d17b0a12-827) reported 31 findings. All P0 and P1 findings were fixed before commit, including:
  - a **false-green classifier bug for null or unknown outcomes**, fixed in both the browser and Python versions (kit 278ab94); parity now has 7 golden cases
  - an infinite animation not covered by reduced motion
  - WCAG 2.1.4 single-key shortcuts
  - per-frame blur cost, and an always-on WebGL render loop
  - stale cards during loading, and a class-name collision
  - stale records
- **Re-QA:**
  - no overflow at 320/375/768/1440 with the layer on (HTTP) or off (file://)
  - 4 verdicts correct in both modes
  - rendered contrast: 0 failures in both themes
  - 200% zoom: no overflow
  - reduced-motion captures: `fx-http-reduced-*`
- **Status:**
  - R0, R6 and R8 must be re-confirmed against the new deployed SHA. See the UI QA report addendum.
  - The verdict stays **NOT_SUBMISSION_CLEAN**: the video, organizer email, eligibility confirmation, screen-reader pass and form submission are human steps.


## Update 2026-10-13, late night (Claude Code): consultations and final functional pass
- **Consultations:**
  - ChatGPT ("Claude Code Master Prompt" chat) and Codex (the thread that wrote the master prompt) both recommend keeping variant B and adding no further effects.
  - ChatGPT found 6 bugs, fixed in 13a2047.
  - Codex's credibility fixes were applied in 89fe6f4.
- **Live endpoint audit (89fe6f4):** robots, sitemap, 404.html, preview.png, deck PDF, corrections, corrected report, Bob fix commits and the commit list all return 200. `/no-such-page` returns 404. All 45 links resolve, the `#run=` deep link works, and there are 0 console errors and 0 failed requests.
- **Clean-install re-run (C3):** fresh Django and Flask clones with the committed kit. The first attempt found a parser gap: on a fresh Django checkout one test header was glued to migration output, so the run was correctly INCONCLUSIVE. Fixed in kit 187c8fe (+1 regression test, 24 total). The re-run then passed: Django FULL 29 inherited / 0 regressions, Flask FULL 1 inherited, and an injected unknown status was INCONCLUSIVE in both.
- **Verdict:** remains **NOT_SUBMISSION_CLEAN**. Open items: the demo video, the manual screen-reader, keyboard and mobile passes, the organizer email, eligibility confirmation and the human form submission.
