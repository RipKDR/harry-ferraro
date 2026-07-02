# Harry Ferraro Studio — Design Spec

## Design Philosophy
Dark, editorial, cinematic artist portfolio. The painting always leads: interfaces stay quiet,
type does the heavy lifting, and every artwork is shown uncropped wherever it is the subject.
No public pricing, no checkout — the site is a portfolio and a studio door.

## Color System (tokens in `app/globals.css`)
| Token | Value | Usage |
|-------|-------|-------|
| --bg | #080706 | Deepest background |
| --bg-2 | #100d0a | Secondary background |
| --surface | #15120f | Panels |
| --surface-2 | #211a15 | Elevated surfaces |
| --paper / --text | #f0e7dc | Primary text, ink buttons |
| --text-2 | #b7aa9b | Secondary text |
| --text-3 | #8f8375 | Tertiary / muted |
| --border | rgba(234,225,213,.16) | Hairlines |
| --border-strong | rgba(234,225,213,.32) | Active hairlines |
| --oxide | #b65d2c | Primary accent |
| --oxide-2 | #d1844a | Hover accent |
| --blood | #4a1410 | Ambient radial glow only |

## Typography
- **Cormorant Garamond** (display/serif) — 300–600, normal + italic, self-hosted via `next/font/local` from `public/fonts/`
- **JetBrains Mono** (utility/body) — 300–500, self-hosted
- Display sizes are fluid `clamp()` values set per component; headings default to weight 300
- Eyebrow/caption pattern: mono, uppercase, letter-spacing 0.18–0.32em

## Motion
- Library: `motion/react` for hero choreography, page transitions, form shake; CSS transitions elsewhere
- Eases: `--ease-heavy: cubic-bezier(0.16,1,0.3,1)`, `--ease-soft: cubic-bezier(0.32,0.72,0,1)`
- `Reveal` (IntersectionObserver + CSS) for scroll reveals; `TextReveal` for word-group reveals
- Every animation respects `prefers-reduced-motion`; a `.no-js` fallback keeps content visible without JS

## Core Components
- `HomeHero` — parallax/Ken Burns hero with staggered title
- `ArtFrame` — double-hairline painting frame
- `ArtworkStage` — detail-page stage: uncropped `object-contain` canvas over a blurred ambient
  copy of itself; opens `Lightbox`
- `Lightbox` — full-screen viewer (focus-trapped dialog, Esc/arrow keys)
- `Reveal` / `TextReveal` — scroll reveals
- `PracticeMarquee` — dual-direction serif marquee
- `Nav` — desktop top bar + mobile bottom bar; `Footer` — oversized serif statement + links
- `WallPreview` — camera/drag wall preview (`/preview`)
- `Grain` / `Vignette` — fixed texture overlays

## Imagery Rules
- Artwork data lives in `lib/artworks.ts` (slug, intrinsic `imageWidth`/`imageHeight`, series, copy)
- Blur placeholders in `lib/blurPlaceholders.ts`, applied via `blurProps(slug)`
- Grids may crop (`object-cover` + tonal filters); artwork detail and lightbox never crop
- Only confirmed facts are shown — year/medium/dimensions render only when set

## Pages
- `/` home — hero, marquee, selected paintings, statement, studio contact, full-bleed closer
- `/gallery` — filterable masonry index; `/gallery/[slug]` — sticky uncropped stage + info column
- `/series` — sticky series titles with horizontal scroll rails
- `/who-i-am` (alias `/about`) — narrative, statement, principles
- `/process` — five commission steps
- `/commissions` — enquiry form + FAQ accordion; `/contact` — direct email + short form
- `/preview`, `/preview/[slug]` — wall preview
