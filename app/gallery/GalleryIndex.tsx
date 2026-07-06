'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Artwork, SeriesName } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { ArtFrame } from '@/components/ArtFrame'
import { ArtworkTransition } from '@/components/ArtworkTransition'
import { Reveal } from '@/components/Reveal'
import { formatArtworkMeta } from '@/lib/artworks'

// Intrinsic dimensions probed from /public/paintings. Unknown files fall back
// to a portrait ratio so the masonry still staggers honestly.
const DIMS: Record<string, { w: number; h: number }> = {
  'ignition-i': { w: 2268, h: 2835 },
  'ignition-ii': { w: 640, h: 900 },
  'crimson-study': { w: 600, h: 900 },
}

const FALLBACK_DIM = { w: 1000, h: 1280 }

type GalleryIndexProps = {
  artworks: Artwork[]
  seriesNames: SeriesName[]
}

export function GalleryIndex({ artworks, seriesNames }: GalleryIndexProps) {
  const filters = useMemo(() => ['All', ...seriesNames] as const, [seriesNames])
  const [filter, setFilter] = useState<string>('All')
  const [focusIndex, setFocusIndex] = useState(0)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const shown = useMemo(() => {
    return artworks.filter((artwork) => filter === 'All' || artwork.series === filter)
  }, [artworks, filter])

  // Roving tabindex: one tab stop for the whole filter strip, arrows move
  // focus between filters (WAI-ARIA toolbar pattern).
  const onToolbarKeyDown = (event: React.KeyboardEvent) => {
    let next: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (focusIndex + 1) % filters.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (focusIndex - 1 + filters.length) % filters.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = filters.length - 1
    if (next === null) return
    event.preventDefault()
    setFocusIndex(next)
    buttonRefs.current[next]?.focus()
  }

  return (
    <>
      <div className="sticky top-[5.2rem] z-30 border-b border-[var(--border)] bg-[rgba(8,7,6,0.72)] backdrop-blur-xl">
        <div
          role="toolbar"
          aria-label="Filter paintings"
          aria-orientation="horizontal"
          onKeyDown={onToolbarKeyDown}
          className="site-shell flex items-center gap-6 overflow-x-auto px-5 py-4 md:px-12 lg:px-[4.5rem]"
          style={{ scrollbarWidth: 'none' }}
        >
          {filters.map((filterName, index) => {
            const active = filter === filterName
            return (
              <button
                key={filterName}
                ref={(node) => { buttonRefs.current[index] = node }}
                type="button"
                tabIndex={index === focusIndex ? 0 : -1}
                aria-pressed={active}
                onFocus={() => setFocusIndex(index)}
                onClick={() => setFilter(filterName)}
                className={`shrink-0 border-b pb-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-200 ${
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
        <p className="mb-12 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-3" aria-live="polite">
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
                    <ArtworkTransition name={`artwork-${artwork.slug}`}>
                      <div className="relative overflow-hidden">
                        <Image
                          src={artwork.image}
                          alt={artwork.alt}
                          width={dim.w}
                          height={dim.h}
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDERS[artwork.slug]}
                          className="h-auto w-full brightness-100 transition-[filter] duration-200 group-hover:brightness-[0.72]"
                          sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                        />

                        <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.72rem] tracking-[0.2em] text-oxide opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {indexLabel}
                        </span>

                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 pt-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          style={{ background: 'linear-gradient(to top, rgba(8,7,6,0.84), rgba(8,7,6,0))' }}
                        >
                          {year && (
                            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-text-3">{year}</p>
                          )}
                          <h2 className="mt-1 font-serif text-[clamp(1.6rem,2.5vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
                            {artwork.title}
                          </h2>
                        </div>
                      </div>
                    </ArtworkTransition>
                  </ArtFrame>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
