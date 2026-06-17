'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'

// ─── Types ───────────────────────────────────────────────────────────────────
type Depth = 1 | 2 | 3

interface Placement {
  x: number   // % from section left edge (can be negative — partial clip)
  y: number   // % from section top edge (can be negative)
  rot: number // initial rotation in degrees
  depth: Depth // 1=far (slow/dim), 2=mid, 3=near (fast/bright)
  w: number   // card width in px
}

// ─── Scatter layout ───────────────────────────────────────────────────────────
// Seven positions carefully arranged like paintings on a studio floor viewed from above.
// Negative x/y values intentionally clip cards at edges — creates depth/mystery.
const PLACEMENTS: Placement[] = [
  { x:  2, y:  4, rot: -7.2, depth: 3, w: 296 },  // near, top-left, large
  { x: 40, y: -9, rot:  4.8, depth: 1, w: 218 },  // far, top-center, small (clipped top)
  { x: 67, y:  7, rot: -2.5, depth: 2, w: 262 },  // mid, top-right
  { x: -7, y: 48, rot: 11.5, depth: 1, w: 228 },  // far, mid-left (clipped left)
  { x: 50, y: 44, rot: -8.8, depth: 3, w: 286 },  // near, center, large
  { x: 82, y: 30, rot:  3.2, depth: 2, w: 252 },  // mid, right
  { x: 30, y: 72, rot: -4.5, depth: 1, w: 238 },  // far, lower-center
]

// Parallax travel distance per depth level (±px over full mouse traverse)
const PARALLAX: Record<Depth, number> = { 1: 10, 2: 22, 3: 38 }
// Base opacity per depth (far = dimmer, near = full)
const BASE_OPACITY: Record<Depth, number> = { 1: 0.76, 2: 0.91, 3: 1.0 }
// Staggered float animation delays
const FLOAT_DELAYS = [0, 0.35, 0.7, 0.18, 0.55, 0.9, 0.28]

// ─── Artwork Card ─────────────────────────────────────────────────────────────
interface CardProps {
  artwork: Artwork
  placement: Placement
  floatDelay: number
  smoothX: MotionValue<number>
  smoothY: MotionValue<number>
  isSelected: boolean
  anySelected: boolean
  onSelect: () => void
}

