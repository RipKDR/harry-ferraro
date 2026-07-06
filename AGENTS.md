# AGENTS.md

Harrison Ferraro artist portfolio — Next.js 16 App Router, React 19, TypeScript, Tailwind v3, deployed on Vercel. Portfolio and enquiry only; no pricing, checkout, or e-commerce.

See `.github/copilot-instructions.md` for architecture, conventions, and the full data-layer/routing map. Standard commands live in `README.md` and `package.json` scripts.

## Cursor Cloud specific instructions

- **Type of app:** Statically-generated portfolio site. There is **no database, no auth, and no test suite** — do not look for test commands; the quality gate is `npm run typecheck && npm run lint && npm run build`.
- **Run the dev server** with `npm run dev` (Next.js + Turbopack) on `http://localhost:3000`. Use the production build/start (`npm run build` / `npm start`) only when verifying prerendering.
- **Email is optional.** The contact/commission API routes (`app/api/contact`, `app/api/commission`) return **HTTP 503 with a `mailto` fallback when `RESEND_API_KEY` is unset** — this is expected behavior, not a bug. The forms surface an amber "Email delivery is not configured yet" notice plus a mailto button. To exercise real delivery you'd need a Resend key in `.env.local` (see `.env.example`); it is not required for local development.
- **Only artworks with `available: true` AND a JPEG in `public/paintings/` render.** Currently only three works publish (`ignition-i`, `ignition-ii`, `crimson-study`); the four `available: false` catalogued works intentionally do not appear in the gallery, sitemap, or static params. `lib/artworks.ts` is the single source of truth.
- The **wall preview** (`/preview`) uses the device camera; it works on `localhost` (secure context) but needs HTTPS in production.
