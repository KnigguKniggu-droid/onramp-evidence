# Resource security review (Claude Code, 2026-10-13)

## What the shipped site actually loads
These are the observed live requests at 9121f3d:
- the page itself, `classifier.js` and `data/*.json`, all same-origin on GitHub Pages
- the IBM Plex stylesheet and fonts from fonts.googleapis.com and fonts.gstatic.com

The site has no other third-party scripts, no analytics, no trackers and no embeds. It sets no cookies. Every external link is a plain `<a>` with no `target=_blank`.

The Google Fonts requests send the visitor's IP and user agent to Google. That is the only privacy-relevant request. It is disclosed here, and the page renders correctly with those hosts blocked.

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
