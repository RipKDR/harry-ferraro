'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ARTWORKS } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import type { Artwork } from '@/lib/artworks'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { PurchaseModal } from '@/components/PurchaseModal'
import { InquireModal } from '@/components/InquireModal'

const FILTERS = ['All', 'Available', 'Fire', 'Portraits', 'Wind', 'Colour Studies'] as const

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('All')
  const [lb, setLb] = useState<Artwork | null>(null)
  const [buyModal, setBuyModal] = useState<Artwork | null>(null)
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
        <header className="pt-[140px] px-[52px] pb-11 border-b border-[#38354a] max-md:px-6">
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
          className="flex overflow-x-auto border-b border-[#38354a] scrollbar-none"
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
                color: filter === f ? '#f2ede5' : '#7c768a',
                borderBottomColor: filter === f ? '#c8570a' : 'transparent',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {shown.length > 0 ? (
          <div
            className="px-[52px] pt-[5px] pb-[160px] max-md:px-5"
            style={{ columns: 'var(--cols, 3)', gap: '5px', columnFill: 'balance' }}
          >
            <style>{`
              @media (max-width: 640px) { [style*="--cols"] { --cols: 1 } }
              @media (min-width: 641px) and (max-width: 960px) { [style*="--cols"] { --cols: 2 } }
              @media (min-width: 961px) { [style*="--cols"] { --cols: 3 } }
            `}</style>
            {shown.map((art, i) => (
              <div
                key={art.id}
                className="gallery-item break-inside-avoid mb-[5px]"
                style={{ display: 'block', animationDelay: `${i * 0.04}s` }}
              >
                <button
                  className="gallery-card w-full text-left"
                  onClick={() => setLb(art)}
                  aria-label={`${art.title}, ${art.year}. ${art.status === 'available' ? `GBP ${art.price.toLocaleString()}, available` : 'Sold'}`}
                >
                  <Image
                    src={`/paintings/${art.filename}`}
                    alt={`${art.title} by Harry Ferraro, ${art.year}`}
                    width={600} height={art.dimensions.includes('×') ? parseInt(art.dimensions.split('×')[1]) * 7 : 750}
                    className="w-full"
                    sizes="(max-width:640px) 100vw, (max-width:960px) 50vw, 33vw"
                    placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-card-info">
                      <span className={`badge ${art.status === 'available' ? 'badge-available' : 'badge-sold'} mb-2.5 block`}>
                        {art.status}
                      </span>
                      <div className="font-serif text-[19px] font-light mb-1">{art.title}</div>
                      <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-text-2 mb-1.5">{art.medium}</div>
                      <div className="font-mono text-[10px] text-ember tracking-[0.08em]">
                        {art.status === 'available' ? `GBP ${art.price.toLocaleString()}` : 'Sold'}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
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
          onBuy={(a) => { setLb(null); setBuyModal(a) }}
          onInquire={(a) => { setLb(null); setInqModal(a) }}
        />
      )}
      {buyModal && <PurchaseModal art={buyModal} onClose={() => setBuyModal(null)} />}
      {inqModal && <InquireModal art={inqModal} onClose={() => setInqModal(null)} />}
    </>
  )
}
