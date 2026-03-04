'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { Artwork } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { useFocusTrap } from '@/lib/useFocusTrap'

type LightboxProps = {
  art: Artwork
  all: Artwork[]
  onClose: () => void
  onNav: (dir: -1 | 1) => void
  onJumpTo: (index: number) => void
  onBuy: (art: Artwork) => void
  onInquire: (art: Artwork) => void
}

export function Lightbox({ art, all, onClose, onNav, onJumpTo, onBuy, onInquire }: LightboxProps) {
  const idx = all.findIndex((a) => a.id === art.id)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap(containerRef)

  const slug = art.filename.replace('.jpg', '')

  useEffect(() => {
    document.body.classList.add('modal-open')
    closeBtn.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && idx > 0) onNav(-1)
      if (e.key === 'ArrowRight' && idx < all.length - 1) onNav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [art, idx, all.length, onClose, onNav])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx > 0 && idx > 0) onNav(-1)
      else if (dx < 0 && idx < all.length - 1) onNav(1)
    }
    touchStartX.current = null
  }, [idx, all.length, onNav])

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${art.title} — ${art.year}`}
      className="fixed inset-0 z-[600] flex items-center justify-center lightbox-enter"
      style={{ background: 'rgba(4,3,8,0.98)' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative flex items-stretch max-w-[96vw] max-h-[95vh] lightbox-content-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex items-center justify-center bg-[#22202c] flex-shrink-0">
          <Image
            key={art.id}
            src={`/paintings/${art.filename}`}
            alt={`${art.title} by Harry Ferraro, ${art.year}`}
            width={640}
            height={900}
            className="object-contain block"
            style={{ maxWidth: '60vw', maxHeight: '88vh' }}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDERS[slug]}
            priority
          />
        </div>

        {/* Info panel */}
        <div
          className="w-[300px] flex-shrink-0 flex flex-col overflow-y-auto max-md:hidden"
          style={{ background: '#1c1a24', border: '1px solid #38354a', borderLeft: 'none' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-[#38354a]">
            <button
              ref={closeBtn}
              onClick={onClose}
              className="text-[8.5px] tracking-[0.18em] uppercase text-text-3 hover:text-text transition-colors"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
              aria-label="Close lightbox"
            >
              ESC · Close
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={() => onNav(-1)}
                disabled={idx <= 0}
                className="w-8 h-8 flex items-center justify-center border border-[#38354a] text-text-3 hover:text-text hover:border-[#7c768a] transition-all disabled:opacity-30 text-sm"
                aria-label="Previous artwork"
              >←</button>
              <button
                onClick={() => onNav(1)}
                disabled={idx >= all.length - 1}
                className="w-8 h-8 flex items-center justify-center border border-[#38354a] text-text-3 hover:text-text hover:border-[#7c768a] transition-all disabled:opacity-30 text-sm"
                aria-label="Next artwork"
              >→</button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 flex-1 flex flex-col">
            <span className={`badge ${art.status === 'available' ? 'badge-available' : 'badge-sold'} mb-3`}>
              {art.status}
            </span>
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-ember mb-2.5"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {art.series}
            </p>
            <h2
              className="text-[28px] font-light leading-[1.08] mb-1.5"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {art.title}
            </h2>
            <p
              className="text-[9px] tracking-[0.14em] uppercase text-text-2 mb-5"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {art.year}
            </p>

            <div className="divider mb-0" />
            {[
              ['Medium', art.medium],
              ['Dimensions', art.dimensions],
              ['Series', art.series],
            ].map(([k, v]) => (
              <div key={k} className="info-row">
                <span className="info-key">{k}</span>
                <span className="info-val text-right text-[12px] max-w-[160px]">{v}</span>
              </div>
            ))}

            {art.status === 'available' && (
              <>
                <p
                  className="text-[36px] font-light mt-5 mb-1 leading-none"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  AUD {art.price.toLocaleString()}
                </p>
                <p
                  className="text-[8.5px] tracking-[0.1em] text-text-3 mb-5"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  Certificate of authenticity included
                </p>
              </>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-4">
              {art.status === 'available' ? (
                <>
                  <button onClick={() => onBuy(art)} className="btn-ember btn-full text-[9px]">
                    Purchase Original
                  </button>
                  <button
                    onClick={() => onInquire(art)}
                    className="btn-ghost btn-full text-[9px]"
                  >
                    Inquire
                  </button>
                </>
              ) : (
                <button onClick={() => onInquire(art)} className="btn-ghost btn-full text-[9px]">
                  Inquire About Similar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prev/next on mobile */}
      {idx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(-1) }}
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[#38354a] text-text-2 hover:text-text bg-[rgba(21,19,28,0.8)]"
          aria-label="Previous artwork"
        >←</button>
      )}
      {idx < all.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(1) }}
          className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-[#38354a] text-text-2 hover:text-text bg-[rgba(21,19,28,0.8)]"
          aria-label="Next artwork"
        >→</button>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
        {all.map((a, i) => (
          <button
            key={a.id}
            onClick={(e) => { e.stopPropagation(); onJumpTo(i) }}
            className="w-[5px] h-[5px] rounded-full transition-all"
            style={{ background: a.id === art.id ? '#c8570a' : '#48455a' }}
            aria-label={`Go to ${a.title}`}
            aria-current={a.id === art.id ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
