# Harrison Ferraro — Design System (live)

Dark, warm, editorial gallery. The paintings dominate; the site is the frame. No template aesthetics, no commerce UI.

## Color system

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#080706` | Deepest background |
| `bg-2` | `#100d0a` | Secondary background |
| `surface` | `#15120f` | Panels |
| `surface-2` | `#211a15` | Elevated panels |
| `--paper` | `#f0e7dc` | Filled CTA ground |
| `text` | `#f0e7dc` | Primary text |
| `text-2` | `#b7aa9b` | Secondary text |
| `text-3` | `#8f8375` | Tertiary / muted |
| `--border` | `rgba(234,225,213,0.16)` | Hairlines |
| `--border-strong` | `rgba(234,225,213,0.32)` | Active hairlines |
| `oxide` | `#b65d2c` | Primary accent |
| `oxide-2` | `#d1844a` | Hover accent |
| `--blood` | `#4a1410` | Radial background glow |

Body ground: layered radial gradients (blood top-right, oxide left) over a near-black vertical gradient, plus a fixed SVG grain overlay (`.grain`) and vignette.

## Typography

- **Display:** Cormorant Garamond 300–600 + italics — oversized serif headlines, tight tracking (−0.04em to −0.09em), fluid `clamp()` sizes up to ~15rem
- **Utility:** JetBrains Mono 300–500 — eyebrows, body copy (~0.86–0.94rem, generous leading), buttons, metadata
- `.eyebrow` — mono uppercase micro-label with a leading oxide rule

## Motion

- Easings: `--ease-heavy` `cubic-bezier(0.16,1,0.3,1)`, `--ease-soft` `cubic-bezier(0.32,0.72,0,1)`
- Route entrance: `app/template.tsx` — opacity-only fade (0.45s). No per-page entrance classes.
- Scroll reveals: `Reveal` (blur + rise, once), `TextReveal` (word groups), `SeriesSection` clip-path titles
- Hero: pointer parallax + scroll parallax + slow Ken Burns (`HomeHero`)
- **View transitions:** `experimental.viewTransition` + `ArtworkTransition` — each painting carries `artwork-<slug>` and morphs from gallery card to detail hero. Root cross-fade 0.4s, group morph 0.55s (`globals.css`).
- All motion honors `prefers-reduced-motion`; a `.no-js` rescue keeps content visible without JavaScript.

## UI primitives

- Buttons: `.btn-ink` (paper fill) and `.btn-line` (outline) only; `↗` tail glyph; `.btn-full` modifier
- `ArtFrame` (`.art-shell` / `.art-core`) — hairline gallery frame around every painting
- `.statement-panel`, `.success-box`, `.divider`
- Nav: fixed glass bar (desktop) / bottom-pinned bar + "More" sheet with focus trap (mobile)

## Imagery

- `next/image` with `placeholder="blur"` from `lib/blurPlaceholders.ts` on every painting
- `priority` only on the homepage hero and the artwork-detail hero
- Paintings darkened/desaturated with CSS filters when used as backgrounds so type stays readable

## Information architecture

Home → Work (`/gallery`, filterable index) → Artwork detail (studio-walk prev/next) → Series rails → Who I am → Process → Commissions/Contact. Wall preview (`/preview`) is the signature feature: linked from nav, footer, home section, gallery header, and every artwork's actions.

Publication is gated by `Artwork.available` — works without a JPEG in `public/paintings/` stay catalogued but unpublished.
