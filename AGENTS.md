# OnRamp frontend contract

OnRamp is an evidence explorer for developers and judges reviewing an IBM Bob code-change workflow. Visitors need to answer three questions quickly: what was already broken, what changed, and what evidence supports the verdict.

## Product truth

- Audience: engineers, reviewers, and hackathon judges inspecting unfamiliar-codebase work.
- Primary jobs: inspect the browser classifier, compare baseline and later runs, follow the blind-fix evidence, inspect the feature proof, and verify portability/provenance.
- Voice: precise, calm, editorial, technical, and honest about scope.
- The visible counts, run labels, file links, commit links, and source notes are authoritative. Decorative visuals, including the 3D suite map, must remain secondary.

## Design rules

- Keep one clear focal task per section. Use hierarchy and whitespace before adding effects, cards, gradients, or animation.
- Preserve the evidence arc: hero claim → classifier rules → interactive run → baseline → blind fix → feature → portability → provenance.
- Never invent customers, teams, adoption numbers, live-session claims, test results, or product capabilities. Label real, targeted, synthetic, inconclusive, and decorative states where they appear.
- Prefer native HTML semantics (`a`, `button`, `label`, `table`, `details`, headings) before ARIA. Every icon-only control needs an accurate accessible name.
- Every interaction needs keyboard access, visible `:focus-visible`, a single-pointer alternative to dragging, and a textual state/fallback. Do not hide critical evidence behind hover.
- Keep scrolling native. Scroll-linked motion may clarify progress but must not pin, snap, hijack wheel/touch input, or change reading order.
- Honor `prefers-reduced-motion` and the global motion control. Decorative video, parallax, reveals, and map animation must stop or become static; evidence must remain visible.
- Keep the suite map live and 360° rotatable, but keep counts and test details in normal document flow. The map is an index, not a dependency graph.
- Use a small token set, explicit transitions, tabular numbers for comparable metrics, safe-area padding, and deliberate responsive breakpoints. Never use `transition: all`.
- Avoid generic AI aesthetics: nested cards, purple/blue gradients, unexplained glow, oversized all-caps metadata, and decorative motion without an evidence job.

## Required verification

Run before publishing:

```text
node --check fx.js
git diff --check
python -m unittest discover -s py -p 'test_*.py' -v
python py/parity_check.py
```

Smoke-test desktop, mobile, keyboard focus, reduced motion, the classifier states, and the 360° suite map. Verify that the deployed SHA matches the source SHA.

## Reference repositories

These are principles adopted into this project, not runtime dependencies:

- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): keyboard/focus, hit targets, semantic HTML, empty/error states, URL state, media fallbacks, and performance.
- [Impeccable](https://github.com/pbakaus/impeccable): product context before styling, anti-slop review, distill/critique/audit/polish workflow.
- [Radix Primitives](https://github.com/radix-ui/primitives): accessible, composable, interoperable interaction primitives.
- [Adobe React Spectrum](https://github.com/adobe/react-spectrum): adaptive keyboard and screen-reader behavior and explicit interaction states.
- [shadcn/ui](https://github.com/shadcn-ui/ui): semantic design tokens, variants, and composition discipline.
- [Motion](https://github.com/motiondivision/motion): purposeful in-view and scroll-linked animation concepts; do not add a second animation runtime to this vanilla page.
- [GSAP](https://github.com/greensock/GSAP): existing ScrollTrigger implementation, responsive `matchMedia`, cleanup, and non-scroll-jacking motion.
- [Three.js](https://github.com/mrdoob/three.js): current suite-map rendering, raycasting, resize lifecycle, and visibility-aware rendering.
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss): token-first styling discipline; do not add Tailwind solely for this static page.
