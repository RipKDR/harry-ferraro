import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { ARTWORKS as staticArtworks } from './artworks'
import type { Artwork } from './artworks'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'miv2pxun'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Only create the client if a project ID is configured
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlFor(source: SanityImageSource) {
  return builder?.image(source) ?? null
}

// Fetch artworks from Sanity, falling back to static data if not configured
export async function getArtworks(): Promise<Artwork[]> {
  if (!sanityClient) return staticArtworks

  try {
    const data = await sanityClient.fetch<
      Array<{
        id: number
        slug: string
        title: string
        year: number
        medium: string
        dimensions: string
        series: string
        price: number
        status: 'available' | 'sold'
        statement: string
        filename: string
      }>
    >(
      `*[_type == "artwork"] | order(order asc, _createdAt asc) {
        "id": coalesce(legacyId, 0),
        "slug": slug.current,
        title,
        year,
        medium,
        dimensions,
        series,
        price,
        status,
        statement,
        "filename": coalesce(
          localFilename,
          image.asset->originalFilename
        )
      }`,
    )

    if (data && data.length > 0) {
      // Filter to valid entries only
      return data.filter(
        (a) => a.slug && a.title && a.filename,
      ) as Artwork[]
    }
  } catch (err) {
    console.warn('[Sanity] Failed to fetch artworks, using static data:', err)
  }

  return staticArtworks
}
