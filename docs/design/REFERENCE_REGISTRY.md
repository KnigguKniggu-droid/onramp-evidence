# Reference registry: external design and engineering resources

Maintained by Claude Code. Last reviewed 2026-10-13. Nothing in this table is a dependency because it appeared in a saved reel, a ChatGPT conversation or this file. Only rows marked **ADOPTED** are used by the Evidence Explorer.


## Revision, 2026-10-13 (evening)
The participant directed that the named resources be **used**, not only studied. The earlier "reference only / rejected" decisions below were reversed where a resource could serve the evidence. Rows changed:

| Resource | New decision | What ships | Version / licence / hash | Fallback |
|---|---|---|---|---|
| **Three.js** | **ADOPTED** | The 3D "Suite map": one dot per Healthchecks test (1,767), ordered by test id so modules form bands. It recolours when the classifier verdict changes (`fx.js`). | r160 (0.160.0), MIT. Self-hosted `vendor/three.module.min.js`, SHA-256 3e690ac7…ba6, identical on jsDelivr and unpkg. | Loaded only when the map is visible and the browser is idle. No WebGL means a text fallback; the result cards carry the same counts. |
| **GSAP + ScrollTrigger** | **ADOPTED** | Scroll-played blind-fix sequence: a scrubbed progress bar with the steps lighting up in order, never pinned. Also section reveals, number tickers, and the verdict and card transitions. | 3.12.5, GSAP Standard "No Charge" License. Self-hosted; SHA-256 28033e44… (gsap) and ad33c2df… (ScrollTrigger), identical on cdnjs and jsDelivr. | Content is static HTML. Every tween animates *from* an offset, so nothing is hidden without JS. Reduced motion turns all of it off. |
| GetLayers (layer principle) | **ADOPTED (principle)** | The hero is built as layers: a drifting liquid-gradient layer, then the statement, then the decision-rules panel. Each has a stated purpose. | No GetLayers prompt or asset used | Static gradient under reduced motion |
| Unnamed 3D / liquid / gradient roundup | **ADOPTED (category only)** | Original CSS liquid gradient: three radial gradients drifting slowly, with no blur filter; paused when the hero is off-screen | — (repository identities still not obtained) | Static |
| Framer cloth / parallax / chime | **ADOPTED (original implementation)** | Pointer parallax on the hero layers, a gentle tilt (3°, no overshoot) on the rules panel, and an **opt-in** WebAudio chime that differs for clean, regression and inconclusive results | No Framer remix used. Sound is synthesised with no audio files and is off by default. | Fine pointers only. Off under reduced motion. Never autoplays. |
| Reactive scenes / loaders / scroll-played | **ADOPTED** | Evidence-flow beam (Baseline → Later run → Classifier → Verdict) animates while classifying and turns green, red or amber with the verdict. The suite map is the reactive scene. The scroll-played sequence is above. | — | Text loading state, `aria-busy` |
| Magic UI | **ADOPTED (patterns, original code)** | "Animated beam" (the evidence flow), "border beam" (runs twice on the selected scenario), "number ticker" (stats and result cards). Written from scratch in CSS and vanilla JS; no Magic UI code copied. | Magic UI is MIT; nothing vendored | Static border, static numbers |
| UI UX Pro Max | **USED (data only, read-only)** | Its `products.csv` / `ui-reasoning.csv` rows for "Developer Tool / IDE" recommend dark minimal Swiss style plus a bento grid, with keyboard shortcuts as a must-have. Applied as the bento proof band (1,761 cell with a pass/fail bar) and the 1–4 demo shortcuts. | Shallow clone at commit 7246805992a42b7bba37d4cac83b01416f0c6c44 (MIT). Read only; **no script executed, nothing installed.** | — |
| 21st MCP, Paper, Vectary, Jitter, HyperFrames, Motion (React), R3F, Threlte, Webflow, Framer (hosting), Awwwards, MotionSites, Awesmos | unchanged | Not used. 21st/Paper would need an API key or account connection; R3F, Threlte and Motion need React or Svelte; HyperFrames and Jitter belong to the video track. | — | — |

The rows below this revision are the earlier decision record, kept for history.

