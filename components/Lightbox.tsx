'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Artwork } from '@/lib/artworks'
import { useFocusTrap } from '@/lib/useFocusTrap'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

type LightboxProps = {
  art: Artwork
  all?: Artwork[]
  onClose: () => void
  onNav?: (dir: -1 | 1) => void
  onJumpTo?: (index: number) => void
  onBuy?: (art: Artwork) => void
  onInquire?: (art: Artwork) => void
}

export function Lightbox({ art, all, onClose, onNav }: LightboxProps) {
  const reduce = useReducedMotion()
  const hasNav = Boolean(onNav && all && all.length > 1)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useFocusTrap(dialogRef)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (!hasNav || !onNav) return
      if (event.key === 'ArrowLeft') onNav(-1)
      if (event.key === 'ArrowRight') onNav(1)
    },
    [onClose, onNav, hasNav]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [handleKey])

  // Portal to <body>: ancestors with position:sticky create stacking contexts
  // that would otherwise trap this fixed overlay beneath the nav.
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={art.title}
        onClick={onClose}
        className="fixed inset-0 z-[700] flex items-center justify-center bg-black p-4 sm:p-8"
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE_EXPO }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 font-mono text-[0.9rem] text-text-2 transition-colors hover:text-text"
        >
          ✕
        </button>

        {hasNav && (
          <>
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); onNav?.(-1) }}
              aria-label="Previous painting"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 px-3 py-2 font-mono text-[1.2rem] text-text-3 transition-colors hover:text-text"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); onNav?.(1) }}
              aria-label="Next painting"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 px-3 py-2 font-mono text-[1.2rem] text-text-3 transition-colors hover:text-text"
            >
              →
            </button>
          </>
        )}

        <motion.div
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-full max-w-full flex-col items-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.32, ease: EASE_EXPO }}
        >
          <Image
            src={art.image}
            alt={art.alt}
            width={art.imageWidth}
            height={art.imageHeight}
            priority
            className="max-h-[82vh] w-auto max-w-full object-contain"
            sizes="90vw"
          />
          <div className="mt-5 flex w-full items-center justify-center gap-4 px-2 text-center">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-3">{art.series}</p>
            <span aria-hidden="true" className="text-text-3">·</span>
            <Link
              href={`/gallery/${art.slug}`}
              onClick={(event) => event.stopPropagation()}
              className="font-serif text-[1.4rem] leading-none tracking-[-0.03em] text-text transition-colors hover:text-oxide"
            >
              {art.title}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
