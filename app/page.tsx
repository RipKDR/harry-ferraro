import { getArtworks } from '@/lib/sanityClient'
import HomeClient from './HomeClient'

// Revalidate every 60 s so Sanity content updates are reflected quickly.
// Falls back to static data instantly if Sanity is not configured.
export const revalidate = 60

export default async function HomePage() {
  const artworks = await getArtworks()
  return <HomeClient artworks={artworks} />
}
