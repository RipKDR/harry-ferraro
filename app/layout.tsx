import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { Grain } from '@/components/Grain'
import { Nav } from '@/components/Nav'
import { MobileNav } from '@/components/MobileNav'
import { SITE, SOCIAL } from '@/lib/site'

// Display serif — variable, tunable optical size for an art-directed feel.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-cormorant',
  display: 'swap',
})

// UI / metadata face — used only for nav, captions, labels, buttons.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Fine Art`, template: `%s | ${SITE.name}` },
  description: `Original figurative oil paintings by ${SITE.name}. Emotionally intense, technically precise. Fire. Wind. Dissolution. ${SITE.location}.`,
  keywords: ['fine art', 'oil painting', 'figurative art', SITE.name, 'Melbourne artist', 'original paintings', 'art commissions', 'buy original art'],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: 'website', locale: 'en_AU', url: SITE.url,
    siteName: SITE.name, title: `${SITE.name} — Fine Art`,
    description: 'Original figurative oil paintings. Fire. Wind. Dissolution.',
  },
  twitter: { card: 'summary_large_image', title: `${SITE.name} — Fine Art` },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: SITE.url },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VisualArtist',
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  description: SITE.tagline,
  address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressCountry: 'AU' },
  sameAs: [SOCIAL.instagram.url, SOCIAL.facebook.url],
}

export const viewport: Viewport = {
  themeColor: '#0b0a09', width: 'device-width', initialScale: 1, colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <Grain />
        <Nav />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <MobileNav />
      </body>
    </html>
  )
}
