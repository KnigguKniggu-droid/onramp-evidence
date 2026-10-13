# Claim-to-source matrix (Claude Code, verified 2026-10-13)

This matrix covers public claims on the Evidence Explorer, in the kit README (`.github/README.md`), in the deck, and in the planned submission text.

- **Repositories:** kit = `KnigguKniggu-droid/onramp`, site = `KnigguKniggu-droid/onramp-evidence`.
- **SHAs at verification:** kit `30bb017`, site `c42070f`.

**Status vocabulary:**
- `VERIFIED`: re-checked on 2026-10-13
- `VERIFIED_EARLIER`: checked 2026-10-11/12, inputs unchanged since
- `VERIFIED_PRIVATE_LOG`: the evidence is a local log that is not published
- `QUALIFIED`: true only with the stated caveat
- `NOT_DONE`

| # | Public claim | Source / locator | How verified | Status |
|---|---|---|---|---|
| 1 | Healthchecks baseline: 1,761 tests, 29 failing on Windows | kit `docs/onramp/evidence/baseline.json` (`tests_run` 1761, 29 `failing`, command `manage.py test`, 2026-10-11T17:46Z) | Read the file. Claude's independent full run gave the same counts and IDs. | VERIFIED |
| 2 | Failure causes: 26 AF_UNIX (AttributeError), 2 Linux-only strftime (ValueError), 1 DST (AssertionError) | `baseline_reclassified.json` (Bob, 703037e) and Claude's run | `build_site.py` asserts the two agree ("match Claude's independent run exactly") | VERIFIED |
| 3 | The baseline was recorded at kit commit `e10db36` on app code identical to upstream `0968fa2` | `git diff onramp-baseline e10db36 -- hc templates static` is empty. Tag `onramp-baseline` = 0968fa2198fa… | Run on 2026-10-13. GitHub API confirms upstream 0968fa2 ("Bump django-stubs version"). | VERIFIED |
| 4 | 0 regressions after Bob's fix and feature, across 1,767 tests (full run) | site `fixtures/full_run_after_fix.txt` → `data/full_run_after_fix.json` → classifier: 29 inherited, 1,732 unchanged, 6 new passing, 0 regression, 0 new failing | Parity check (Python and JS) passes. Live verdict reads "No regressions · full run". | VERIFIED |
| 5 | A targeted run proves nothing suite-wide; 1,761 tests did not run and none count as fixed | `data/targeted_run.json`; classifier scope TARGETED | Live verdict is amber: "Targeted run, not a full-suite result". | VERIFIED |
| 6 | The brief was sealed at 21:05:38 UTC with a SHA-256, before issue-specific work | `benchmark_webhook-205.json`, Bob commit 2c7a863 | File read. Qualification shown on the site: Bob had mapped the codebase earlier; the "allowed/withheld" fields are empty. | QUALIFIED |
| 7 | A failing test came first ("AssertionError: 3 != 1") | `pre_fix_webhook-205.txt` | File read by `build_site.py` | VERIFIED |
| 8 | Bob's fix accepts all 2xx (`range(200,300)`, 5f16187); the maintainer added only 205 (0a9bff9) | `git show 5f16187`; `reference_upstream_0a9bff9.patch`; GitHub API for 0a9bff9 | Diffs rendered from the sources. Upstream commit confirmed via the API. | VERIFIED |
| 9 | Same behaviour and line, different policy; the upstream fix is safer | Bob's comparison (fa7aae5); the corrected report | Wording matches Bob's own report | VERIFIED_EARLIER |
| 10 | The original report counted 29 never-run tests as fixed and is superseded | `REPORT_webhook-205.md` (kept unchanged); `docs/evidence/CORRECTED_REPORT_webhook-205_2026-10-12.md` | Both links are live; the site labels the old one "superseded". | VERIFIED |
| 11 | #1090: JSON bodies shown indented, non-ASCII kept intact | Bob commits 786c034 + e4032c2; screenshots `shots/1090-*` | Diffs rendered from git. Screenshots came from local dev servers with a throwaway check. | VERIFIED_EARLIER |
| 12 | The same kit ran on a second app (TaskFlow, Flask + unittest) over 3 runs | taskflow-onramp{,2,3} `baseline.json`; kit commits 4facc4b, 6be3235, 8165552 | Read by `build_site.py` | VERIFIED_EARLIER |
| 13 | 23 commits by IBM Bob | `git log --grep "Generated-by: IBM Bob" onramp-baseline..HEAD` | Count generated at build time | VERIFIED |
| 14 | CI green on Linux | Kit Actions at 30bb017: Tests, Mypy and Coverage all succeeded (run 38460743005 and siblings) | GitHub API | VERIFIED |
| 15 | Browser and Python classifiers agree | Site `parity` workflow succeeded at c42070f (run 38461456091) | GitHub API | VERIFIED |
| 16 | Healthchecks is a "real 10k-star app" | GitHub API: 10,414 stars, BSD-3-Clause | 2026-10-13 | VERIFIED |
| 17 | Bob's 180-Bobcoin allowance ran out | Bob IDE log `BudgetExceededError … allowance of 180 Bobcoins`, 2026-10-11 21:37:52 local | Local log; disclosed in `CLAUDE_CORRECTIONS_2026-10-11.md` | VERIFIED_PRIVATE_LOG |
| 18 | The quick start was tested on untouched Django and Flask clones | `tooling/state/onramp/R2_fresh_install_2026-10-12.txt` (private workspace) | Run 2026-10-12: profile created, FULL, 0 regressions | VERIFIED_PRIVATE_LOG |
| 19 | The normalizer/bootstrap module is Claude-authored (23 tests) | Kit commits dfb2e58, 93c611d ("Written by Claude Code") | Commit messages and README | VERIFIED |
| 20 | The hook is runner feedback only | `.bob/hooks/run-app-tests.mjs` always calls `process.exit(0)` and never reads the baseline | Source read 2026-10-13; README updated in 30bb017 | VERIFIED |
| 21 | The demo is a browser classifier, not a live Bob session | Site copy under "How this demo works" | Page text | VERIFIED |
| 22 | Demo video ≤ 3 min | — | — | NOT_DONE (human) |
| 23 | Live demo link is acceptable to the organizers | — | Email not yet sent or answered | NOT_DONE (human) |
