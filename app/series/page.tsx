'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ARTWORKS, SERIES, type SeriesName } from '@/lib/artworks'
import { blurProps } from '@/lib/blurPlaceholders'
import { Footer } from '@/components/Footer'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

function SeriesSection({ name, description }: { name: SeriesName; description: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const works = ARTWORKS.filter((artwork) => artwork.series === name)
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

      {/* Horizontal scroll rail */}
      <div
        className="mt-10 flex gap-6 overflow-x-auto pb-4 lg:mt-0 lg:flex-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        aria-label={`${name} paintings`}
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
                  {...blurProps(artwork.slug)}
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

export default function SeriesPage() {
  const entries = Object.entries(SERIES) as Array<[SeriesName, { description: string }]>

  return (
    <div className="page-enter">
      <section className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Series</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.64fr] lg:items-end">
          <h1 className="font-serif text-[clamp(4rem,10vw,11rem)] leading-[0.78] tracking-[-0.085em]">
            Bodies of work.
          </h1>
          <p className="max-w-[38rem] font-mono text-[0.86rem] leading-8 text-text-2">
            A way through the paintings by subject, atmosphere, and repeated pressure. The categories stay loose because the work crosses them.
          </p>
        </div>
      </section>

      <section className="section-pad site-shell !py-0">
        {entries.map(([name, info]) => (
          <SeriesSection key={name} name={name} description={info.description} />
        ))}
      </section>

      <Footer />
    </div>
  )
}
