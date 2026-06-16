# Content checklist — what Harrison needs to provide

The site is fully built and working, but the **artwork and some copy are
placeholders**. None of it is real catalogue data. Replace the items below and
the site is launch-ready. Nothing here requires touching the layout or code
structure — almost everything lives in two files.

> Why placeholders? Your Instagram and Facebook posts are behind login and
> can't be pulled automatically. I created clean, clearly-marked placeholders so
> the site is functional today. Swap in the real material when you have it.

---

## 1. Artwork (highest priority) — `lib/artworks.ts`

The 7 paintings currently shown are **placeholder images and invented
details**. For each real piece you want online, provide:

| Field | Example | Required? |
|---|---|---|
| Image file | `public/paintings/your-piece.jpg` (JPG, ~1000–1600px wide, < 600KB) | ✅ |
| `title` | "Ignition II" | ✅ |
| `year` | 2024 | ✅ |
| `medium` | "Oil & mixed media on canvas" | ✅ |
| `dimensions` | "80 × 110 cm" | ✅ |
| `series` | One of: Fire · Wind · Portraits · Colour Studies (or tell me new ones) | ✅ |
| `status` | `available` or `sold` | ✅ |
| `statement` | 1–3 sentences in your own voice | optional but recommended |
| `price` | Only if you want a price shown publicly. Leave out for "Available" | optional |
| `featured` | `true` to surface it on the homepage | optional |

**How to add one:** drop the image in `public/paintings/`, then add an entry to
the `ARTWORKS` array in `lib/artworks.ts` (copy an existing block). Delete the
placeholder entries you don't want. Then remove the ⚠️ notice at the top of that
file.

> Note: blur-up placeholders in `lib/blurPlaceholders.ts` are keyed by `slug`.
> If a new image has no entry there it still works (it just won't blur-up). I can
> regenerate these for your real images on request.

## 2. Series descriptions — `lib/artworks.ts` (`SERIES`)

The four series and their descriptions are placeholders. Confirm the series
names you actually use and tweak the one-line descriptions, or send me yours.

## 3. About copy — `app/about/page.tsx`

The bio and the opening quote are written in a plausible voice but are **not
your words**. Replace with your own. Keep it short and honest.

## 4. Process / studio page — `app/process/page.tsx`

The five-step studio breakdown is placeholder copy. Rewrite in your voice, or
tell me to remove this page if you'd rather not have it.

## 5. Confirm the facts I assumed

- **Name shown:** "Harrison Ferraro" (with `@just_harry_fkn_ferraro` as the
  social handle). Change in `lib/site.ts` if you prefer.
- **Location:** Melbourne, Australia. ← confirm or change in `lib/site.ts`.
- **Contact email:** `hferraro1999@gmail.com` (where form submissions go).
- **Social links:** Instagram + Facebook links you gave me are wired in. Verify
  they open the right pages.

## 6. Optional polish

- A real domain (e.g. `harrisonferraro.com`). Add it in Vercel + set
  `NEXT_PUBLIC_SITE_URL`. The OG preview image is generated automatically.
- A short studio/portrait photo for the About page if you'd like a real one
  instead of a darkened painting.

---

When 1–5 are done, you have a real, launch-ready portfolio. Send me the images
+ details and I can wire them in for you.
