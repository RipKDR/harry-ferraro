import type { MetadataRoute } from 'next'
import { ARTWORKS } from '@/lib/artworks'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/gallery', '/series', '/who-i-am', '/about', '/process', '/commissions', '/contact', '/preview']
  const pages = routes.map((route) => ({
    url: `${SITE.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/gallery' || route === '/who-i-am' ? 0.9 : 0.7,
  }))

  const artworkPages = ARTWORKS.map((artwork) => ({
    url: `${SITE.siteUrl}/gallery/${artwork.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: artwork.featured ? 0.8 : 0.65,
  }))

  const previewPages = ARTWORKS.map((artwork) => ({
    url: `${SITE.siteUrl}/preview/${artwork.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.55,
  }))

  return [...pages, ...artworkPages, ...previewPages]
}
