# Evidence Explorer: design brief and decisions (Claude Code, 2026-10-13)

## Audience and first viewport
The page is for hackathon judges, who scan it in seconds. The first viewport has to answer four questions:
- **What problem?** "Know what's broken before you fix it."
- **What does the kit do?** The lede.
- **How does it decide?** The rule table on the right of the hero.
- **What can I try?** The primary CTA.

The proof facts sit directly below: 1,761 tests, 29 inherited failures, 0 regressions, 23 Bob commits, and CI.

## Information architecture
1. **Try it.** Real and synthetic runs are a radio group, each tagged "real run" or "synthetic". The demo classifies on load and again on each selection.
2. **Explore.** The inherited-failure table and the fingerprint.
3. **Fix.** The verdict strip and both diffs come first. Then a 4-step timeline. The sealed brief and the limits of the seal are in a `<details>`.
4. **Build.** Cropped before/after figures for #1090 sit side by side.
5. **Reuse.** Three run cards, colour-coded by outcome: red means gaps were found, amber a partial run, green a run that worked unchanged.
6. **Provenance.** Panels show what Bob did and what Claude did, with milestones. The full commit list is in a `<details>`.

## Principles adopted (studied, not copied; no third-party code or assets)
- **Apple-style hierarchy:** one idea per section, a large heading, a one-line takeaway, then the evidence.
- **Intentional micro-detail:** monospace section numbers, chips coloured by state, a top border on each run card that encodes its outcome.
- **Interactive proof over prose:** the classifier result is visible without a click.

## Rejected
- **3D, liquid or gradient scenes, scroll-played sequences, parallax:** none of these explains or proves anything, they cost performance, and each would need a reduced-motion fallback.
- **React rewrite or new packages:** the page stays one static HTML file plus `classifier.js`.
- **Fake metrics or testimonials.**

## Constraints kept
- Every number is generated from evidence files by `build_site.py`.
- **Skip link and keyboard access:** visible `:focus-visible` outlines, and radio inputs reachable by keyboard.
- **Reduced motion:** `prefers-reduced-motion` turns off smooth scrolling and transitions.
- **Phone widths:** `minmax(0,1fr)` grid columns, so wide tables scroll inside their own panel instead of widening the page.
- **Contrast:** colour tokens meet WCAG AA in both themes; see the QA results.
- **Font:** IBM Plex via Google Fonts, falling back to system-ui; the page works without it.
