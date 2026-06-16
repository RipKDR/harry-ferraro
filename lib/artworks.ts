/**
 * ⚠️ PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
 *
 * The artworks below (images, titles, years, mediums, dimensions, statements,
 * series) are temporary placeholders so the site is fully functional. They are
 * NOT Harrison's real catalogue. Swap in real work + details, then delete this
 * notice. See CONTENT-CHECKLIST.md for exactly what to provide.
 *
 * Pricing is intentionally omitted — every piece shows "Enquire for price".
 * Add a `price` to an entry only when you have a real number to publish.
 */

export type Artwork = {
  id: number
  slug: string
  title: string
  year: number
  medium: string
  dimensions: string
  series: SeriesName
  /** Optional. Leave undefined to show "Enquire for price". Value in AUD. */
  price?: number
  status: 'available' | 'sold'
  statement: string
  filename: string
  featured?: boolean
}

export type SeriesName = 'Fire' | 'Wind' | 'Portraits' | 'Colour Studies'

/**
 * Availability label for an artwork. Showcase-first: shows status, not a
 * sales pitch. A price only appears if Harrison chooses to publish one.
 */
export function priceLabel(art: Artwork): string {
  if (art.status === 'sold') return 'Sold'
  if (typeof art.price === 'number') {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(art.price)
  }
  return 'Available'
}

export const ARTWORKS: Artwork[] = [
  {
    id: 1, slug: 'ignition-ii', title: 'Ignition II', year: 2024,
    medium: 'Oil & mixed media on canvas', dimensions: '80 × 110 cm',
    series: 'Fire', status: 'available', featured: true,
    statement: 'The cigarette is not about smoking. It is about the moment before — the held breath, the struck match, the decision to burn. She does not light it for comfort. She lights it to remember she can.',
    filename: 'ignition-ii.jpg',
  },
  {
    id: 2, slug: 'ignition-i', title: 'Ignition I', year: 2024,
    medium: 'Oil on canvas', dimensions: '70 × 100 cm',
    series: 'Fire', status: 'available', featured: true,
    statement: 'The flame throws orange across grey like a scream in a quiet room. Everything around her is ash and texture. She is the only warm thing. The cross at her throat — not religion. Armour.',
    filename: 'ignition-i.jpg',
  },
  {
    id: 3, slug: 'crimson-study', title: 'Crimson Study', year: 2024,
    medium: 'Acrylic & ink on canvas', dimensions: '60 × 90 cm',
    series: 'Portraits', status: 'available', featured: true,
    statement: 'Red has always been the loudest silence. She looks back at something just outside the frame that only she can see. The splatter is not chaos. It is punctuation.',
    filename: 'crimson-study.jpg',
  },
  {
    id: 4, slug: 'ascendant', title: 'Ascendant', year: 2023,
    medium: 'Acrylic on canvas', dimensions: '60 × 90 cm',
    series: 'Wind', status: 'available', featured: true,
    statement: 'Looking up when the world presses down. The teal bleeds in like memory — specific, unavoidable. Joy as resistance. The brushstrokes are intentionally loose because control would betray her.',
    filename: 'ascendant.jpg',
  },
  {
    id: 5, slug: 'tempest', title: 'Tempest', year: 2023,
    medium: 'Watercolour & ink on board', dimensions: '50 × 75 cm',
    series: 'Wind', status: 'available', featured: true,
    statement: 'Black ink over sepia. Hair moving like it remembers being storm. She is not looking at you. She is deciding.',
    filename: 'tempest.jpg',
  },
  {
    id: 6, slug: 'dissolution', title: 'Dissolution', year: 2023,
    medium: 'Oil on canvas', dimensions: '70 × 100 cm',
    series: 'Colour Studies', status: 'sold',
    statement: 'Yellow is not cheerful. Grief and colour cannot be separated — they bleed into the same drain. One eye visible. One tear.',
    filename: 'dissolution.jpg',
  },
  {
    id: 7, slug: 'radiance', title: 'Radiance', year: 2024,
    medium: 'Oil on canvas', dimensions: '80 × 110 cm',
    series: 'Wind', status: 'sold',
    statement: 'Joy painted with the same weight as grief, because they are the same weight. The brushwork loosens at the edges — she is becoming movement, becoming weather.',
    filename: 'radiance.jpg',
  },
]

export const SERIES: Record<SeriesName, { desc: string; accent: string }> = {
  Fire: {
    desc: 'Portraits lit from within. Fire as biography — not destruction, but illumination. The flame is a mirror held at exactly the right angle.',
    accent: '#c8570a',
  },
  Wind: {
    desc: 'Movement as emotion. These paintings explore freedom and its cost — the moment the body stops performing composure and becomes weather.',
    accent: '#1a7a8a',
  },
  Portraits: {
    desc: 'The face as landscape. Ink bleeds into paint the same way identity bleeds into expectation. These are not likenesses. They are states.',
    accent: '#8a1a2a',
  },
  'Colour Studies': {
    desc: 'Grief in palette form. Colour is not decoration here — it is the thing being felt. Yellow is not cheerful. Teal is not calm.',
    accent: '#4a7a3a',
  },
}
