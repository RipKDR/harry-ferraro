'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Artwork } from '@/lib/artworks'
import { blurProps } from '@/lib/blurPlaceholders'
import { ArtFrame } from '@/components/ArtFrame'
import { Lightbox } from '@/components/Lightbox'

/**
 * Detail-page presentation for a single painting. The canvas is never cropped:
 * it sits object-contain on a stage whose ambience comes from a blurred,
 * dimmed copy of the same painting. Activating the stage opens the lightbox.
 */
export function ArtworkStage({ artwork }: { artwork: Artwork }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <ArtFrame className="h-full">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block h-full w-full cursor-zoom-in"
          aria-haspopup="dialog"
          aria-label={`View ${artwork.title} full screen`}
        >
          <Image
            src={artwork.image}
            alt=""
            aria-hidden
            fill
            sizes="(max-width:1024px) 100vw, 58vw"
            className="scale-110 object-cover opacity-45 blur-2xl saturate-[.55]"
          />
          <div className="absolute inset-0 bg-[rgba(8,7,6,0.52)]" />
          <Image
            src={artwork.image}
            alt={artwork.alt}
            fill
            priority
            {...blurProps(artwork.slug)}
            className="object-contain p-[clamp(1.25rem,3.5vw,3.5rem)] transition-transform duration-700 ease-out md:group-hover:scale-[1.01]"
            sizes="(max-width:1024px) 100vw, 58vw"
          />
          <span className="pointer-events-none absolute bottom-4 right-5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-text-3 transition-colors duration-200 group-hover:text-text-2">
            View full screen +
          </span>
        </button>
      </ArtFrame>

      {open && <Lightbox art={artwork} onClose={close} />}
    </>
  )
}
