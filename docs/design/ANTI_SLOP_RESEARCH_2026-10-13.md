# Anti-slop UI research, 2026-10-13 (summary)

Two research agents ran in parallel, both read-only, with no accounts, purchases or installs:
1. **Web and GitHub sweep:** 42 sources read live, including skills, essays, galleries and reference sites.
2. **Handoff-package sweep:** every resource named in the private handoff package (50 items) was resolved and visited. That full report stays in the private workspace, because it cites private saved-reel material.

## Prompts found and used
- **Used for the experiment:** Anthropic `frontend-design` SKILL.md, https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md (Apache-2.0). The process and results are in `EXPERIMENT_B_FRONTEND_DESIGN_SKILL.md`.
- **Also read:** the Anthropic cookbook "Prompting for frontend aesthetics", https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics (MIT). Its "layer gradients / atmosphere" advice is superseded by the skill above.
- **From the package sweep:** the Open Design `craft/anti-ai-slop.md` rules (Apache-2.0; repo matched by name only). Its easing curve, 150 ms timings and loading-state fallback were applied.

## Rule sources (GitHub)
| Source | Licence | What it contributed |
|---|---|---|
| https://github.com/pbakaus/impeccable (craft-floor, detector rules) | Apache-2.0 | Browser-surface polish (`::selection`, `theme-color`, scrollbars); detectors such as `tracked-caps`, `kicker-above-heading`, `dark-glow`, `side-tab`, `gradient-text` |
| https://github.com/Leonxlnx/taste-skill | MIT | A "competitor test" for the page idea; monospace only for real artifacts |
| https://github.com/samber/cc-skills (frontend-design-deslop) | MIT | Slop checklist and dark-mode rules |
| https://github.com/vercel-labs/web-interface-guidelines | MIT | `tabular-nums`, typographic punctuation, deep-linkable state, motion under 200–300 ms |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT | Developer-tool design system; pre-delivery checklist |
| https://github.com/Laith0003/ux-skill (wiki) | MIT | Placeholder and filler-copy tells |
| https://github.com/evilmartians/devtool-template | MIT | Dev-tool page structure: live UI as hero for narrow utilities, two CTAs |

## Other sources
| Type | Sources |
|---|---|
| Essays | interfaces.rauno.me; Evil Martians "We studied 100 dev tool landing pages"; NN/g on scrolljacking; Emil Kowalski "You don't need animations"; prg.sh on the purple-gradient default; superdesign.dev; noqta.tn |
| Reference pages | Jepsen analyses (evidence presentation); Oxide (figure captions); Linear; Zed; Raycast; Astral; Tailscale; Ciechanowski (user-driven figures) |
| Not accessible | land-book.com and lapa.ninja (HTTP 403); Refactoring UI (paid; table of contents only); Mobbin (account required); godly.website (now redirects to recent.design) |

## Applied on the live page (variant B)
The page no longer has:
- a kicker above the H1
- the hero-metric stat cards (now a Jepsen-style summary table)
- the radial haze and hero parallax
- mono uppercase section labels
- middle-dot and em-dash label strings in body copy
- ✓ glyph icons
- the glow on the step node
- the decorative dot grid
- per-section fade-ups and hover lift

It now has:
- figures captioned with their sources ("Fig. 1–3")
- CTAs that say what they do
- the craft floor (`::selection`, `theme-color`, `scrollbar-color`, `caret-color`, `text-wrap`, `tabular-nums`, 68ch measure)
- deep-linkable demo state (`#run=…`)
- one easing curve
- a 15-second loading fallback

Measured before and after: `EXPERIMENT_B_FRONTEND_DESIGN_SKILL.md`.

## Open items from the research
- **Bordered containers:** about 33 remain. Most are real UI fragments, but there is room to reduce them.
- **Violet "not run" colour:** a status colour, kept for meaning. It sits in a band some checklists flag.
- **Number colours:** the research recommends naming colours in prose next to the figure (Ciechanowski). The suite-map caption does this partly.
