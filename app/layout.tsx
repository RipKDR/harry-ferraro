import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Grain } from '@/components/Grain'
import { Vignette } from '@/components/Vignette'
import { Nav } from '@/components/Nav'
import { SITE, POSITIONING } from '@/lib/site'

// Self-hosted from public/fonts so builds never depend on Google Fonts.
const cormorant = localFont({
  src: [
    { path: '../public/fonts/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/cormorant-garamond-latin-300-italic.woff2', weight: '300', style: 'italic' },
    { path: '../public/fonts/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/cormorant-garamond-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: '../public/fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/cormorant-garamond-latin-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
})

const jetbrains = localFont({
  src: [
    { path: '../public/fonts/jetbrains-mono-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/jetbrains-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/jetbrains-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
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
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: SITE.siteUrl,
    siteName: SITE.artistName,
    title: 'Harrison Ferraro | Painter',
    description: POSITIONING,
    images: [{ url: '/paintings/ignition-ii.jpg', width: 1200, height: 1500, alt: 'Figurative painting by Harrison Ferraro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harrison Ferraro | Painter',
    description: POSITIONING,
    images: [{ url: '/paintings/ignition-ii.jpg', alt: 'Figurative painting by Harrison Ferraro' }],
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
