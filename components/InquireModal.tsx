'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Artwork } from '@/lib/artworks'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

export function InquireModal({ art, onClose, open = true }: { art: Artwork; onClose: () => void; open?: boolean }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Ask about ${art.title}`}
          className="fixed inset-0 z-[700] flex items-end justify-center bg-[rgba(8,7,6,0.88)] backdrop-blur-md sm:items-center sm:p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_EXPO }}
        >
          <motion.div
            className="w-full max-h-[90vh] overflow-auto rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_120px_rgba(0,0,0,.55)] sm:max-w-xl sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-6">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-oxide">Artwork enquiry</p>
                <h2 className="mt-2 font-serif text-[2.4rem] leading-none tracking-[-0.045em]">{art.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center text-2xl text-text-2 transition-colors hover:text-oxide"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="mb-6 font-mono text-[0.82rem] leading-7 text-text-2">Send a direct enquiry about this piece, a studio visit, or a related commission idea.</p>
              <Link href={`/commissions?artwork=${encodeURIComponent(art.slug)}`} className="btn-ink btn-full text-center">Open enquiry form</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
