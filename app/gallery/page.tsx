import type { Metadata } from 'next'
import Link from 'next/link'
import { AVAILABLE_ARTWORKS, getActiveSeries } from '@/lib/artworks'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { GalleryIndex } from './GalleryIndex'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Work index — figurative oil paintings by Harrison Ferraro, Melbourne. Portraits, figure studies, and colour studies.',
  alternates: { canonical: `${SITE.siteUrl}/gallery` },
}

export default function GalleryPage() {
  const seriesNames = getActiveSeries().map(([name]) => name)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Work index — Harrison Ferraro',
    url: `${SITE.siteUrl}/gallery`,
    about: { '@type': 'Person', name: SITE.artistName },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: AVAILABLE_ARTWORKS.map((artwork, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE.siteUrl}/gallery/${artwork.slug}`,
        name: artwork.title,
      })),
    },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Work index</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.58fr] lg:items-end">
          <h1 className="font-serif text-[clamp(4.8rem,14vw,15rem)] leading-[0.76] tracking-[-0.09em]">
            Paintings.
          </h1>
          <div className="flex flex-col gap-4 lg:items-end lg:pb-3">
            <p className="max-w-[34rem] font-mono text-[0.86rem] leading-8 text-text-2">
              A portfolio index of current and recent figurative works. Details stay minimal so the painting stays in front.
            </p>
            <Link href="/preview" className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxide transition-colors hover:text-text">
              Try wall preview →
            </Link>
          </div>
        </div>
      </header>

      <GalleryIndex artworks={AVAILABLE_ARTWORKS} seriesNames={seriesNames} />

      <Footer />
    </div>
  )
}
