# Harry Ferraro — artist portfolio

Next.js App Router site for **Harrison Ferraro** (Melbourne, figurative oil). Portfolio and enquiry — not a shop.

## Stack

- **Next.js 16** — App Router, TypeScript, static generation
- **Motion** — hero choreography and scroll reveals
- **Tailwind CSS v3**
- **Resend** — optional email for contact / commission APIs
- **Vercel** — hosting

## Features

- Editorial home hero, work index, series, process
- **Who I am** — portfolio narrative (`/about` redirects here)
- **Wall preview** — phone camera + drag/pinch placement (`/preview`, `/preview/[slug]`), linked from nav, footer, and home
- **View transitions** — paintings morph from the gallery index into the detail hero (React `ViewTransition`, graceful fallback)
- Commission & contact forms (Zod + honeypot, mailto fallback)
- Per-page metadata, dynamic OG images, JSON-LD (`Person`, `VisualArtwork`, `ItemList`, `BreadcrumbList`, `ProfilePage`), sitemap, security headers (CSP)

No public prices, Stripe, or checkout.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Wall preview needs HTTPS in production (or localhost for dev).

## Quality gate

```bash
npm run typecheck && npm run lint && npm run build
```

## Deploy (Vercel)

1. Push to `main` on GitHub (`RipKDR/harry-ferraro`).
2. Import repo on [vercel.com/new](https://vercel.com/new) or use existing project.
3. Set environment variables: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` (see `.env.example`).
4. Deploy. Confirm `lib/site.ts` `siteUrl` matches your production domain.

## Adding paintings

1. Add JPEG to `public/paintings/`.
2. Add (or enable) the entry in `lib/artworks.ts` with `available: true` — works without their image on disk stay catalogued but unpublished.
3. Add a blur placeholder in `lib/blurPlaceholders.ts` (keyed by slug).
4. Rebuild — static paths regenerate for gallery and preview.

Four catalogued works (`ascendant`, `tempest`, `radiance`, `dissolution`) are currently `available: false` awaiting their image files.

## Docs

- `docs/intent/harrison-portfolio.md` — creative brief (fork B)
- `docs/intent/motion-stack.md` — animation choices
- `docs/SHIP-REVIEW-2026-06-19.md` — pre-ship review