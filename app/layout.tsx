import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
// @ts-expect-error -- Next.js handles global CSS side-effect imports in the app router
import './globals.css'
import { Cursor } from '@/components/Cursor'
import { Grain } from '@/components/Grain'
import { Nav } from '@/components/Nav'
import { MobileNav } from '@/components/MobileNav'

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
  metadataBase: new URL('https://harryferraro.com.au'),
  title: { default: 'Harry Ferraro — Fine Art', template: '%s | Harry Ferraro' },
  description: 'Original figurative oil paintings by Harry Ferraro. Emotionally intense, technically precise. Fire. Wind. Dissolution. Melbourne, Australia.',
  keywords: ['fine art','oil painting','figurative art','Harry Ferraro','Melbourne artist','original paintings','commissions'],
  authors: [{ name: 'Harry Ferraro', url: 'https://harryferraro.com.au' }],
  creator: 'Harry Ferraro',
  openGraph: {
    type: 'website', locale: 'en_AU', url: 'https://harryferraro.com.au',
    siteName: 'Harry Ferraro', title: 'Harry Ferraro — Fine Art',
    description: 'Original figurative oil paintings. Fire. Wind. Dissolution.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Harry Ferraro Fine Art' }],
  },
  twitter: { card: 'summary_large_image', title: 'Harry Ferraro — Fine Art', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: 'https://harryferraro.com.au' },
}

export const viewport: Viewport = {
  themeColor: '#15131c', width: 'device-width', initialScale: 1, colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning className={`${cormorant.variable} ${jetbrains.variable}`}>
      <head>
      </head>
      <body>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <Grain />
        <Cursor />
        <Nav />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <MobileNav />
      </body>
    </html>
  )
}
