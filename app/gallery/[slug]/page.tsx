import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AVAILABLE_ARTWORKS, SERIES, formatArtworkMeta, getAdjacentArtworks, getArtwork } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { ArtFrame } from '@/components/ArtFrame'
import { ArtworkActions } from '@/components/ArtworkActions'
import { ArtworkTransition } from '@/components/ArtworkTransition'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return AVAILABLE_ARTWORKS.map((artwork) => ({ slug: artwork.slug }))
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
    },
    twitter: { card: 'summary_large_image', title: `${artwork.title} by Harrison Ferraro`, description: artwork.description },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = getArtwork(slug)
  if (!artwork) notFound()

  const adjacent = getAdjacentArtworks(artwork.slug)
  const series = SERIES[artwork.series]

  const captionLines = [
    formatArtworkMeta(artwork.year),
    formatArtworkMeta(artwork.medium),
    formatArtworkMeta(artwork.dimensions),
  ].filter((value): value is string => Boolean(value))

  const artworkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    creator: { '@type': 'Person', name: SITE.artistName },
    image: `${SITE.siteUrl}${artwork.image}`,
    artform: artwork.medium || 'Visual art',
    description: artwork.description,
    url: `${SITE.siteUrl}/gallery/${artwork.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE.siteUrl}/gallery` },
      { '@type': 'ListItem', position: 3, name: artwork.title, item: `${SITE.siteUrl}/gallery/${artwork.slug}` },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artworkJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="site-shell lg:grid lg:grid-cols-[58%_42%] lg:items-start">
        {/* Left — sticky image panel on desktop, stacked top on mobile */}
        <div className="relative h-[60vh] w-full overflow-hidden bg-[#050403] lg:sticky lg:top-0 lg:h-[100dvh]" aria-label={`${artwork.title} artwork image`}>
          <ArtFrame className="h-full">
            <ArtworkTransition name={`artwork-${artwork.slug}`}>
              <div className="relative h-full">
                <Image
                  src={artwork.image}
                  alt={artwork.alt}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDERS[artwork.slug]}
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                  sizes="(max-width:1024px) 100vw, 58vw"
                />
              </div>
            </ArtworkTransition>
          </ArtFrame>
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

          {/* Studio walk — previous / next published work */}
          {adjacent && adjacent.next.slug !== artwork.slug && (
            <nav className="mt-14" aria-label="More paintings">
              <div className="divider mb-6" />
              <div className="grid gap-6 sm:grid-cols-2">
                <Link href={`/gallery/${adjacent.previous.slug}`} className="group flex items-center gap-5" aria-label={`Previous work: ${adjacent.previous.title}`}>
                  <div className="relative h-[5.5rem] w-[4.4rem] shrink-0 overflow-hidden bg-[#050403]">
                    <Image
                      src={adjacent.previous.image}
                      alt={adjacent.previous.alt}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDERS[adjacent.previous.slug]}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-3">Previous</p>
                    <p className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-text transition-colors group-hover:text-oxide">
                      <span aria-hidden="true" className="text-oxide">←</span> {adjacent.previous.title}
                    </p>
                  </div>
                </Link>

                <Link href={`/gallery/${adjacent.next.slug}`} className="group flex items-center gap-5 sm:flex-row-reverse sm:text-right" aria-label={`Next work: ${adjacent.next.title}`}>
                  <div className="relative h-[5.5rem] w-[4.4rem] shrink-0 overflow-hidden bg-[#050403]">
                    <Image
                      src={adjacent.next.image}
                      alt={adjacent.next.alt}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDERS[adjacent.next.slug]}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-3">Next</p>
                    <p className="mt-2 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-text transition-colors group-hover:text-oxide">
                      {adjacent.next.title} <span aria-hidden="true" className="text-oxide">→</span>
                    </p>
                  </div>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </article>

      <Footer />
    </div>
  )
}
