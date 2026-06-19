# Motion stack (portfolio)

Chosen from [Spell UI comparison](https://spell.sh/blog/best-react-animation-libraries):

- **Motion** (`motion` package) — hero choreography, scroll-linked parallax, `whileInView` reveals, route template fade.
- **CSS / Tailwind** — marquee, Ken Burns baseline, grain, orbs (no extra JS).
- **Not added:** GSAP (timeline overkill + licensing), Lenis (native scroll is fine for a gallery site), Spell UI (prebuilt components would fight the custom editorial system).

Rationale: one primary React animator; keep bundle and mental model simple.