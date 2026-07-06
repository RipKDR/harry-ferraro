export type Artwork = {
  slug: string
  title: string
  image: string
  alt: string
  year: number | null
  medium: string | null
  dimensions: string | null
  series: SeriesName
  description: string
  featured: boolean
  /**
   * Whether the painting's JPEG is present in `public/paintings/`.
   * Entries with `available: false` stay in the data (title, copy, series)
   * but are hidden from every rendered surface, the sitemap, and static
   * params until the image file lands — drop the JPEG in and flip this on.
   */
  available: boolean
}

export type SeriesName = 'Figure studies' | 'Fire and smoke' | 'Colour rupture' | 'Movement studies'

export const ARTWORKS: Artwork[] = [
  {
    slug: 'ignition-i',
    title: 'Ignition I',
    image: '/paintings/ignition-i.jpg',
    alt: 'A figurative painting showing a woman holding a lit cigarette in a dark studio setting.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Fire and smoke',
    description: 'A charged portrait built around smoke, shadow, and the small violence of a flame.',
    featured: true,
    available: true,
  },
  {
    slug: 'ignition-ii',
    title: 'Ignition II',
    image: '/paintings/ignition-ii.jpg',
    alt: 'An expressive portrait of a woman lit by the orange glow of a cigarette, surrounded by dark brushwork.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Fire and smoke',
    description: 'A portrait where light does the speaking. The figure sits between control and collapse, with the flame holding the centre of the painting.',
    featured: true,
    available: true,
  },
  {
    slug: 'crimson-study',
    title: 'Crimson Study',
    image: '/paintings/crimson-study.jpg',
    alt: 'A crimson-toned expressive portrait with loose red and black marks around the figure.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Figure studies',
    description: 'A red, unsettled figure study. The work leans into pressure, gaze, and the feeling of being seen before you are ready.',
    featured: true,
    available: true,
  },
  // The four works below are catalogued but their photographs are not yet in
  // `public/paintings/`. They stay `available: false` so no page ships a
  // broken image. Add the JPEG and set `available: true` to publish.
  {
    slug: 'ascendant',
    title: 'Ascendant',
    image: '/paintings/ascendant.jpg',
    alt: 'A black, white, and teal portrait of a woman looking upward with wind-like brushwork around her hair.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A lifted face, loose marks, and weather moving through the body.',
    featured: true,
    available: false,
  },
  {
    slug: 'tempest',
    title: 'Tempest',
    image: '/paintings/tempest.jpg',
    alt: 'A dark expressive portrait with windblown hair and rough gestural mark-making.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A figure caught in motion. Hair, posture, and marks pull the work toward storm rather than stillness.',
    featured: true,
    available: false,
  },
  {
    slug: 'radiance',
    title: 'Radiance',
    image: '/paintings/radiance.jpg',
    alt: 'A bright expressive portrait with blue and black gestural marks around a smiling figure.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A lighter work without losing weight. It carries movement, softness, and a release of pressure.',
    featured: false,
    available: false,
  },
  {
    slug: 'dissolution',
    title: 'Dissolution',
    image: '/paintings/dissolution.jpg',
    alt: 'A colourful vertical face study with yellow, green, red, and blue paint marks.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Colour rupture',
    description: 'A colour-heavy face study. The image feels fractured, bright, and uncomfortable in the right way.',
    featured: false,
    available: false,
  },
]

export const AVAILABLE_ARTWORKS: Artwork[] = ARTWORKS.filter((artwork) => artwork.available)

export const SERIES: Record<SeriesName, { description: string }> = {
  'Figure studies': {
    description: 'Faces and bodies held close enough for expression, posture, and gaze to do the work.',
  },
  'Fire and smoke': {
    description: 'Paintings built around ignition, breath, smoke, and the charged second before a room changes.',
  },
  'Colour rupture': {
    description: 'Colour-forward studies where the palette becomes the pressure point.',
  },
  'Movement studies': {
    description: 'Figures shaped by wind, motion, loosened brushwork, and a body refusing stillness.',
  },
}

/** Series that currently have at least one published (available) work. */
export function getActiveSeries(): Array<[SeriesName, { description: string }]> {
  return (Object.entries(SERIES) as Array<[SeriesName, { description: string }]>).filter(
    ([name]) => AVAILABLE_ARTWORKS.some((artwork) => artwork.series === name),
  )
}

export function getArtwork(slug: string) {
  return AVAILABLE_ARTWORKS.find((artwork) => artwork.slug === slug)
}

export function getFeaturedArtworks() {
  return AVAILABLE_ARTWORKS.filter((artwork) => artwork.featured)
}

export function getSeriesWorks(name: SeriesName) {
  return AVAILABLE_ARTWORKS.filter((artwork) => artwork.series === name)
}

/** Previous/next published works relative to `slug`, wrapping at each end. */
export function getAdjacentArtworks(slug: string) {
  const index = AVAILABLE_ARTWORKS.findIndex((artwork) => artwork.slug === slug)
  if (index === -1) return null
  const count = AVAILABLE_ARTWORKS.length
  return {
    previous: AVAILABLE_ARTWORKS[(index - 1 + count) % count],
    next: AVAILABLE_ARTWORKS[(index + 1) % count],
  }
}

export function formatArtworkMeta(value: string | number | null) {
  return value === null || value === '' ? null : String(value)
}
