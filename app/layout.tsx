import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Cursor } from '@/components/Cursor'
import { Grain } from '@/components/Grain'
import { Nav } from '@/components/Nav'
import { MobileNav } from '@/components/MobileNav'

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
