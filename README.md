# Harrison Ferraro — Fine Art Portfolio

A showcase-first portfolio for visual artist **Harrison Ferraro**. Dark,
restrained, gallery-quality. Built to put the work first, make it easy to
browse, and let people enquire about pieces or commissions — without any
pushy "buy now" commerce.

> ⚠️ The artwork and some copy are **placeholders**. See
> [`CONTENT-CHECKLIST.md`](./CONTENT-CHECKLIST.md) for exactly what to replace.

## Stack

- **Next.js 16** (App Router, React 19, Server Components)
- **TypeScript** throughout
- **Tailwind CSS v3** + a small set of hand-written CSS tokens
- **next/image** — AVIF/WebP, responsive, blur-up placeholders
- **Resend** for form email (optional — graceful fallback if unset)
- **Zod** for server-side validation
- Dynamic Open Graph image via `next/og` (no static asset to maintain)

No animation libraries, no analytics SDKs, no payment SDKs. Everything is
plain React + CSS.

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero, featured works, series, commission CTA |
| `/gallery` | Filterable grid (Available / by series) + lightbox |
| `/gallery/[slug]` | Individual artwork detail + related works |
| `/series` | Browse work grouped by series |
| `/process` | Studio practice (placeholder copy) |
| `/about` | Artist bio + social links (placeholder copy) |
| `/commissions` | Full commission enquiry form |
| `/contact` | General enquiry form + contact details |

## Single source of truth

- **Identity, email, location, social links:** [`lib/site.ts`](./lib/site.ts)
- **Artwork data:** [`lib/artworks.ts`](./lib/artworks.ts)

Edit those two files for almost any content change.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for SEO/OG. Falls back to the Vercel URL. |
| `RESEND_API_KEY` | for live email | Free at [resend.com](https://resend.com). Without it, forms validate + show success but send nothing. |
| `CONTACT_FROM` | optional | Sender address. Defaults to `onboarding@resend.dev` (works for testing). Use a verified domain in production. |

Form submissions are delivered to the email set in `lib/site.ts`
(`hferraro1999@gmail.com`).

## Forms

Both the contact and commission forms:

- validate on the client **and** server (Zod),
- include a hidden honeypot field for spam,
- show explicit success **and** error states (no silent failures),
- fall back to a `mailto:` link if email delivery fails,
- the commission form accepts an optional reference image (≤ 4 MB), sent as an
  email attachment.

## Deploy to Vercel

This repo is already linked to Vercel. Pushing the branch creates a preview
deployment automatically; merging to `main` promotes to production.

Manual deploy:

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

Set `RESEND_API_KEY`, `CONTACT_FROM`, and `NEXT_PUBLIC_SITE_URL` in
**Vercel → Project → Settings → Environment Variables**.

## Accessibility & SEO

- Semantic HTML, skip-to-content link, keyboard-navigable nav + lightbox,
  focus-visible outlines, `prefers-reduced-motion` support.
- Per-page metadata, Open Graph + Twitter cards, JSON-LD (`VisualArtist`),
  sitemap (incl. artwork pages) and robots.
- Alt text derived from artwork title/medium.
