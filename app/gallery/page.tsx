'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES, formatArtworkMeta } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

const FILTERS = ['All', ...Object.keys(SERIES)] as const

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

      <div className="sticky top-[5.2rem] z-30 border-b border-[var(--border)] bg-[rgba(8,7,6,0.86)] backdrop-blur-2xl">
        <div className="site-shell flex gap-2 overflow-x-auto px-5 py-3 md:px-12 lg:px-[4.5rem]" aria-label="Filter paintings" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((filterName) => (
            <button
              key={filterName}
              type="button"
              aria-pressed={filter === filterName}
              onClick={() => setFilter(filterName)}
              className={`shrink-0 border px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all ${
                filter === filterName
                  ? 'border-oxide bg-oxide text-[#080706]'
                  : 'border-[var(--border)] text-text-3 hover:border-[var(--border-strong)] hover:text-text-2'
              }`}
            >
              {filterName}
            </button>
          ))}
        </div>
      </div>

      <section className="section-pad site-shell" aria-label="Painting grid">
        <div className="grid gap-x-5 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((artwork, index) => {
            const meta = [formatArtworkMeta(artwork.year), formatArtworkMeta(artwork.medium), formatArtworkMeta(artwork.dimensions)].filter(Boolean).join(' · ')
            const indexLabel = String(index + 1).padStart(2, '0')
            return (
              <Reveal key={artwork.slug} delayMs={(index % 3) * 80}>
                <Link href={`/gallery/${artwork.slug}`} className={`work-tile group block ${index % 3 === 1 ? 'xl:translate-y-14' : index % 3 === 2 ? 'xl:-translate-y-6' : ''}`}>
                  <article>
                    <ArtFrame>
                      <div className="relative overflow-hidden" style={{ aspectRatio: index % 3 === 0 ? '4 / 5' : '3 / 4' }}>
                        <Image src={artwork.image} alt={artwork.alt} fill className="art-image object-cover" sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" />
                      </div>
                    </ArtFrame>
                    <div className="mt-4 flex items-start justify-between gap-4 border-t border-[var(--border)] pt-4">
                      <div>
                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-3">{artwork.series}</p>
                        <h2 className="mt-2 font-serif text-[clamp(2.2rem,4vw,4rem)] leading-none tracking-[-0.06em]">{artwork.title}</h2>
                        {meta && <p className="mt-3 font-mono text-[0.72rem] leading-6 text-text-3">{meta}</p>}
                      </div>
                      <span className="font-mono text-[0.62rem] tracking-[0.2em] text-oxide">{indexLabel}</span>
                    </div>
                  </article>
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
