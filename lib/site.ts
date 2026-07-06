export const SITE = {
  artistName: 'Harrison Ferraro',
  shortName: 'Harrison',
  handle: '@just_harry_fkn_ferraro',
  email: 'hferraro1999@gmail.com',
  location: 'Melbourne, Australia',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://harry-ferraro.vercel.app',
  instagramUrl: 'https://www.instagram.com/just_harry_fkn_ferraro',
  facebookUrl: 'https://www.facebook.com/share/1Jp9whV5Ah/',
} as const

export const POSITIONING =
  'Oil paintings of faces and figures, made in Melbourne from smoke, colour, pressure, and weather.'

export const ARTIST_INTRO =
  'I paint people at the point where they stop feeling settled. A lit cigarette, a head turned into wind, a red field, a face half lost in shadow. The work stays rough where the feeling is rough.'

export const ARTIST_STATEMENT = [
  'I work with figures because a face can carry pressure without explaining it. Smoke, wind, red paint, hard shadow, a half-lit mouth, a body turning away. These things let the painting sit between portrait and mood.',
  'I am not trying to make the person clean or resolved. I leave marks open when they need to stay open. The painting is finished when the surface still feels alive after the room goes quiet.',
  'The work comes from private states: grief, heat, desire, shame, tenderness, memory. I do not want the paintings to behave. I want them to hold the part of a person that usually slips out before language gets to it.',
] as const

/**
 * The commission process, single-sourced so `/process` (full walkthrough) and
 * `/commissions` (compact strip) never drift apart.
 */
export const PROCESS_STEPS = [
  ['01', 'Brief', 'Send the subject, references, room, size, timing, and what the painting should avoid.'],
  ['02', 'Fit check', 'Harrison confirms whether the request suits the work and asks for anything that needs clearing up.'],
  ['03', 'Agreement', 'Scope, revision points, delivery, image usage, and timeline are confirmed in writing.'],
  ['04', 'Making', 'The painting begins once the practical details are clear. Progress expectations are agreed case by case.'],
  ['05', 'Delivery', 'Collection, shipping, and care details are confirmed before the work leaves the studio.'],
] as const

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: SITE.instagramUrl, handle: SITE.handle },
  { label: 'Facebook', href: SITE.facebookUrl, handle: 'Harrison Ferraro on Facebook' },
] as const
