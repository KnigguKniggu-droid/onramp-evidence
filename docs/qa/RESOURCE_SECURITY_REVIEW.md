# Resource security review (the team, 2026-10-13)

## What the shipped site actually loads
These are the observed live requests at 9121f3d:
- the page itself, `classifier.js` and `data/*.json`, all same-origin on GitHub Pages
- the IBM Plex stylesheet and fonts from fonts.googleapis.com and fonts.gstatic.com

The site has no other third-party scripts, no analytics, no trackers and no embeds. It sets no cookies. Every external link is a plain `<a>` with no `target=_blank`.

The Google Fonts requests send the visitor's IP and user agent to Google. That is the only privacy-relevant request. It is disclosed here, and the page renders correctly with those hosts blocked.

## Update, 2026-10-13 (evening): vendored libraries
- **What was added:** `vendor/three.module.min.js` (three r160, MIT), `vendor/gsap.min.js` and `vendor/ScrollTrigger.min.js` (GSAP 3.12.5, GSAP Standard License: free including commercial use; excludes competing no-code animation builders). The site is a free public page.
- **How they were verified:** each file was downloaded from two independent CDNs and the copies were byte-identical. SHA-256 hashes are in `vendor/README.md`.
- **Served same-origin:** the enhancement layer adds **no third-party requests**. `fx.js` imports only `./vendor/three.module.min.js`.
- **What `fx.js` touches:**
  - `localStorage`, for the sound preference only, wrapped in try/catch
  - `AudioContext`, only after the user turns sound on
  - no network calls besides the same-origin vendor module
- **UI UX Pro Max:** shallow clone at 7246805 into a disposable job directory. Only CSV data was read; no install script or Python ran. Not shipped.
- **Supersedes:** the GSAP and Three.js rows in the table below ("Rejected") are superseded by this update.

## Third-party tools considered
Full rows are in `docs/design/REFERENCE_REGISTRY.md`.

| Risk | Resource | Status |
|---|---|---|
| Outbound project content with an API key | 21st MCP (ISC) | Not installed; no key requested or stored |
| Paid-library terms forbid redistribution | GetLayers, MotionSites | Nothing downloaded or copied |
| Executes code on install | UI UX Pro Max (MIT), HyperFrames (Apache-2.0) | Not installed. A trial would need a pinned commit and a review of the install script in a disposable workspace. |
| Non-OSI licence | GSAP Standard License | Rejected |
| Heavy runtime / GPU | Three.js, R3F, Threlte (MIT) | Rejected |
| Hosted accounts and data upload | Paper, Vectary, Jitter, Framer, Webflow | Not used |
| Unknown identity | Awesmos catalogue, unnamed 4-repo roundup | Unverified / not obtained; quarantined |

## Repository hygiene checks
Run on 2026-10-13 against the onramp-evidence `main` branch:
- **No private material:** none of the private handoff package, saved-reel files or private notes is tracked.
- **Build files kept private:** `build_site.py` and `template.html` stay gitignored because they contain local Windows paths. Only the generated `index.html` is public.
- **Fixtures:** paths in the fixtures are replaced with `<repo>` and `<home>`.
- **No secrets:** there are no API keys or tokens in the repo or in the page.
