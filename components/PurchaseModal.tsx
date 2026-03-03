'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Artwork } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { useFocusTrap } from '@/lib/useFocusTrap'

export function PurchaseModal({ art, onClose }: { art: Artwork; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const slug = art.filename.replace('.jpg', '')

  useFocusTrap(containerRef)

  useEffect(() => {
    document.body.classList.add('modal-open')
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') }
  }, [onClose])

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: art.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Failed to create checkout session')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-label={`Purchase ${art.title}`} className="modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[540px] overflow-y-auto max-h-[90vh] animate-scale-in"
        style={{ background: '#0d0c10', border: '1px solid #1e1c24' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-9 py-7 border-b border-[#1e1c24] flex justify-between items-start">
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-ember mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>Purchase Original</p>
            <h2 className="text-[28px] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>Secure this work</h2>
          </div>
          <button ref={closeBtn} onClick={onClose} className="text-text-3 hover:text-text text-xl leading-none ml-6 mt-1 transition-colors" aria-label="Close">✕</button>
        </div>

        <div className="px-9 py-7">
          {/* Artwork summary */}
          <div className="flex gap-5 mb-7 pb-7 border-b border-[#1e1c24]">
            <Image
              src={`/paintings/${art.filename}`}
              alt={art.title}
              width={80} height={100}
              className="object-cover flex-shrink-0"
              style={{ filter: 'brightness(0.9)' }}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDERS[slug]}
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-[22px] font-light mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>{art.title}</h3>
              <p className="text-[9px] tracking-[0.1em] uppercase text-text-2 mb-3" style={{ fontFamily: 'var(--font-jetbrains)' }}>{art.medium} / {art.year}</p>
              <p className="text-[28px] font-light text-ember leading-none" style={{ fontFamily: 'var(--font-cormorant)' }}>AUD {art.price.toLocaleString()}</p>
            </div>
          </div>

          {[
            ['Dimensions', art.dimensions],
            ['Provenance', 'One of one — original only'],
            ['Delivery', 'Free AU shipping · International available'],
            ['Certificate', 'Included with every purchase'],
          ].map(([k, v]) => (
            <div key={k} className="info-row">
              <span className="info-key">{k}</span>
              <span className="info-val text-right text-[12px]">{v}</span>
            </div>
          ))}

          <div
            className="mt-5 mb-6 p-4 border border-[#1e1c24] text-[12px] text-text-2 leading-[1.65]"
            style={{ background: '#131118', fontFamily: 'var(--font-jetbrains)' }}
          >
            <strong className="text-text font-normal">Secure checkout:</strong> You will be redirected to Stripe to complete your payment. Shipping address and payment details are collected securely by Stripe.
          </div>

          {error && (
            <p className="mb-4 text-[12px] text-red-400" style={{ fontFamily: 'var(--font-jetbrains)' }}>{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-ember btn-full mt-2 disabled:opacity-60"
          >
            {loading ? 'Redirecting to Stripe…' : 'Proceed to Secure Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
