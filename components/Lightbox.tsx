'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Artwork } from '@/lib/artworks'

type LightboxProps = {
  art: Artwork
  all: Artwork[]
  onClose: () => void
  onNav?: (dir: -1 | 1) => void
  onJumpTo?: (index: number) => void
  onBuy?: (art: Artwork) => void
  onInquire?: (art: Artwork) => void
}

export function Lightbox({ art, onClose }: LightboxProps) {
  return (
    <div role="dialog" aria-modal="true" aria-label={art.title} className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-sheet-header">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-oxide">Painting</p>
            <h2 className="mt-2 font-serif text-[2.4rem] leading-none tracking-[-0.045em]">{art.title}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-sheet-body">
          <Image src={art.image} alt={art.alt} width={700} height={900} className="mb-6 h-auto w-full" />
          <p className="mb-6 font-mono text-[0.82rem] leading-7 text-text-2">{art.description}</p>
          <Link href={`/gallery/${art.slug}`} className="btn-ink btn-full text-center">Open artwork page</Link>
        </div>
      </div>
    </div>
  )
}
