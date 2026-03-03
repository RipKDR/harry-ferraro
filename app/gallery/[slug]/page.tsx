import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { ArtworkActions } from '@/components/ArtworkActions'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return ARTWORKS.map((art) => ({ slug: art.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const art = ARTWORKS.find((a) => a.slug === slug)
  if (!art) return {}
  return {
    title: `${art.title} — ${art.year}`,
    description: art.statement.slice(0, 160),
    openGraph: {
      title: `${art.title} — Harry Ferraro`,
      description: art.statement.slice(0, 160),
      images: [{ url: `/paintings/${art.filename}`, width: 600, height: 900, alt: art.title }],
    },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const art = ARTWORKS.find((a) => a.slug === slug)
  if (!art) notFound()

  const idx = ARTWORKS.findIndex((a) => a.slug === slug)
  const prev = ARTWORKS[idx - 1] ?? null
  const next = ARTWORKS[idx + 1] ?? null
  const related = ARTWORKS.filter((a) => a.series === art.series && a.slug !== slug).slice(0, 3)
  const seriesInfo = SERIES[art.series]

  return (
    <div className="page-enter">
      {/* Back breadcrumb */}
      <div className="pt-[100px] px-[52px] pb-4 max-md:px-6">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2.5 font-mono text-[9px] tracking-[0.16em] uppercase text-text-3 hover:text-ember transition-colors"
        >
          <span aria-hidden="true">←</span> All Works
        </Link>
      </div>

      {/* Main layout */}
      <div className="artwork-detail">
        {/* Sticky image */}
        <div className="artwork-sticky" aria-label={`${art.title} painting`}>
          <Image
            src={`/paintings/${art.filename}`}
            alt={`${art.title} by Harry Ferraro, ${art.year}. ${art.medium}.`}
            width={640}
            height={900}
            className="max-w-full max-h-full object-contain p-10 max-md:p-6"
            priority
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
            sizes="(max-width:768px) 100vw, 55vw"
          />
          {/* Prev/next on desktop */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8 max-md:hidden" aria-label="Navigate artworks">
            {prev ? (
              <Link href={`/gallery/${prev.slug}`} className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-text-3 hover:text-ember transition-colors">
                <span aria-hidden>←</span> {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/gallery/${next.slug}`} className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-text-3 hover:text-ember transition-colors">
                {next.title} <span aria-hidden>→</span>
              </Link>
            ) : <span />}
          </div>
        </div>

        {/* Info panel */}
        <div className="artwork-panel">
          {/* Series + status */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/series"
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-3 hover:text-ember transition-colors"
            >
              {art.series} Series
            </Link>
            <span className={`badge ${art.status === 'available' ? 'badge-available' : 'badge-sold'}`}>
              {art.status}
            </span>
          </div>

          <h1 className="font-serif font-light leading-[1.02] mb-2" style={{ fontSize: 'clamp(34px,3.5vw,54px)' }}>
            {art.title}
          </h1>
          <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-2 mb-8">
            {art.year}
          </p>

          <div className="divider mb-7" />

          {/* Metadata rows */}
          <dl aria-label="Artwork details">
            {[
              ['Medium', art.medium],
              ['Dimensions', art.dimensions],
              ['Year', String(art.year)],
              ['Series', art.series],
              ['Certificate', 'Included with purchase'],
            ].map(([k, v]) => (
              <div key={k} className="info-row">
                <dt className="info-key">{k}</dt>
                <dd className="info-val">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Price */}
          {art.status === 'available' ? (
            <div className="mt-8 mb-2">
              <div
                className="font-serif font-light leading-none mb-1.5 text-text"
                style={{ fontSize: '46px' }}
              >
                GBP {art.price.toLocaleString()}
              </div>
              <p className="font-mono text-[8.5px] tracking-[0.1em] text-text-3 mb-8">
                Free UK shipping · International available · Certificate of authenticity
              </p>
            </div>
          ) : (
            <div className="mt-8 mb-8">
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-text-3 py-4 border-t border-[#1e1c24]">
                This work has found its home.
              </p>
            </div>
          )}

          {/* Artist statement */}
          <blockquote
            className="font-serif font-light italic leading-[1.85] text-text-2 border-l-2 border-ember pl-5 my-8"
            style={{ fontSize: '16px' }}
          >
            {art.statement}
          </blockquote>

          {/* Actions — client component for modals */}
          <ArtworkActions art={art} />

          {/* Related works */}
          {related.length > 0 && (
            <Reveal className="mt-12">
              <div className="divider mb-6" />
              <p className="font-mono text-[8.5px] tracking-[0.16em] uppercase text-text-3 mb-4">
                Also from {art.series}
              </p>
              <div className="grid grid-cols-3 gap-1">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/gallery/${r.slug}`}
                    aria-label={r.title}
                    className="overflow-hidden group"
                  >
                    <Image
                      src={`/paintings/${r.filename}`}
                      alt={r.title}
                      width={200}
                      height={260}
                      className="w-full object-cover transition-all duration-500 group-hover:scale-[1.06] group-hover:brightness-100"
                      style={{ aspectRatio: '3/4', filter: 'brightness(0.7) saturate(0.8)' }}
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDERS[r.slug]}
                    />
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {/* Mobile prev/next */}
          <div className="hidden max-md:flex justify-between mt-12 pt-6 border-t border-[#1e1c24]">
            {prev ? (
              <Link href={`/gallery/${prev.slug}`} className="font-mono text-[9px] tracking-[0.12em] uppercase text-text-3 hover:text-ember transition-colors flex items-center gap-2">
                ← {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/gallery/${next.slug}`} className="font-mono text-[9px] tracking-[0.12em] uppercase text-text-3 hover:text-ember transition-colors flex items-center gap-2">
                {next.title} →
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
