import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { ARTWORKS } from '@/lib/artworks'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/gallery', '/series', '/process', '/about', '/commissions', '/contact']
  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/gallery' ? 0.9 : 0.7,
  }))

  const artworkRoutes: MetadataRoute.Sitemap = ARTWORKS.map((art) => ({
    url: `${SITE.url}/gallery/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...artworkRoutes]
}
