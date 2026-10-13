# Orchestration contract (Claude Code, 2026-10-13)

## Actors
- **IBM Bob:** the original kit, the Healthchecks fix and feature, and the kit iterations. Every Bob commit ends with `Generated-by: IBM Bob`. Bob's 180-Bobcoin allowance ran out on 2026-10-11, so Bob has done no work since. No Claude change is routed through Bob attribution.
- **Claude Code:** orchestrated Bob, verified independently, wrote the separately attributed normalizer/bootstrap module, the Evidence Explorer, the QA tooling and these records. Its commits say "Written by Claude Code".
- **Human participant:** chooses goals, records the video, contacts the organizers, confirms eligibility, does the screen-reader pass and submits the form.

## Decision on parallel workers
The 2026-10-13 directive proposed 8–10 parallel workers. Three things argued against it:
- the package's own contract defaults to 0–3 specialists for a static frontend
- the participant's standing preference is to keep usage low
- the remaining work had shared writable files (`template.html`, the evidence docs)

So the R0–R9 work ran **sequentially in the single main Claude Code session, with no subagents**. `WORKER_RUN_LEDGER.jsonl` records only those real stages. No worker events were invented.

## Rules applied to every stage
- Inspect before editing, make the smallest change, re-verify immediately, and give every file one writer.
- Never edit IBM Bob's own files. A local guard blocks edits to Bob product files, and blocks mixing the upstream clone or private notes into Bob's workspace.
- Never alter commit history or dates. Historical reports stay immutable; corrections are dated and separate.
- No installs, MCP servers, API keys or global CLIs. No private package content goes into public repos.
- Stop and record a blocker on a credential prompt, an unexpected edit, a stale SHA, an uncertain licence or an inconclusive suite.
