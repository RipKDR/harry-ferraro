import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Grain } from '@/components/Grain'
import { Vignette } from '@/components/Vignette'
import { Nav } from '@/components/Nav'
import { SITE, POSITIONING } from '@/lib/site'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: { default: 'Harrison Ferraro | Painter', template: '%s | Harrison Ferraro' },
  description: `${POSITIONING} Portfolio and studio enquiries by Harrison Ferraro.`,
  authors: [{ name: SITE.artistName, url: SITE.siteUrl }],
  creator: SITE.artistName,
  alternates: { canonical: SITE.siteUrl },
  manifest: '/manifest.webmanifest',
  // Open Graph / Twitter images come from app/opengraph-image.tsx (site-wide)
  // and app/gallery/[slug]/opengraph-image.tsx (per artwork).
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE.siteUrl,
    siteName: SITE.artistName,
    title: 'Harrison Ferraro | Painter',
    description: POSITIONING,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harrison Ferraro | Painter',
    description: POSITIONING,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
}

export const viewport: Viewport = {
  themeColor: '#080706',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.artistName,
    url: SITE.siteUrl,
    sameAs: [SITE.instagramUrl, SITE.facebookUrl],
    jobTitle: 'Painter',
    address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressCountry: 'AU' },
  }

  return (
    <html lang="en-AU" suppressHydrationWarning className={`no-js ${cormorant.variable} ${jetbrains.variable}`}>
      <body>
        {/* Swap <html> from .no-js to .js before first paint. If JS is disabled
            the class stays .no-js and the CSS fallback in globals.css forces
            motion-hidden content visible, so the page is never blank. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <Grain />
        <Vignette />
        <Nav />
        <main id="main-content" tabIndex={-1}>{children}</main>
      </body>
    </html>
  )
}
