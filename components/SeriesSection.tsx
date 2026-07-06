'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { Artwork, SeriesName } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

type SeriesSectionProps = {
  name: SeriesName
  description: string
  works: Artwork[]
}

export function SeriesSection({ name, description, works }: SeriesSectionProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  if (works.length === 0) return null

  const titleInitial = reduce ? false : { clipPath: 'inset(100% 0 0 0)', opacity: 0.2 }
  const titleAnimate = reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }

  return (
    <div ref={ref} className="border-b border-[var(--border)] py-[clamp(3.5rem,7vw,7rem)] lg:flex lg:items-start lg:gap-16">
      {/* Sticky title column on desktop */}
      <div className="lg:sticky lg:top-24 lg:w-[280px] lg:shrink-0 lg:self-start">
        <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-oxide">
          {works.length} work{works.length === 1 ? '' : 's'}
        </p>
        <motion.h2
          initial={titleInitial}
          animate={inView ? titleAnimate : titleInitial}
          transition={{ duration: 1, ease: EASE_EXPO }}
          className="font-serif text-[clamp(3.2rem,6vw,8rem)] leading-[0.84] tracking-[-0.07em]"
        >
          {name}
        </motion.h2>
        <p className="mt-6 max-w-[24rem] font-mono text-[0.84rem] leading-7 text-text-2">{description}</p>
      </div>

      {/* Horizontal scroll rail — focusable so keyboard users can scroll it */}
      <div
        className="mt-10 flex gap-6 overflow-x-auto pb-4 lg:mt-0 lg:flex-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        role="group"
        aria-label={`${name} paintings`}
        tabIndex={0}
      >
        {works.map((artwork, index) => (
          <motion.div
            key={artwork.slug}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={inView ? (reduce ? undefined : { opacity: 1, y: 0 }) : reduce ? undefined : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 0.2 + index * 0.09 }}
            className="shrink-0"
            style={{ scrollSnapAlign: 'start', width: 'min(72vw, 380px)' }}
          >
            <Link href={`/gallery/${artwork.slug}`} className="work-tile group block">
              <div className="relative overflow-hidden bg-[#050403]" style={{ aspectRatio: '3 / 4' }}>
                <Image
                  src={artwork.image}
                  alt={artwork.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDERS[artwork.slug]}
                  className="art-image object-cover"
                  sizes="(max-width:1024px) 72vw, 380px"
                />
              </div>
              <h3 className="mt-4 font-serif text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none tracking-[-0.04em]">
                {artwork.title}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
