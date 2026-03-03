import type { MetadataRoute } from 'next'

const BASE_URL = 'https://harryferraro.com.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/gallery', '/series', '/process', '/about', '/commissions', '/contact']
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/gallery' ? 0.9 : 0.7,
  }))
}
