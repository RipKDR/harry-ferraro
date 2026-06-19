'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES, formatArtworkMeta } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

const FILTERS = ['All', ...Object.keys(SERIES)] as const

// Intrinsic dimensions probed from /public/paintings. Files that are not yet on
// disk fall back to varied portrait ratios so the masonry still staggers honestly
// rather than collapsing into a uniform grid.
const DIMS: Record<string, { w: number; h: number }> = {
  'ignition-i': { w: 2268, h: 2835 },
  'ignition-ii': { w: 640, h: 900 },
  'crimson-study': { w: 600, h: 900 },
  ascendant: { w: 1000, h: 1320 },
  tempest: { w: 1000, h: 1500 },
  radiance: { w: 1000, h: 1180 },
  dissolution: { w: 900, h: 1400 },
}

const FALLBACK_DIM = { w: 1000, h: 1280 }

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('All')

  const shown = useMemo(() => {
    return ARTWORKS.filter((artwork) => filter === 'All' || artwork.series === filter)
  }, [filter])

  return (
    <div className="page-enter">
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
            <Link href="/preview" className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-oxide transition-colors hover:text-text">
              Try wall preview →
            </Link>
          </div>
        </div>
      </header>

      <div className="sticky top-[5.2rem] z-30 border-b border-[var(--border)] bg-[rgba(8,7,6,0.72)] backdrop-blur-xl">
        <div className="site-shell flex items-center gap-6 overflow-x-auto px-5 py-4 md:px-12 lg:px-[4.5rem]" aria-label="Filter paintings" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((filterName) => {
            const active = filter === filterName
            return (
              <button
                key={filterName}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(filterName)}
                className={`shrink-0 border-b pb-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] transition-colors duration-200 ${
                  active
                    ? 'border-oxide text-oxide'
                    : 'border-transparent text-text-3 hover:text-text-2'
                }`}
              >
                {filterName}
              </button>
            )
          })}
        </div>
      </div>

      <section className="section-pad site-shell" aria-label="Painting grid">
        <p className="mb-12 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-text-3">
          {shown.length} painting{shown.length === 1 ? '' : 's'}
        </p>

        <div className="columns-1 gap-x-6 sm:columns-2 xl:columns-3">
          {shown.map((artwork, index) => {
            const dim = DIMS[artwork.slug] ?? FALLBACK_DIM
            const year = formatArtworkMeta(artwork.year)
            const indexLabel = String(index + 1).padStart(2, '0')
            return (
              <Reveal key={artwork.slug} delayMs={(index % 3) * 90} className="mb-10 break-inside-avoid">
                <Link href={`/gallery/${artwork.slug}`} className="group block">
                  <ArtFrame>
                    <div className="relative overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.alt}
                        width={dim.w}
                        height={dim.h}
                        className="h-auto w-full brightness-100 transition-[filter] duration-200 group-hover:brightness-[0.72]"
                        sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                      />

                      <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.52rem] tracking-[0.2em] text-oxide opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        {indexLabel}
                      </span>

                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 pt-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        style={{ background: 'linear-gradient(to top, rgba(8,7,6,0.84), rgba(8,7,6,0))' }}
                      >
                        {year && (
                          <p className="font-mono text-[0.52rem] uppercase tracking-[0.2em] text-text-3">{year}</p>
                        )}
                        <h2 className="mt-1 font-serif text-[clamp(1.6rem,2.5vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
                          {artwork.title}
                        </h2>
                      </div>
                    </div>
                  </ArtFrame>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
