import type { NextConfig } from 'next'

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' data: blob:;
  connect-src 'self' https://api.resend.com;
  frame-src 'none';
`.replace(/\n/g, ' ').trim()

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    // React ViewTransition support — shared-element morph from the gallery
    // index to the artwork detail hero (see components/ArtworkTransition.tsx).
    viewTransition: true,
  },
  async redirects() {
    return [
      // Canonical artist page is /who-i-am; /about persisted from an earlier IA.
      { source: '/about', destination: '/who-i-am', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
        ],
      },
      {
        source: '/paintings/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
