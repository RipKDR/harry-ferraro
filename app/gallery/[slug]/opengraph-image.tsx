import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { AVAILABLE_ARTWORKS, getArtwork } from '@/lib/artworks'
import { SITE } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return AVAILABLE_ARTWORKS.map((artwork) => ({ slug: artwork.slug }))
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  return [{ id: 'og', alt: artwork ? `${artwork.title} by ${SITE.artistName}` : SITE.artistName, size, contentType }]
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  const source = artwork ?? AVAILABLE_ARTWORKS[0]

  const painting = await readFile(join(process.cwd(), 'public', source.image))
  const paintingSrc = `data:image/jpeg;base64,${painting.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #080706 0%, #100d0a 60%, #060504 100%)',
          color: '#f0e7dc',
        }}
      >
        <div style={{ width: 480, display: 'flex', position: 'relative' }}>
          <img src={paintingSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(270deg, #080706 0%, rgba(8,7,6,0.18) 35%, rgba(8,7,6,0) 100%)',
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 2, background: '#b65d2c' }} />
            <div style={{ fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: '#d1844a' }}>
              {source.series}
            </div>
          </div>
          <div style={{ marginTop: 28, fontSize: 76, lineHeight: 1, letterSpacing: -3, display: 'flex' }}>
            {source.title}
          </div>
          <div style={{ marginTop: 26, fontSize: 24, lineHeight: 1.45, color: '#b7aa9b', maxWidth: 560 }}>
            {source.description.length > 120 ? `${source.description.slice(0, 117)}…` : source.description}
          </div>
          <div style={{ marginTop: 32, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: '#8f8375' }}>
            {`${SITE.artistName} · ${new URL(SITE.siteUrl).host}`}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