function ArtworkCard({
  artwork, placement, floatDelay,
  smoothX, smoothY,
  isSelected, anySelected, onSelect,
}: CardProps) {
  const [hovered, setHovered] = useState(false)

  const strength = PARALLAX[placement.depth]
  const px = useTransform(smoothX, [0, 1], [-strength, strength])
  const py = useTransform(smoothY, [0, 1], [-strength * 0.55, strength * 0.55])

  const isDimmed = anySelected && !isSelected
  const aspectH = Math.round(placement.w * 1.28) // ~portrait aspect
  const blur = BLUR_PLACEHOLDERS[artwork.slug]

  return (
    <motion.div
      className="absolute select-none"
      style={{
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: placement.w,
        x: px,
        y: py,
        zIndex: isSelected ? 40 : hovered ? 20 : placement.depth * 4,
      }}
    >
      <motion.div
        animate={{
          scale: isSelected ? 1.02 : hovered ? 1.05 : 1,
          rotate: hovered || isSelected ? 0 : placement.rot,
          opacity: isDimmed ? 0.12 : BASE_OPACITY[placement.depth],
          filter: isDimmed
            ? 'blur(5px) brightness(0.35)'
            : placement.depth === 1
            ? 'blur(0.3px)'
            : 'blur(0px)',
        }}
        transition={{
          scale: { type: 'spring', stiffness: 260, damping: 28 },
          rotate: { type: 'spring', stiffness: 180, damping: 32 },
          opacity: { duration: 0.38 },
          filter: { duration: 0.38 },
        }}
        whileTap={{ scale: 0.96 }}
        onClick={onSelect}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${artwork.title}, ${artwork.year}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        style={{ cursor: 'none', transformOrigin: 'center center' }}
      >
        {/* Physical card with frame effect */}
        <motion.div
          className="relative overflow-hidden"
          animate={{
            boxShadow: isSelected
              ? '0 40px 90px rgba(0,0,0,0.92), 0 0 32px rgba(200,87,10,0.14)'
              : hovered
              ? '0 30px 68px rgba(0,0,0,0.85), 0 8px 22px rgba(0,0,0,0.5)'
              : '0 5px 26px rgba(0,0,0,0.54)',
          }}
          transition={{ duration: 0.42 }}
        >
          {/* Inner frame vignette */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 32px rgba(0,0,0,0.28)',
            }}
            aria-hidden
          />

          <Image
            src={`/paintings/${artwork.filename}`}
            alt={`${artwork.title} — Harry Ferraro, ${artwork.year}`}
            width={placement.w}
            height={aspectH}
            className="block object-cover"
            sizes={`${placement.w}px`}
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blur}
            style={{
              transition: 'filter 0.38s, transform 0.6s',
              filter: `brightness(${hovered || isSelected ? 1 : 0.83}) saturate(${hovered || isSelected ? 1.08 : 0.86})`,
              transform: hovered ? 'scale(1.025)' : 'scale(1)',
            }}
          />

          {/* Gradient hover overlay */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col justify-end"
            style={{
              background:
                'linear-gradient(to top, rgba(5,4,14,0.96) 0%, rgba(5,4,14,0.3) 42%, transparent 65%)',
            }}
            animate={{ opacity: hovered || isSelected ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            <div className="p-[18px]">
              <p className="text-[8.5px] tracking-[0.24em] uppercase text-ember font-mono mb-[5px]">
                {artwork.series}
              </p>
              <p
                className="font-serif font-light text-text"
                style={{ fontSize: 18, lineHeight: 1.08 }}
              >
                {artwork.title}
              </p>
              <div className="flex items-center gap-3 mt-[5px]">
                <p className="text-[10px] text-text-3 font-mono">{artwork.year}</p>
                {artwork.status === 'available' && (
                  <span className="text-[8px] tracking-widest text-ember font-mono uppercase">
                    Available
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Available dot */}
          {artwork.status === 'available' && !hovered && !isSelected && (
            <div
              className="absolute top-3 right-3 z-30 w-[7px] h-[7px] rounded-full bg-ember"
              aria-hidden
            />
          )}

          {/* Selection underline indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                key="sel"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-ember z-30 origin-left"
                aria-hidden
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
interface DetailPanelProps {
  artwork: Artwork
  onClose: () => void
  onBuy: (a: Artwork) => void
  onInquire: (a: Artwork) => void
}

function DetailPanel({ artwork, onClose, onBuy, onInquire }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const blur = BLUR_PLACEHOLDERS[artwork.slug]

  // Escape key closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus panel on mount for a11y
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <motion.aside
      ref={panelRef}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 0.9 }}
      className="absolute right-0 top-0 h-full overflow-y-auto z-50"
      style={{
        width: 'min(420px, 100vw)',
        background: 'rgba(18, 16, 26, 0.97)',
        backdropFilter: 'blur(28px)',
        borderLeft: '1px solid rgba(56,53,74,0.65)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${artwork.title} — artwork details`}
      tabIndex={-1}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center text-text-3 hover:text-text transition-colors"
        aria-label="Close detail panel"
        style={{ cursor: 'none' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="p-7 pb-12">
        {/* Series label */}
        <div className="flex items-center gap-3 mb-5 pt-7">
          <span className="inline-block w-6 h-px bg-ember-3" aria-hidden />
          <span className="text-[8.5px] tracking-[0.28em] uppercase text-ember font-mono">
            {artwork.series} Series
          </span>
        </div>

        {/* Title + year */}
        <h2
          className="font-serif font-light text-text mb-1.5"
          style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', lineHeight: 1.05 }}
        >
          {artwork.title}
        </h2>
        <p className="text-[11px] text-text-3 font-mono mb-6">{artwork.year}</p>

        {/* Artwork image in panel */}
        <div
          className="relative overflow-hidden mb-6"
          style={{ aspectRatio: '4/5', background: 'var(--surface)' }}
        >
          <Image
            src={`/paintings/${artwork.filename}`}
            alt={`${artwork.title} by Harry Ferraro`}
            fill
            className="object-cover"
            sizes="420px"
            placeholder={blur ? 'blur' : 'empty'}
            blurDataURL={blur}
          />
          {artwork.status === 'sold' && (
            <div
              className="absolute bottom-3 left-3 badge badge-sold"
              aria-label="Sold"
            >
              Sold
            </div>
          )}
        </div>

        {/* Medium + dimensions */}
        <div className="border-l-2 border-ember-3 pl-4 mb-6 space-y-[5px]">
          <p className="text-[11.5px] text-text-2 font-mono">{artwork.medium}</p>
          <p className="text-[11px] text-text-3 font-mono">{artwork.dimensions}</p>
        </div>

        {/* Artist statement */}
        {artwork.statement && (
          <blockquote
            className="font-serif italic text-text-2 leading-[1.68] mb-8"
            style={{ fontSize: 15 }}
          >
            "{artwork.statement}"
          </blockquote>
        )}

        {/* Price + actions */}
        <div className="pt-5 border-t border-border">
          {artwork.status === 'available' ? (
            <>
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-[9px] tracking-widest uppercase text-text-3 font-mono">
                  Original work
                </span>
                <span className="font-mono text-text" style={{ fontSize: 17 }}>
                  AUD {artwork.price.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  onClick={() => onBuy(artwork)}
                  className="btn-ember"
                  style={{ cursor: 'none', padding: '14px 16px', fontSize: '9.5px' }}
                >
                  Purchase
                </button>
                <button
                  onClick={() => onInquire(artwork)}
                  className="btn-ghost"
                  style={{ cursor: 'none', padding: '13px 16px', fontSize: '9.5px' }}
                >
                  Inquire
                </button>
              </div>
              <p className="text-[9px] text-text-3 font-mono text-center mb-4">
                Ships worldwide · Certificate of authenticity included
              </p>
            </>
          ) : (
            <div className="mb-4">
              <p className="text-[11.5px] text-text-3 font-mono italic mb-5 text-center">
                This work has found a home.
              </p>
              <button
                onClick={() => onInquire(artwork)}
                className="btn-ghost w-full"
                style={{ cursor: 'none', padding: '13px 16px', fontSize: '9.5px' }}
              >
                Inquire About Similar
              </button>
            </div>
          )}
          <Link
            href={`/gallery/${artwork.slug}`}
            className="block text-center text-[9px] tracking-[0.18em] uppercase text-text-3 font-mono mt-4 hover:text-ember transition-colors"
            style={{ cursor: 'none' }}
          >
            View full details →
          </Link>
        </div>
      </div>
    </motion.aside>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────
interface InteractiveCanvasProps {
  artworks: Artwork[]
  onBuy: (a: Artwork) => void
  onInquire: (a: Artwork) => void
}

export function InteractiveCanvas({ artworks, onBuy, onInquire }: InteractiveCanvasProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [cursorInside, setCursorInside] = useState(false)

  // Normalised mouse position: 0 = left/top edge, 1 = right/bottom edge
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const smoothX = useSpring(rawX, { stiffness: 36, damping: 28, mass: 0.9 })
  const smoothY = useSpring(rawY, { stiffness: 36, damping: 28, mass: 0.9 })

  // Ambient ember glow that follows cursor (like a lamp shining on the work)
  const glowX = useTransform(smoothX, [0, 1], ['22%', '78%'])
  const glowY = useTransform(smoothY, [0, 1], ['18%', '82%'])
  const ambientGlow = useMotionTemplate`radial-gradient(ellipse 58% 58% at ${glowX} ${glowY}, rgba(200,87,10,0.065) 0%, transparent 65%)`

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      rawX.set(e.clientX / rect.width)
      rawY.set((e.clientY - rect.top) / rect.height)
    },
    [rawX, rawY],
  )

  const handleMouseLeave = useCallback(() => {
    setCursorInside(false)
    rawX.set(0.5)
    rawY.set(0.5)
  }, [rawX, rawY])

  const selectedArtwork = artworks.find((a) => a.slug === selectedSlug) ?? null

  const toggleSelect = useCallback((slug: string) => {
    setSelectedSlug((prev) => (prev === slug ? null : slug))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '100svh', minHeight: 640 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorInside(true)}
      onMouseLeave={handleMouseLeave}
      aria-label="Interactive artwork collection — hover to preview, click to explore details"
    >
      {/* ── Section header (overlaid, non-interactive) ── */}
      <div
        className="absolute top-0 left-0 z-10 px-[52px] pt-[92px] max-md:px-6 max-md:pt-16 pointer-events-none"
        aria-hidden
      >
        <p className="eyebrow mb-4">The Collection</p>
        <h2
          className="font-serif font-light text-text"
          style={{ fontSize: 'clamp(30px, 4.5vw, 62px)', lineHeight: 1 }}
        >
          Selected Works
        </h2>
      </div>

      {/* ── Ambient mouse-tracking glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: ambientGlow }}
        aria-hidden
      />

      {/* ── Artwork cards canvas ── */}
      <div className="absolute inset-0">
        {artworks.map((artwork, i) => {
          const placement = PLACEMENTS[i % PLACEMENTS.length]
          return (
            <ArtworkCard
              key={artwork.slug}
              artwork={artwork}
              placement={placement}
              floatDelay={FLOAT_DELAYS[i % FLOAT_DELAYS.length]}
              smoothX={smoothX}
              smoothY={smoothY}
              isSelected={selectedSlug === artwork.slug}
              anySelected={selectedSlug !== null}
              onSelect={() => toggleSelect(artwork.slug)}
            />
          )
        })}
      </div>

      {/* ── Dim overlay when an artwork is selected ── */}
      <AnimatePresence>
        {selectedSlug && (
          <motion.div
            key="dim-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30"
            style={{
              background: 'rgba(6, 4, 16, 0.82)',
              backdropFilter: 'blur(1.5px)',
            }}
            onClick={() => setSelectedSlug(null)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Slide-in detail panel ── */}
      <AnimatePresence>
        {selectedArtwork && (
          <DetailPanel
            key={selectedArtwork.slug}
            artwork={selectedArtwork}
            onClose={() => setSelectedSlug(null)}
            onBuy={(a) => {
              setSelectedSlug(null)
              onBuy(a)
            }}
            onInquire={(a) => {
              setSelectedSlug(null)
              onInquire(a)
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Exploration hint ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        animate={{ opacity: selectedSlug ? 0 : cursorInside ? 0.35 : 0.7 }}
        transition={{ duration: 0.5 }}
        aria-hidden
      >
        <p className="text-[8.5px] tracking-[0.28em] uppercase text-text-3 font-mono whitespace-nowrap">
          Move to explore — click to discover
        </p>
      </motion.div>

      {/* ── View all link (bottom right) ── */}
      <div className="absolute bottom-8 right-[52px] z-10 max-md:right-6">
        <Link
          href="/gallery"
          className="font-mono text-[9px] tracking-[0.18em] uppercase text-text-3 hover:text-ember transition-colors flex items-center gap-2"
          style={{ cursor: 'none' }}
        >
          View All Works →
        </Link>
      </div>
    </section>
  )
}
