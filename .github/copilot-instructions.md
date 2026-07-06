# Copilot Instructions — Harrison Ferraro Artist Portfolio

Next.js 16 App Router portfolio for Harrison Ferraro (Melbourne, figurative oil). Portfolio and enquiry only — **no pricing, no checkout, no e-commerce**. React 19, TypeScript, Tailwind CSS 3, Motion, Resend, deployed on Vercel.

## Commands

```bash
npm run dev        # Dev server with Turbopack (http://localhost:3000)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run build      # Production build
npm start          # Start production server
```

Quality gate before shipping: `npm run typecheck && npm run lint && npm run build`. There are no tests.

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16 | Framework (App Router, `experimental.viewTransition` enabled) |
| `react` / `react-dom` | 19 | UI runtime |
| `motion` | 12 | Animation (`motion/react`) |
| `resend` | 4 | Transactional email (optional — forms fall back to mailto) |
| `zod` | 3 | API route input validation |
| `tailwindcss` | 3 | Styling |

## Architecture

### Data layer

`lib/artworks.ts` is the **single source of truth** for artwork data:

- `ARTWORKS` — every catalogued work, including ones whose image is not yet in the repo
- `AVAILABLE_ARTWORKS` — works whose JPEG exists in `public/paintings/`; **every rendered surface, the sitemap, and `generateStaticParams` read from this**
- `SERIES` / `getActiveSeries()` — series copy; active = has at least one available work
- `getArtwork`, `getFeaturedArtworks`, `getSeriesWorks`, `getAdjacentArtworks`

The `Artwork.available` flag gates publication. When adding a new artwork:

1. Add the JPEG to `public/paintings/` (portrait, ≤ ~1200px wide preferred)
2. Add/enable the entry in `ARTWORKS` with `available: true`
3. Add a base64 blur placeholder in `lib/blurPlaceholders.ts` (keyed by slug)

`lib/site.ts` holds identity, positioning copy, artist statement, `PROCESS_STEPS` (single source for `/process` and `/commissions`), and social links.

### Routing (App Router)

- `/` — editorial hero, featured works, statement, wall-preview pitch, contact
- `/gallery` — server page (metadata + `ItemList` JSON-LD) rendering the client `GalleryIndex` filter island
- `/gallery/[slug]` — SSG artwork detail; sticky image, studio-walk prev/next, `VisualArtwork` + `BreadcrumbList` JSON-LD
- `/series` — server page rendering client `SeriesSection` rails
- `/who-i-am` — artist narrative (`/about` 308-redirects here via `next.config.ts`)
- `/process`, `/commissions`, `/contact` — process + enquiry (forms are client islands: `CommissionForm`, `ContactForm`)
- `/preview`, `/preview/[slug]` — camera wall preview (flagship feature; immersive route hides nav)
- `app/opengraph-image.tsx`, `app/gallery/[slug]/opengraph-image.tsx` — dynamic OG images via `next/og`
- `app/api/contact`, `app/api/commission` — Resend handlers (Zod + honeypot; 503 when email unconfigured)

### Client vs Server Components

Pages are Server Components; interactivity lives in small client islands (`GalleryIndex`, `CommissionForm`, `ContactForm`, `Nav`, `Reveal`, `HomeHero`, `SeriesSection`, `WallPreview`). Keep `metadata` exports on server pages.

### View transitions

`experimental.viewTransition` is on. `components/ArtworkTransition.tsx` wraps React's experimental `ViewTransition` and tags paintings with `artwork-<slug>` so they morph between the gallery card and detail hero. It degrades to a plain wrapper when the export/API is absent.

## Key Conventions

### Styling

Semantic classes in `app/globals.css`, Tailwind for layout/spacing.

**Buttons** — two voices only: `btn-ink` (paper-filled primary) and `btn-line` (outlined). `btn-full` is the width modifier.

**Layout/typography**: `eyebrow`, `site-shell`, `section-pad` / `section-pad-tight`, `statement-panel`, `success-box`, `divider`, `art-shell` / `art-core` (via `ArtFrame`), `grain` (via `Grain`).

### Design tokens (warm near-black + oxide)

| Token | Value | Role |
|---|---|---|
| `bg` / `bg-2` | `#080706` / `#100d0a` | Page backgrounds |
| `surface` / `surface-2` | `#15120f` / `#211a15` | Panels |
| `oxide` / `oxide-2` | `#b65d2c` / `#d1844a` | Accent / hover accent |
| `text` / `text-2` / `text-3` | `#f0e7dc` / `#b7aa9b` / `#8f8375` | Type ramp |
| `--paper` | `#f0e7dc` | Filled CTA background |
| `--blood` | `#4a1410` | Radial background accent |
| `--border` / `--border-strong` | rgba paper 0.16 / 0.32 | Hairlines |

Easings: `--ease-heavy` `cubic-bezier(0.16,1,0.3,1)`, `--ease-soft` `cubic-bezier(0.32,0.72,0,1)`.

### Typography

- `font-serif` → Cormorant Garamond — display headings, editorial lines
- `font-mono` → JetBrains Mono — UI labels, body copy, metadata

### Motion & accessibility

- Route entrance: `app/template.tsx` opacity fade only (no `.page-enter`; would double up and fight the view-transition morph)
- Scroll reveals: `components/Reveal.tsx` (Motion `whileInView`); `TextReveal` for word-group headings
- Every animated component must respect `useReducedMotion`; CSS `prefers-reduced-motion` and `.no-js` rescue blocks in `globals.css` force hidden content visible
- Forms focus the first invalid field on failed submit; shared primitives in `components/FormPrimitives.tsx`
- Modal-ish overlays (mobile More sheet) use `lib/useFocusTrap.ts`

### Images

Always use `next/image` with `placeholder="blur"` + `blurDataURL={BLUR_PLACEHOLDERS[slug]}` for paintings. `priority` only on the homepage hero and artwork-detail hero.

### Environment variables

Optional in `.env.local` (see `.env.example`):

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

Forms return 503 and offer a mailto fallback when Resend is not configured. **Never add Stripe/commerce.**

### Security headers (`next.config.ts`)

CSP (`script-src 'self' 'unsafe-inline'`, `connect-src 'self' https://api.resend.com`), `X-Frame-Options: DENY`, nosniff, long-cache for `/paintings/*`, AVIF/WebP.

### Path alias

`@/` resolves to the project root (`tsconfig.json`).
