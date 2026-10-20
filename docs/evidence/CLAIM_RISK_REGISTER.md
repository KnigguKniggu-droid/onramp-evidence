# Claim risk register (the team, 2026-10-13)

Release verdict: **NOT_SUBMISSION_CLEAN.**

| ID | Risk | Severity | Current state, with evidence | Status |
|---|---|---|---|---|
| CR-01 | A 1-test targeted run reported 29 failures as fixed | CRITICAL | The classifier counts only tests that ran (Bob 2a527f8). The corrected report is primary and the original is labelled superseded. | MITIGATED |
| CR-02 | Full and targeted runs conflated, or a targeted run shown green | CRITICAL | The targeted verdict has been amber since 63e1499 and says "not a full-suite result". Crashed or invalid runs get "Inconclusive — no verdict". Parity CI is green. | MITIGATED |
| CR-03 | "Blind" read as "Bob never saw the source" | HIGH | The site and README say the brief was sealed before *issue-specific* work, after Bob had mapped the codebase | MITIGATED |
| CR-04 | Empty allowed/withheld seal fields | HIGH | Disclosed on the site (inside `<details>`) and in the corrections. The historical JSON is unchanged. | MITIGATED |
| CR-05 | Bob's fix described as identical to the maintainer's | HIGH | The strip reads "≠ different accepted-status policy", and both diffs are shown | MITIGATED |
| CR-06 | Kit commit and upstream pin conflated | HIGH | Since 63e1499 (site) and 30bb017 (README), e10db36 is named as the kit commit and its app code is shown to equal upstream 0968fa2 | MITIGATED |
| CR-07 | "All software written by IBM Bob" | HIGH | Who-did-what panel, README "How it was built", and the team attribution line in commit messages | MITIGATED |
| CR-08 | Reproducer mode described as enforced | MED | README: "an instruction, not a tool restriction" | MITIGATED |
| CR-09 | Hook described as a regression gate | MED | README states it is runner feedback only and always exits 0 (30bb017) | MITIGATED |
| CR-10 | Saved-reel review overstated | HIGH | No public material claims a reel count or review depth. Reel IDs stay private. | MITIGATED |
| CR-11 | External tools implied as adopted | MED | Registry: only IBM Plex is adopted; everything else is reference, evaluate, rejected or not obtained | MITIGATED |
| CR-12 | Static explorer read as a live Bob runtime | HIGH | The page says it is not a live IBM Bob session. The organizers' view of the "live demo" requirement is still unknown. | OPEN (human email) |
| CR-13 | Historical invalid report as the primary link | HIGH | The corrected report is primary on the site and in the README | MITIGATED |
| CR-14 | Release claims based on workflow files alone | HIGH | Run URLs and SHAs recorded in `UI_QA_REPORT.md`, and the deployed content checked live | MITIGATED |
| CR-15 | No demo video | BLOCKER | None exists yet | OPEN (human) |
| CR-16 | Eligibility (18+, US resident) and live-demo acceptance | BLOCKER | Not confirmed in writing | OPEN (human) |
| CR-17 | `robots.txt` at a project subpath is ignored by crawlers | LOW | The `<meta name="robots">` tag is the effective directive; recorded in the QA report | ACCEPTED |
| CR-18 | Performance numbers come from one desktop machine | LOW | `MOTION_AND_PERFORMANCE_BUDGET.md` states the conditions; mobile was not throttle-tested | ACCEPTED |
