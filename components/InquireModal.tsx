'use client'

import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'

export function InquireModal({ art, onClose }: { art: Artwork; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={`Ask about ${art.title}`} className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-sheet-header">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-oxide">Artwork enquiry</p>
            <h2 className="mt-2 font-serif text-[2.4rem] leading-none tracking-[-0.045em]">{art.title}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-sheet-body">
          <p className="mb-6 font-mono text-[0.82rem] leading-7 text-text-2">Send a direct enquiry about this piece, a studio visit, or a related commission idea.</p>
          <Link href={`/commissions?artwork=${encodeURIComponent(art.slug)}`} className="btn-ink btn-full text-center">Open enquiry form</Link>
        </div>
      </div>
    </div>
  )
}
