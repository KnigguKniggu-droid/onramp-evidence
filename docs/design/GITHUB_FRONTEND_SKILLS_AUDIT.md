# GitHub frontend skills audit

Updated 2026-10-14. This is a source-backed implementation guide for OnRamp, not a dependency list. The site is a buildless HTML/CSS/vanilla-JS evidence explorer, so the useful output from these repositories is the rule set and review method, not wholesale framework adoption.

## Executive decision

Adopt five habits immediately:

1. Treat the page as an evidence workflow, not a generic landing page.
2. Treat every interaction as a state machine with native semantics, keyboard access, focus, and a non-drag alternative.
3. Use one visual system: a limited token set, intentional typography, and effects that explain the evidence.
4. Keep scroll motion non-blocking and make the static page fully truthful under reduced motion.
5. Keep the 3D map technically live but semantically secondary to adjacent counts, labels, and source artifacts.

## Repository matrix

| Repository | Skill or rule worth using | OnRamp implementation |
|---|---|---|
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | Full keyboard support, visible unobscured focus, 44px mobile targets, native semantics, explicit `aria-label`, text alternatives, deep-linkable state, no `transition: all`, media fallbacks, and performance measurement. | `AGENTS.md`, global focus/touch rules, map controls, source-linked run selection, reduced-motion video behavior, and release smoke checks. |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Establish product truth before visual direction; use `shape`, `critique`, `audit`, `distill`, `harden`, `animate`, `typeset`, `layout`, and `polish` as a review vocabulary; detect AI-slop patterns. | Use “evidence above effects” as the design gate. Reject generic gradients, nested cards, fake metrics, and decorative motion that does not improve comprehension. |
| [radix-ui/primitives](https://github.com/radix-ui/primitives) | Build accessible, functional, interoperable, composable, customizable primitives. | Keep radio/checkbox/button/details/table elements native and style state from attributes/classes rather than inventing click-only div controls. |
| [adobe/react-spectrum](https://github.com/adobe/react-spectrum) | Treat keyboard navigation, screen-reader output, focus-visible state, and adaptive behavior as part of the component contract. | Apply the same contract manually to the buildless page. No React migration is justified by this audit. |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Semantic CSS variables, intentional variants, full composition, correct interactive element rendering, and explicit empty/loading states. | Keep the existing token layer coherent; style the classifier’s real/synthetic/inconclusive states explicitly rather than adding another UI kit. |
| [motiondivision/motion](https://github.com/motiondivision/motion) | Separate in-view reveals from scroll-linked progress; use GPU-friendly transforms and reduced-motion support. | Keep GSAP as the only animation runtime. Use Motion’s conceptual split: one-time section reveals, one small non-pinned blind-fix scrub, and no scroll hijacking. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | Use `ScrollTrigger` for measured, responsive scroll-linked effects; use `matchMedia`/cleanup for responsive and reduced-motion behavior. | Preserve the existing blind-fix scrub, keep it unpinned, and prevent scroll animation from hiding evidence or changing reading order. |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | Use a render lifecycle with resize/visibility handling and explicit raycast thresholds. | Preserve 360° yaw, clamped pitch, pointer capture, click-vs-drag threshold, keyboard/buttons, WebGL fallback, and adjacent text authority. |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Centralize design tokens and keep component styles composable and predictable. | Continue with scoped CSS variables because the page is buildless; do not introduce Tailwind merely to imitate its token discipline. |

## Concrete changes applied from the audit

- Added this audit and a project-level `AGENTS.md` so future Claude/Codex/Bob work inherits the design and evidence contract.
- Keep the current cinematic hero, but use the actual OnRamp counts instead of copied Vesper/enterprise claims.
- Preserve the full scroll narrative and the live 360° suite map; no new framework or component dependency is added.
- The next low-risk CSS hardening pass should enforce dark browser chrome, 44px map controls, tabular metrics, explicit touch behavior, and safe anchor offsets.

## Rejected changes

- No React/Radix/React Aria migration: the current buildless page does not need a framework rewrite.
- No Motion runtime: GSAP already owns the page’s scroll-linked behavior.
- No copied prompts, private templates, paid assets, or unverified claims from UI prompt marketplaces.
- No scroll-jacking, autoplay audio, fake live telemetry, or map-as-authority presentation.

## Release checklist

- Hero: black fallback, readable over video, factual claim, clear classifier CTA.
- Demo: all run scopes and synthetic/inconclusive states visible; URL state shareable.
- Map: live render, 360° drag, arrow buttons, keyboard arrows, reset, pick status, reduced-motion behavior, WebGL fallback.
- Evidence: source links beside claims; tables remain semantic; code and hashes remain readable.
- Responsive: 320/375/768/1024/1440 widths; no horizontal overflow except intentionally labeled data/code scrollers.
- Accessibility: visible focus, keyboard path, screen-reader names, color-plus-text status, motion pause, reduced motion.
- Performance: video metadata preload only, no new runtime dependency, no expensive layout reads in scroll handlers.
