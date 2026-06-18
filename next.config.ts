import type { NextConfig } from 'next'

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

const sanityConnectSrc = sanityProjectId
  ? `https://${sanityProjectId}.api.sanity.io https://${sanityProjectId}.apicdn.sanity.io wss://${sanityProjectId}.api.sanity.io`
  : ''

const sanityImgSrc = sanityProjectId ? 'https://cdn.sanity.io' : ''
const sanityFontSrc = sanityProjectId ? 'https://cdn.sanity.io' : ''

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self' ${sanityFontSrc};
  img-src 'self' data: blob: https://*.stripe.com ${sanityImgSrc};
  connect-src 'self' https://api.resend.com https://api.stripe.com ${sanityConnectSrc};
  frame-src https://js.stripe.com https://hooks.stripe.com;
  worker-src blob:;
`.replace(/\s+/g, ' ').trim()

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/((?!studio).*)',
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
