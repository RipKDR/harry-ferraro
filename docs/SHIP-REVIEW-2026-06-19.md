# Harrison Ferraro portfolio — ship review (2026-06-19)

**Repo:** `/home/admin/harry-ferraro` → `https://github.com/RipKDR/harry-ferraro`  
**Verdict:** **SHIP WITH NOTES** — portfolio goals met; commerce removed; build gate green.

---

## Executive summary

| Area | Status |
|------|--------|
| Portfolio-first (no prices/checkout) | Pass |
| Who I am / editorial IA | Pass |
| Motion + B-pass visual system | Pass |
| Wall preview (camera overlay) | Pass (needs HTTPS + real device for full QA) |
| Forms + honeypot + Zod | Pass (Resend requires env on Vercel) |
| Security (CSP, no Stripe in app) | Pass after CSP cleanup |
| Build (`typecheck` / `lint` / `build`) | Pass |
| README accuracy | Fail → updated in this ship |

---

## Requirements trace (intent doc)

From `docs/intent/harrison-portfolio.md`:

- **B** creative/motion before deploy — implemented (`HomeHero`, `Reveal`, `template`, marquee, frames).
- No public pricing / checkout — `PurchaseModal`, `/api/checkout` removed; copy aligned.
- Professional, non-generic gallery — editorial typography, grain, oxide accent, real paintings hero.
- Enquiry-only commissions — `/commissions`, `/contact` APIs.

---

## Code review (multi-axis)

### Blockers (fixed pre-push)

1. **CSP still allowed Stripe** while checkout was deleted — tightened in `next.config.ts`.
2. **Stale prod preview on port 3012** — old `next start` without `/preview` routes; redeploy fixes.

### Non-blockers (post-ship backlog)

| ID | Severity | Finding |
|----|----------|---------|
| N1 | Medium | `README.md` described splash, purchase modal, Framer Motion “ready to add”, Stripe checklist — **stale** (README rewritten on ship). |
| N2 | Low | Artwork `dimensions` / `medium` / `year` mostly `null` — meta rows thin on detail pages. |
| N3 | Low | Wall preview scale is heuristic (not AR plane lock) — disclaimer present. |
| N4 | Low | `eslint` 1 warning on `WallPreview` ref cleanup — addressed. |
| N5 | Info | `about` redirects or duplicates `who-i-am` — confirm redirect in `app/about` if both exist. |

### Security / privacy

- No secrets in repo; `.env` gitignored.
- Forms: server validation; honeypot fields.
- Camera: browser permission only on `/preview/*`; no upload of video to server.

---

## Verification evidence

```bash
npm run typecheck   # exit 0
npm run lint        # exit 0 (after WallPreview fix)
npm run build       # exit 0, 29 routes including /preview + /preview/[slug]
```

Route smoke (fresh `next start` required after build):

- `/`, `/gallery`, `/who-i-am`, `/preview`, `/commissions`, `/contact`, `/process`, `/series` → expect **200**.

---

## Deploy checklist (Vercel)

- [ ] `RESEND_API_KEY` (and `CONTACT_TO` / from domain if used) in project env
- [ ] `NEXT_PUBLIC_SITE_URL` or `lib/site.ts` canonical matches production host
- [ ] Git push `main` → Vercel production deploy
- [ ] Post-deploy: open `/preview/ignition-i` on **phone** over HTTPS, allow camera

---

## Sign-off

**SHIP WITH NOTES** — suitable for production portfolio launch. Follow-up: real dimensions on artworks, optional WebXR later, analytics when ready.