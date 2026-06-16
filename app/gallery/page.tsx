'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ARTWORKS, priceLabel } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import type { Artwork } from '@/lib/artworks'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { InquireModal } from '@/components/InquireModal'

const FILTERS = ['All', 'Available', 'Fire', 'Portraits', 'Wind', 'Colour Studies'] as const

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('All')
  const [lb, setLb] = useState<Artwork | null>(null)
  const [inqModal, setInqModal] = useState<Artwork | null>(null)

  const shown = useMemo(() =>
    ARTWORKS.filter((a) => {
      if (filter === 'All') return true
      if (filter === 'Available') return a.status === 'available'
      return a.series === filter
    }),
    [filter]
  )

  const navLB = (dir: -1 | 1) => {
    if (!lb) return
    const i = shown.findIndex((a) => a.id === lb.id)
    const next = shown[i + dir]
    if (next) setLb(next)
  }

  return (
    <>
      <div className="page-enter">
        {/* Header */}
        <header className="pt-[140px] px-[52px] pb-11 border-b border-[#2a2622] max-md:px-6">
          <div className="flex justify-between items-end mb-7">
            <Reveal>
              <h1 className="font-serif font-light tracking-[-0.02em]" style={{ fontSize: 'clamp(44px,7vw,88px)' }}>Gallery</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-3">
                {shown.length} / {ARTWORKS.length} works
              </span>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="font-mono text-[13px] text-text-2 leading-[1.8] max-w-[520px]">
              Original works in oil, acrylic, and mixed media. Each piece is unique — no prints, no editions.
            </p>
          </Reveal>
        </header>

        {/* Filters */}
        <div
          className="flex overflow-x-auto border-b border-[#2a2622] scrollbar-none"
          role="tablist"
          aria-label="Filter artworks"
          style={{ scrollbarWidth: 'none' }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className="font-mono text-[9px] tracking-[0.16em] uppercase px-5 py-[18px] border-b-2 whitespace-nowrap flex-shrink-0 transition-all"
              style={{
                color: filter === f ? '#ede8e1' : '#6e665f',
                borderBottomColor: filter === f ? '#b8714c' : 'transparent',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery — asymmetric, work breathes, metadata visible */}
        {shown.length > 0 ? (
          <div
            className="px-[clamp(20px,5vw,80px)] pt-[clamp(40px,6vw,80px)] pb-[180px]"
            style={{ columns: 'var(--cols, 2)', columnGap: 'clamp(28px,4vw,72px)', columnFill: 'balance' }}
          >
            <style>{`
              @media (max-width: 700px) { [style*="--cols"] { --cols: 1 } }
              @media (min-width: 701px) { [style*="--cols"] { --cols: 2 } }
            `}</style>
            {shown.map((art, i) => (
              <figure
                key={art.id}
                className="gallery-item break-inside-avoid mb-[clamp(44px,5vw,88px)]"
                style={{ display: 'block', animationDelay: `${i * 0.05}s` }}
              >
                <button
                  className="gallery-card w-full text-left block"
                  onClick={() => setLb(art)}
                  aria-label={`${art.title}, ${art.year}. ${art.medium}, ${art.dimensions}. ${priceLabel(art)}. Open detail view.`}
                >
                  <Image
                    src={`/paintings/${art.filename}`}
                    alt={`${art.title} by Harrison Ferraro, ${art.year}. ${art.medium}.`}
                    width={800} height={art.dimensions.includes('×') ? parseInt(art.dimensions.split('×')[1]) * 9 : 1000}
                    className="w-full"
                    sizes="(max-width:700px) 100vw, 46vw"
                    placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
                  />
                </button>
                <figcaption className="mt-5 flex items-baseline justify-between gap-5">
                  <div>
                    <div className="font-serif text-[22px] leading-[1.1]">{art.title}</div>
                    <div className="font-sans text-[12.5px] text-text-2 mt-1.5">{art.year} · {art.medium}</div>
                    <div className="font-sans text-[12.5px] text-text-3">{art.dimensions}</div>
                  </div>
                  <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-text-3 whitespace-nowrap mt-1">
                    {art.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="px-[52px] py-24 text-center max-md:px-6">
            <p className="font-mono text-text-3 text-[13px]">No works match this filter.</p>
          </div>
        )}

        <Footer />
      </div>

      {lb && (
        <Lightbox
          art={lb} all={shown}
          onClose={() => setLb(null)}
          onNav={navLB}
          onJumpTo={(i) => { if (shown[i]) setLb(shown[i]) }}
          onInquire={(a) => { setLb(null); setInqModal(a) }}
        />
      )}
      {inqModal && <InquireModal art={inqModal} onClose={() => setInqModal(null)} />}
    </>
  )
}
