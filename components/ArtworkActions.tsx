'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'
import { InquireModal } from '@/components/InquireModal'

export function ArtworkActions({ art }: { art: Artwork }) {
  const [inqOpen, setInqOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-2">
        {art.status === 'available' ? (
          <button className="btn-ember btn-full" onClick={() => setInqOpen(true)}>
            Enquire About This Work
          </button>
        ) : (
          <>
            <button className="btn-ghost btn-full" onClick={() => setInqOpen(true)}>
              Enquire About a Similar Work
            </button>
            <Link href="/commissions" className="btn-ember btn-full text-center">
              Commission Something New
            </Link>
          </>
        )}
      </div>

      {inqOpen && <InquireModal art={art} onClose={() => setInqOpen(false)} />}
    </>
  )
}
