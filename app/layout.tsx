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
  keywords: ['Harrison Ferraro', 'Melbourne painter', 'figurative oil paintings', 'expressive portrait painting', 'Australian visual artist'],
  authors: [{ name: SITE.artistName, url: SITE.siteUrl }],
  creator: SITE.artistName,
  alternates: { canonical: SITE.siteUrl },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE.siteUrl,
    siteName: SITE.artistName,
    title: 'Harrison Ferraro | Painter',
    description: POSITIONING,
    images: [{ url: '/paintings/ignition-ii.jpg', width: 1200, height: 1500, alt: 'Figurative painting by Harrison Ferraro' }],
  },
  twitter: { card: 'summary_large_image', title: 'Harrison Ferraro | Painter', description: POSITIONING, images: ['/paintings/ignition-ii.jpg'] },
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
    <html lang="en-AU" suppressHydrationWarning className={`${cormorant.variable} ${jetbrains.variable}`}>
      <body>
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