## Provenance categories
- **Saved-reel review:** the participant's private review of saved Instagram reels. Reel identifiers and transcripts are kept in the private workspace, not in this public repo.
- **Package check, 2026-10-11:** checks recorded in the private handoff package, made by the ChatGPT assistant. They were not repeated by Claude unless the row says so.
- **Claude check, 2026-10-13:**
  - each official URL was fetched; every one listed here returned HTTP 200
  - the repository licence was read from the GitHub API (`license.spdx_id`)
- **Not obtained:** the material named in a reel was never recovered. No names, links or contents are invented for it.

## Decision vocabulary
`ADOPTED` · `EVALUATE` · `REFERENCE_ONLY` · `UNVERIFIED` · `REJECTED` · `NOT_OBTAINED`

## Registry

| Resource | Official URL / repository | Provenance | Verified facts | Licence / terms | Runtime, network, credentials | Decision and reason |
|---|---|---|---|---|---|---|
| **IBM Plex Sans / Mono** | https://github.com/IBM/plex, served by Google Fonts | Claude's own choice for the redesign | GitHub API: OFL-1.1 | SIL Open Font License 1.1 | Two stylesheet/font requests to fonts.googleapis.com and fonts.gstatic.com, which send the visitor's IP to Google. No credentials. Loaded with `display=optional`; system-ui is the fallback. | **ADOPTED.** Supports the IBM context and gives a clear type hierarchy. Fallback tested with the font hosts blocked (`r6-extra-fonts-blocked-1280.png`). |
| GetLayers | https://www.getlayers.ai/ · docs /docs · no repository | Saved-reel review | URL 200 (Claude). Prompt and layer library with paid tiers and an optional MCP (package check). | https://www.getlayers.ai/terms-of-use (package) | Account and billing. The optional MCP could send project context. Not installed. | **REFERENCE_ONLY.** Its "compose in layers, each layer with a purpose" principle shaped the hero (statement / decision rules / proof). No prompts or templates copied. |
| MotionSites | https://motionsites.org/ · /about · /explore | Saved-reel review (3 reels) | URL 200 (Claude). Prompt/reference library, not a host or builder (package check). | https://motionsites.org/terms (package) | Membership. Nothing downloaded. | **REFERENCE_ONLY.** Used for section-decomposition thinking only. Promotional "tested" / "pixel-perfect" claims are not verified. |
| Awesmos | https://awesmos.com/ | Saved-reel review | URL 200 (Claude). The package's fetch had timed out. Catalogue contents not reviewed. | Terms not located | Unknown | **UNVERIFIED.** No prompt or source artifact evaluated, so nothing used. |
| Unnamed 3D / liquid / gradient repository roundup (4 repos) | Not recovered | Saved-reel review | The reel's repository identities were not preserved | — | — | **NOT_OBTAINED.** Kept only as visual categories. None materially improves comprehension of a test-classification page, so none is prototyped. |
| Framer cloth / parallax / chime interaction | https://www.framer.com/publish/ (platform only) | Saved-reel review | URL 200 (Claude). The specific remix was not obtained. | https://www.framer.com/legal/terms-of-service/ (package) | Hosted tool. Not used. | **REFERENCE_ONLY.** Rejected for runtime: no state on this page benefits from parallax or sound. |
| Reactive scenes, loaders, scroll-played sequences | — | Saved-reel review | Principle only | — | — | **REFERENCE_ONLY.** Adopted as "meaningful loading and failure states": a text loading state, `aria-busy`, an offline message and a stale-result guard. Scroll-played sequences were rejected; the 4-step timeline is static. |
| Apple-style spacing / taste audit skill | — | Saved-reel review | The promoted skill was **not obtained** | — | — | **NOT_OBTAINED.** Only the derived audit discipline is used (see the design brief, "Design audit"). No Apple trade dress, assets or copy. |
| Anti-vibe-coding failure-mode gate | — | Saved-reel review | Principle only | — | — | **REFERENCE_ONLY.** Implemented as the gate in the design brief and the state matrix. |
| Prepublish / SEO checklist | — | Saved-reel review | The exact checklist was not obtained | — | — | **NOT_OBTAINED.** A derived gate was implemented and verified instead (UI QA report §SEO). |
| Paper.design | https://paper.design/ · /docs · /downloads | Wider project context | URL 200 (Claude). Canvas, tokens, MCP and HTML export are documented (package). | https://paper.design/terms (package) | Optional MCP with repository access. Not connected. | **EVALUATE.** No connection made. Before any use, review its MCP permissions and data handling. |
| 21st.dev / unified 21st MCP | https://github.com/21st-dev/magic-mcp · endpoint https://21st.dev/api/mcp | Wider project context | GitHub API: **ISC** licence. The install guide says Magic MCP is replaced by the unified 21st MCP (package). | ISC (repository) | Requires an API key and makes outbound calls with project content. **Not installed, no key requested.** | **EVALUATE.** Only in a disposable project, never in this repo or Claude config. |
| Magic UI | https://magicui.design/ · https://github.com/magicuidesign/magicui | Saved-reel review | URL 200. GitHub API: MIT. | MIT | React / Tailwind components. This site is vanilla HTML/JS. | **REFERENCE_ONLY.** Adopting a component would mean a React toolchain, which is not justified. |
| Motion (Framer Motion) | https://motion.dev/docs · https://github.com/motiondivision/motion | Wider project context | URL 200. GitHub API: MIT. | MIT | React runtime | **REJECTED** for this site. The page has no animation that CSS cannot express. |
| GSAP / ScrollTrigger | https://github.com/greensock/GSAP · https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Wider project context | GitHub API reports no SPDX licence. Standard License page 200. | GSAP Standard License (not OSI) | JS runtime | **REJECTED.** No bounded scroll narrative is needed; the page does no scroll-jacking or pinning. |
| Three.js | https://threejs.org/ · https://github.com/mrdoob/three.js | Saved reel; wider context | MIT (GitHub API) | MIT | WebGL / GPU | **REJECTED** at runtime. 3D does not explain test classification. |
| React Three Fiber | https://github.com/pmndrs/react-three-fiber | Wider context | MIT (GitHub API) | MIT | React + WebGL | **REJECTED.** Same reason, plus it would need a framework migration. |
| Threlte | https://threlte.xyz/ · https://github.com/threlte/threlte | Saved-reel review | MIT (GitHub API) | MIT | Svelte + WebGL | **REJECTED.** Same reason. |
| Vectary | https://www.vectary.com/ | Saved-reel review | URL 200 | https://www.vectary.com/terms-of-service/ (package) | Hosted 3D editor | **REFERENCE_ONLY.** No asset needed. |
| Jitter | https://jitter.video/ | Saved-reel review | URL 200. Export terms not reviewed. | Not reviewed | Hosted motion editor | **EVALUATE**, video track only. Any asset made with it must be labelled as illustration, never as product evidence. |
| HyperFrames | https://github.com/heygen-com/hyperframes · https://hyperframes.heygen.com/introduction | Wider context | Apache-2.0 (GitHub API). Docs URL 200. | Apache-2.0 | CLI with dependencies | **EVALUATE**, demo-video track only. Not installed. Must never be used to fabricate Bob sessions or UI. |
| Awwwards | https://www.awwwards.com/ | Wider context | URL 200 | Site terms not reviewed | Browser reference | **REFERENCE_ONLY.** Hierarchy, pacing and restraint studied; nothing copied. |
| Webflow interactions | https://webflow.com/webflow-way/design-systems/interactions | Wider context | URL 200 | Not reviewed | Hosted platform | **REFERENCE_ONLY.** State-driven interactions only. |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · https://www.uupm.cc/ | Wider context | MIT (GitHub API). Site 200. | MIT | Claude skill / CLI that executes code | **EVALUATE.** Not installed. If ever trialled: pin a commit and inspect the install script in a disposable workspace. |

## Rules
- A resource moves to ADOPTED only after its exact version, licence, dependencies, install scripts, network behaviour and fallback have been recorded here, and an owner has approved it.
- No API keys, MCP servers, global CLIs or browser extensions were installed for the Evidence Explorer.
- **Next review:** before any change in a resource's decision, and before 2026-10-17, the planned submission date.
