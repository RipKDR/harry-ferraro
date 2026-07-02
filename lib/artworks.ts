export type Artwork = {
  slug: string
  title: string
  image: string
  /** Intrinsic pixel dimensions of the image file, so grids keep honest aspect ratios. */
  imageWidth: number
  imageHeight: number
  alt: string
  year: number | null
  medium: string | null
  dimensions: string | null
  series: SeriesName
  description: string
  featured: boolean
  socialPostUrl?: string
}

export type SeriesName = 'Figure studies' | 'Fire and smoke' | 'Colour rupture' | 'Movement studies'

export const ARTWORKS: Artwork[] = [
  {
    slug: 'ignition-i',
    title: 'Ignition I',
    image: '/paintings/ignition-i.jpg',
    imageWidth: 2268,
    imageHeight: 2835,
    alt: 'A figurative painting showing a woman holding a lit cigarette in a dark studio setting.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Fire and smoke',
    description: 'A charged portrait built around smoke, shadow, and the small violence of a flame.',
    featured: true,
  },
  {
    slug: 'ignition-ii',
    title: 'Ignition II',
    image: '/paintings/ignition-ii.jpg',
    imageWidth: 640,
    imageHeight: 900,
    alt: 'An expressive portrait of a woman lit by the orange glow of a cigarette, surrounded by dark brushwork.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Fire and smoke',
    description: 'A portrait where light does the speaking. The figure sits between control and collapse, with the flame holding the centre of the painting.',
    featured: true,
  },
  {
    slug: 'crimson-study',
    title: 'Crimson Study',
    image: '/paintings/crimson-study.jpg',
    imageWidth: 600,
    imageHeight: 900,
    alt: 'A crimson-toned expressive portrait with loose red and black marks around the figure.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Figure studies',
    description: 'A red, unsettled figure study. The work leans into pressure, gaze, and the feeling of being seen before you are ready.',
    featured: true,
  },
  {
    slug: 'ascendant',
    title: 'Ascendant',
    image: '/paintings/ascendant.jpg',
    imageWidth: 600,
    imageHeight: 900,
    alt: 'A black, white, and teal portrait of a woman looking upward with wind-like brushwork around her hair.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A lifted face, loose marks, and weather moving through the body.',
    featured: true,
  },
  {
    slug: 'tempest',
    title: 'Tempest',
    image: '/paintings/tempest.jpg',
    imageWidth: 600,
    imageHeight: 900,
    alt: 'A dark expressive portrait with windblown hair and rough gestural mark-making.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A figure caught in motion. Hair, posture, and marks pull the work toward storm rather than stillness.',
    featured: true,
  },
  {
    slug: 'radiance',
    title: 'Radiance',
    image: '/paintings/radiance.jpg',
    imageWidth: 600,
    imageHeight: 900,
    alt: 'A bright expressive portrait with blue and black gestural marks around a smiling figure.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Movement studies',
    description: 'A lighter work without losing weight. It carries movement, softness, and a release of pressure.',
    featured: false,
  },
  {
    slug: 'dissolution',
    title: 'Dissolution',
    image: '/paintings/dissolution.jpg',
    imageWidth: 416,
    imageHeight: 900,
    alt: 'A colourful vertical face study with yellow, green, red, and blue paint marks.',
    year: null,
    medium: null,
    dimensions: null,
    series: 'Colour rupture',
    description: 'A colour-heavy face study. The image feels fractured, bright, and uncomfortable in the right way.',
    featured: false,
  },
]

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

export function getArtwork(slug: string) {
  return ARTWORKS.find((artwork) => artwork.slug === slug)
}

export function getFeaturedArtworks() {
  return ARTWORKS.filter((artwork) => artwork.featured)
}

export function formatArtworkMeta(value: string | number | null) {
  return value === null || value === '' ? null : String(value)
}

export function artworkMetaItems(artwork: Artwork) {
  return [
    ['Year', formatArtworkMeta(artwork.year)],
    ['Medium', formatArtworkMeta(artwork.medium)],
    ['Dimensions', formatArtworkMeta(artwork.dimensions)],
    ['Series', artwork.series],
  ].filter((item): item is [string, string] => Boolean(item[1]))
}
