# Copilot Instructions — Harry Ferraro Fine Art Portfolio

Next.js 16 App Router portfolio site with Stripe checkout, Resend email, and a static artwork catalogue. React 19, TypeScript, Tailwind CSS 3, deployed on Vercel.

## Commands

```bash
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint via next lint
npm start         # Start production server
```

There are no tests.

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16 | Framework (App Router) |
| `react` / `react-dom` | 19 | UI runtime |
| `stripe` | 20 | Server-side Stripe SDK |
| `resend` | 4 | Transactional email |
| `framer-motion` | 11 | Animation (used selectively) |
| `zod` | 3 | API route input validation |
| `clsx` + `tailwind-merge` | — | Conditional class merging |

## Architecture

### Data layer
`lib/artworks.ts` is the **single source of truth** for all artwork data. It exports:
- `ARTWORKS` — array of `Artwork` objects
- `SERIES` — record mapping `SeriesName` to description and accent hex colour

The `Artwork` type shape:
```ts
type Artwork = {
  id: number; slug: string; title: string; year: number
  medium: string; dimensions: string; series: SeriesName
  price: number; status: 'available' | 'sold'
  statement: string; filename: string
}
```

When adding a new artwork:
1. Add the image to `public/paintings/` (JPEG, 600–1200px wide, < 500 KB)
2. Add an entry to `ARTWORKS` in `lib/artworks.ts`
3. Add the base64 blur placeholder to `lib/blurPlaceholders.ts` (keyed by `slug`)

`SeriesName` is a union type: `'Fire' | 'Wind' | 'Portraits' | 'Colour Studies'` — extend this union and add an entry to `SERIES` when adding a new series.

### Routing (App Router)
- `app/page.tsx` — Home (splash + hero + featured works)
- `app/gallery/page.tsx` — Masonry gallery with filter system
- `app/gallery/[slug]/page.tsx` — Individual artwork detail page (statically generated via `generateStaticParams`)
- `app/series/page.tsx` — Browse by series
- `app/about/page.tsx` — Artist bio
- `app/process/page.tsx` — Process / approach
- `app/commissions/page.tsx` — Commission intake
- `app/contact/page.tsx` — Contact form
- `app/api/checkout/route.ts` — Stripe Checkout session creation
- `app/api/contact/route.ts` — Resend email handler for contact form
- `app/api/commission/route.ts` — Resend email handler for commission intake

Gallery detail pages are fully static (`generateStaticParams` + `generateMetadata` both read from `ARTWORKS`).

### Client vs Server Components
Pages and most layout components are Server Components. Use `'use client'` only when the component needs state, effects, or event handlers. `ArtworkActions` is the canonical example — it wraps `PurchaseModal` and `InquireModal` so the parent detail page stays a Server Component.

### Components
| Component | Type | Purpose |
|---|---|---|
| `ArtworkActions` | Client | Purchase / Inquire buttons + modal state |
| `PurchaseModal` | Client | Stripe checkout modal |
| `InquireModal` | Client | Artwork inquiry form modal |
| `Lightbox` | Client | Full-screen image viewer |
| `Cursor` | Client | Custom cursor (hidden on touch devices) |
| `MobileNav` | Client | Hamburger nav for small screens |
| `Nav` | Server | Primary navigation bar |
| `Footer` | Server | Site footer |
| `Reveal` | Client | IntersectionObserver fade-up wrapper |
| `Grain` | Server | Fixed SVG film-grain overlay |
| `Marquee` | Server | Infinite scrolling text ticker |
| `StatCounter` | Client | Animated number counter |

### API route validation
All API routes validate request bodies with `zod` before processing. Keep schemas colocated in the route file.

### Environment variables
Required in `.env.local`:
```
RESEND_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://harryferraro.com.au
```
`NEXT_PUBLIC_SITE_URL` is used in OG image generation and Stripe redirect URLs.

### Security headers & image config (`next.config.ts`)
- CSP locks scripts to `'self'` + `js.stripe.com`; fonts to `'self'`
- `images.formats` → `['image/avif', 'image/webp']`
- `/paintings/:path*` served with `Cache-Control: public, max-age=31536000, immutable`
- `experimental.optimizeCss: true` (critters)

---

## Key Conventions

### Class merging utility
Use `clsx` + `tailwind-merge` together when building dynamic class strings:
```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(...inputs))
```

### Styling
Styling is split between `app/globals.css` (semantic component classes) and Tailwind utility classes. Prefer the existing semantic classes for UI components and Tailwind for layout/spacing.

