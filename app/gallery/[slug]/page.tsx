import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTWORKS, SERIES, artworkMetaItems, getArtwork } from '@/lib/artworks'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { ArtworkActions } from '@/components/ArtworkActions'

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

  const related = ARTWORKS.filter((item) => item.series === artwork.series && item.slug !== artwork.slug).slice(0, 3)
  const series = SERIES[artwork.series]
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

      <div className="site-shell px-5 pt-28 md:px-12 lg:px-[4.5rem]">
        <Link href="/gallery" className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-3 transition-colors hover:text-oxide">
          <span aria-hidden="true">←</span> Work index
        </Link>
      </div>

      <article className="site-shell grid min-h-[calc(100dvh-7rem)] gap-0 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,32rem)]">
        <div className="relative flex min-h-[72vh] items-center justify-center border-y border-[var(--border)] bg-[#050403] p-5 lg:sticky lg:top-24 lg:h-[calc(100dvh-6rem)] lg:border-r lg:p-10" aria-label={`${artwork.title} artwork image`}>
          <Image
            src={artwork.image}
            alt={artwork.alt}
            width={1100}
            height={1400}
            priority
            className="max-h-full w-auto max-w-full object-contain shadow-[0_24px_140px_rgba(0,0,0,.62)]"
            sizes="(max-width:1024px) 100vw, 62vw"
          />
        </div>

        <div className="section-pad-tight lg:py-12">
          <Link href="/series" className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-text-3 transition-colors hover:text-oxide">
            {artwork.series}
          </Link>

          <h1 className="mt-5 font-serif text-[clamp(4rem,7vw,7.6rem)] leading-[0.78] tracking-[-0.085em]">{artwork.title}</h1>
          <p className="mt-7 font-mono text-[0.88rem] leading-8 text-text-2">{artwork.description}</p>

          {artworkMetaItems(artwork).length > 0 && (
            <dl aria-label="Artwork details" className="my-9">
              {artworkMetaItems(artwork).map(([label, value]) => (
                <div key={label} className="info-row">
                  <dt className="info-key">{label}</dt>
                  <dd className="info-val max-w-[15rem]">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="statement-panel mb-8">
            <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-oxide">Series note</p>
            <p className="font-mono text-[0.82rem] leading-7 text-text-2">{series.description}</p>
          </div>

          <ArtworkActions artwork={artwork} />

          {related.length > 0 && (
            <section className="mt-12" aria-labelledby="related-heading">
              <div className="divider mb-6" />
              <h2 id="related-heading" className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-text-3">Related works</h2>
              <div className="grid grid-cols-3 gap-2">
                {related.map((item) => (
                  <Link key={item.slug} href={`/gallery/${item.slug}`} className="group block overflow-hidden bg-[#050403]" aria-label={`View ${item.title}`}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={260}
                      height={340}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  )
}
