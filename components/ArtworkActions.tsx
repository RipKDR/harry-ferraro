'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'
import { PurchaseModal } from '@/components/PurchaseModal'
import { InquireModal } from '@/components/InquireModal'

export function ArtworkActions({ art }: { art: Artwork }) {
  const [buyOpen, setBuyOpen] = useState(false)
  const [inqOpen, setInqOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2">
        {art.status === 'available' ? (
          <>
            <button
              className="btn-ember btn-full"
              onClick={() => setBuyOpen(true)}
            >
              Purchase Original
            </button>
            <button
              className="btn-ghost btn-full"
              onClick={() => setInqOpen(true)}
            >
              Inquire About This Work
            </button>
          </>
        ) : (
          <Link
            href="/commissions"
            className="btn-ember btn-full text-center"
          >
            Commission a Similar Work
          </Link>
        )}
      </div>

      {buyOpen && (
        <PurchaseModal art={art} onClose={() => setBuyOpen(false)} />
      )}
      {inqOpen && (
        <InquireModal art={art} onClose={() => setInqOpen(false)} />
      )}
    </>
  )
}