**Buttons**
| Class | Purpose |
|---|---|
| `btn-ember` | Primary filled ember-orange button |
| `btn-ghost` | Outlined ghost button |
| `btn-full` | Full-width modifier (apply alongside `btn-ember` or `btn-ghost`) |

**Badges**
| Class | Purpose |
|---|---|
| `badge-available` | Green "Available" status pill |
| `badge-sold` | Muted "Sold" status pill |

**Cards**
| Class | Purpose |
|---|---|
| `gallery-card` | Masonry card with hover image scale + overlay |
| `gallery-card-info` | Title/price block inside `gallery-card` (slides up on hover) |
| `feat-card` | Featured artwork card (home page) |
| `feat-card-overlay` / `feat-card-info` | Overlay + info block inside `feat-card` |
| `series-card` | Series browse card |

**Forms**
| Class | Purpose |
|---|---|
| `form-input` | Text input / textarea / select — ember focus ring |
| `form-label` | Field label |
| `form-error` | Inline validation error (red, mono, 11px) |

**Layout & typography**
| Class | Purpose |
|---|---|
| `eyebrow` | Small uppercase label with leading ember line (`::before`) |
| `info-row` / `info-key` / `info-val` | Key-value table rows (artwork detail page) |
| `modal-backdrop` / `modal-sheet` | Modal overlay + sliding panel |
| `reveal` | Scroll-triggered fade-up — adds `visible` class via IntersectionObserver |
| `page-enter` | Page entrance animation (wrap top-level page `<div>`) |
| `divider` | 1px horizontal rule |
| `grain` | Fixed SVG noise overlay (rendered by `<Grain />`) |

### Design tokens
Brand colours are defined in both CSS variables (`:root`) and `tailwind.config.ts`. Always use the named token rather than a raw hex:

| Token | Value | Role |
|---|---|---|
| `ember` | `#c8570a` | Primary accent / CTA |
| `ember-2` | `#e06a18` | Hover state for ember buttons |
| `ember-3` | `#7a3408` | Scrollbar thumb, deep ember tint |
| `bg` | `#15131c` | Page background |
| `bg-2` | `#1c1a24` | Secondary background |
| `surface` | `#22202c` | Card / panel surface |
| `surface-2` | `#2b2836` | Elevated surface |
| `text` | `#f2ede5` | Primary text |
| `text-2` | `#b0a9bc` | Secondary text |
| `text-3` | `#7c768a` | Tertiary / placeholder text |
| `border` | `#38354a` | Default border |
| `border-2` | `#48455a` | Elevated border |

CSS easing variables (use in inline styles or custom CSS, not available as Tailwind utilities):
- `--ease-out-expo` → `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-in-out` → `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- `--transition-base` → `0.25s var(--ease-in-out)`

Tailwind easing utilities (via `tailwind.config.ts`):
- `ease-out-expo` — fast out, great for entrances
- `ease-in-out` — smooth both ends

### Tailwind animation classes
Pre-defined keyframe animations available as Tailwind utilities:

| Class | Description |
|---|---|
| `animate-hero-zoom` | Slow scale 1.06→1 (hero image kenburns) |
| `animate-fade-up` | Opacity + translateY entrance (1.5s) |
| `animate-scroll-pulse` | Opacity pulse for scroll indicator |
| `animate-marquee` / `animate-marquee-2` | Infinite ticker scroll (offset by half) |
| `animate-grain` | SVG noise position jitter |
| `animate-page-in` | Page entrance (0.55s) |
| `animate-scale-in` | Scale + opacity entrance (0.4s) |
| `animate-slide-right` | Slide in from left |
| `animate-fade-in` | Simple opacity fade (0.3s) |

### Typography
- `font-serif` → Cormorant Garamond — headings, prices, display text, artist statements
- `font-mono` → JetBrains Mono — UI labels, navigation, metadata, buttons, form fields

### Path alias
`@/` resolves to the project root (configured in `tsconfig.json`).

### Scroll animations
Wrap sections in `<Reveal>` (from `components/Reveal.tsx`) for IntersectionObserver-driven fade-up. Fires once at 8% visibility then unobserves.
- `delay` prop — transition delay in seconds
- `as` prop — changes the rendered HTML element (default: `div`)
- Internally applies the `reveal` CSS class; adds `visible` when intersecting

### Modals
Modals trap focus using `lib/useFocusTrap.ts`. Any new modal must use this hook and toggle `document.body.classList` with `modal-open` to prevent scroll.

### Stripe currency
Prices in `ARTWORKS` are stored as whole-dollar integers (AUD). The checkout route multiplies by 100 for Stripe's minor-unit format. Currency is hardcoded to `'aud'`.
