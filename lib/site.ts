/**
 * Central site configuration — single source of truth for identity,
 * contact details, and social links. Edit values here, not in components.
 */

export const SITE = {
  /** Primary professional artist name. */
  name: 'Harrison Ferraro',
  /** Short tagline used in metadata and the footer. */
  tagline: 'Figurative oil paintings. Dark, expressive, original.',
  /** Secondary social identity. */
  handle: 'just_harry_fkn_ferraro',
  /** Where enquiry + commission emails are delivered. */
  email: 'hferraro1999@gmail.com',
  /** City shown across the site. */
  location: 'Melbourne, Australia',
  locationShort: 'Melbourne, AU',
  /** Locale + currency. */
  locale: 'en-AU',
  currency: 'AUD',
  /**
   * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the environment for the
   * production domain; falls back to the current Vercel deployment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://harry-ferraro.vercel.app',
} as const

export const SOCIAL = {
  instagram: {
    label: 'Instagram',
    handle: `@${SITE.handle}`,
    url: 'https://www.instagram.com/just_harry_fkn_ferraro',
  },
  facebook: {
    label: 'Facebook',
    handle: 'Harrison Ferraro',
    url: 'https://www.facebook.com/share/1Jp9whV5Ah/',
  },
} as const

export const mailto = `mailto:${SITE.email}`
