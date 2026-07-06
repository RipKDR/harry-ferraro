import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AVAILABLE_ARTWORKS, getArtwork } from '@/lib/artworks'
import { SITE } from '@/lib/site'
import { WallPreview } from '@/components/WallPreview'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return AVAILABLE_ARTWORKS.map((artwork) => ({ slug: artwork.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) return {}

  return {
    title: `Wall preview · ${artwork.title}`,
    description: `Place ${artwork.title} on your wall using your camera.`,
    alternates: { canonical: `${SITE.siteUrl}/preview/${artwork.slug}` },
  }
}

export default async function PreviewArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) notFound()

  return <WallPreview artwork={artwork} />
}