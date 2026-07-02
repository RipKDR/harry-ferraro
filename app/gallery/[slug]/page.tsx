import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTWORKS, SERIES, formatArtworkMeta, getArtwork } from '@/lib/artworks'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { ArtworkActions } from '@/components/ArtworkActions'
import { ArtworkStage } from '@/components/ArtworkStage'
import { blurProps } from '@/lib/blurPlaceholders'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ARTWORKS.map((artwork) => ({ slug: artwork.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) return {}

  return {
    title: `${artwork.title} | Harrison Ferraro`,
    description: artwork.description,
    alternates: { canonical: `${SITE.siteUrl}/gallery/${artwork.slug}` },
    openGraph: {
      title: `${artwork.title} by Harrison Ferraro`,
      description: artwork.description,
      url: `${SITE.siteUrl}/gallery/${artwork.slug}`,
      images: [{ url: artwork.image, width: 1200, height: 1500, alt: artwork.alt }],
    },
    twitter: { card: 'summary_large_image', title: `${artwork.title} by Harrison Ferraro`, description: artwork.description, images: [artwork.image] },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) notFound()

  const currentIndex = ARTWORKS.findIndex((item) => item.slug === artwork.slug)
  const nextArtwork = ARTWORKS[(currentIndex + 1) % ARTWORKS.length]
  const series = SERIES[artwork.series]

  const captionLines = [
    formatArtworkMeta(artwork.year),
    formatArtworkMeta(artwork.medium),
    formatArtworkMeta(artwork.dimensions),
  ].filter((value): value is string => Boolean(value))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    creator: { '@type': 'Person', name: SITE.artistName },
    image: `${SITE.siteUrl}${artwork.image}`,
    artform: artwork.medium || 'Visual art',
    description: artwork.description,
    url: `${SITE.siteUrl}/gallery/${artwork.slug}`,
  }

  return (
    <div className="page-enter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="site-shell lg:grid lg:grid-cols-[58%_42%] lg:items-start">
        {/* Left — sticky image panel on desktop, stacked top on mobile.
            The painting is shown uncropped; tapping it opens the lightbox. */}
        <div className="relative h-[68vh] w-full overflow-hidden bg-[#050403] lg:sticky lg:top-0 lg:h-[100dvh]" aria-label={`${artwork.title} artwork image`}>
          <ArtworkStage artwork={artwork} />
        </div>

        {/* Right — scrolling content column */}
        <div className="section-pad-tight lg:px-[clamp(2rem,4vw,4.5rem)] lg:py-[clamp(5rem,9vw,8rem)]">
          <Link href="/gallery" className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-3 transition-colors hover:text-oxide">
            <span aria-hidden="true">←</span> Work index
          </Link>

          <p className="eyebrow mb-5 mt-10">{artwork.series}</p>

          <h1 className="font-serif text-[clamp(3rem,5vw,7rem)] leading-[0.82] tracking-[-0.07em]">{artwork.title}</h1>

          {captionLines.length > 0 && (
            <div className="mt-7 space-y-1.5">
              {captionLines.map((line) => (
                <p key={line} className="font-mono text-[0.72rem] leading-6 tracking-[0.04em] text-text-3">{line}</p>
              ))}
            </div>
          )}

          {artwork.description && (
            <p className="mt-8 max-w-[36rem] font-mono text-[0.88rem] leading-8 text-text-2">{artwork.description}</p>
          )}

          <div className="statement-panel my-10">
            <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-oxide">Series note</p>
            <p className="font-mono text-[0.82rem] leading-7 text-text-2">{series.description}</p>
          </div>

          <ArtworkActions artwork={artwork} />

          <div className="mt-14">
            <div className="divider mb-6" />
            <Link href={`/gallery/${nextArtwork.slug}`} className="group flex items-center gap-5" aria-label={`Next work: ${nextArtwork.title}`}>
              <div className="relative h-[5.5rem] w-[4.4rem] shrink-0 overflow-hidden bg-[#050403]">
                <Image
                  src={nextArtwork.image}
                  alt={nextArtwork.alt}
                  fill
                  {...blurProps(nextArtwork.slug)}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-3">Next work</p>
                <p className="mt-2 font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-none tracking-[-0.04em] text-text transition-colors group-hover:text-oxide">
                  {nextArtwork.title} <span aria-hidden="true" className="text-oxide">→</span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
