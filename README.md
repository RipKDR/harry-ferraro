# Harry Ferraro — Fine Art Portfolio

Production-ready Next.js 15 portfolio website. Deployable to Vercel in < 5 minutes.

## Stack

- **Next.js 15** — App Router, TypeScript, Server Components
- **Tailwind CSS v3** — utility styling
- **Framer Motion** — scroll animations, page transitions (ready to add)
- **next/image** — automatic WebP/AVIF optimization, responsive srcsets
- **Google Fonts** — Cormorant Garant + JetBrains Mono

## Features

- Animated splash screen
- Full-screen hero with parallax-style zoom
- Masonry gallery with filter system
- Lightbox with keyboard navigation (← → Esc)
- Purchase intent modal + Inquiry modal
- Animated stat counters (IntersectionObserver)
- Scroll-triggered reveal animations
- Custom cursor with lerp smoothing
- Grain texture overlay
- Marquee ticker
- Series page (browse by series)
- Process / Studio page (5-step breakdown)
- About page
- Commissions intake form
- Contact form
- Mobile-first responsive design
- Bottom mobile navigation
- SEO metadata + OpenGraph + Twitter cards
- AVIF/WebP image optimization

## Quick Deploy to Vercel

### Option 1: Vercel CLI (fastest)

```bash
npm install -g vercel
cd harry-ferraro
npm install
vercel
```

### Option 2: GitHub → Vercel (recommended for ongoing updates)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Vercel auto-detects Next.js — click Deploy
5. Done. ~60 seconds.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customisation Checklist

- [ ] Replace `@harryferraroart` in `app/contact/page.tsx` with real Instagram handle
- [ ] Add real Instagram URL in `components/Footer.tsx`
- [ ] Add `public/og-image.jpg` (1200×630px) for social sharing previews
- [ ] Update `harryferraro.com` URL in `app/layout.tsx` metadata
- [ ] When ready for real payments: integrate Stripe Checkout via `/api/checkout/route.ts`
- [ ] For contact forms that actually send emails: add Resend or Nodemailer to the form handlers
- [ ] Add more paintings to `public/paintings/` and update `lib/artworks.ts`

## Adding New Paintings

1. Add the image file to `public/paintings/` (JPEG, 600–1200px wide, < 500KB)
2. Add a new entry to `lib/artworks.ts`:

```ts
{
  id: 8,
  slug: 'new-painting',
  title: 'New Painting',
  year: 2025,
  medium: 'Oil on canvas',
  dimensions: '70 × 100 cm',
  series: 'Fire', // Fire | Wind | Portraits | Colour Studies
  price: 3500,
  status: 'available', // available | sold
  statement: 'The statement about this work.',
  filename: 'new-painting.jpg',
  aspectRatio: '600/900',
}
```

## Email Integration (Production)

Install Resend:
```bash
npm install resend
```

Then create `app/api/contact/route.ts`:
```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  await resend.emails.send({
    from: 'noreply@harryferraro.com',
    to: 'Harrisonferraro99@gmail.com',
    subject: `Contact from ${name}`,
    text: message,
    replyTo: email,
  })
  return Response.json({ ok: true })
}
```

Add `RESEND_API_KEY` to your Vercel environment variables.

## Performance

- Images: AVIF/WebP via next/image, lazy-loaded below fold
- Fonts: preconnect + display=swap, no layout shift
- Hero image: priority loaded, no LCP penalty
- CSS: minimal, no unused Tailwind via content scanning
- No client-side routing overhead beyond what Next.js provides
