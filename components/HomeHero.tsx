'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import type { Artwork } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'

type HomeHeroProps = {
  hero: Artwork
  positioning: string
  intro: string
}

const heroEase = [0.32, 0.72, 0, 1] as const

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.04 },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: heroEase },
  },
}

const titleItem = {
  hidden: { opacity: 0.15, clipPath: 'inset(100% 0% 0% 0%)' },
  show: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.45, ease: heroEase },
  },
}

export function HomeHero({ hero, positioning, intro }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -42])
  const copyOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.42])
  const scrollImageY = useTransform(scrollYProgress, [0, 1], [0, -48])
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.02])

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 140, damping: 26, mass: 0.35 })
  const springY = useSpring(pointerY, { stiffness: 140, damping: 26, mass: 0.35 })
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-20, 20])
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-14, 14])
  const imageY = useTransform([parallaxY, scrollImageY], ([py, sy]) => (py as number) + (sy as number))

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }, [pointerX, pointerY])

  const onPointerLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="site-shell relative min-h-[100dvh] overflow-hidden border-b border-[var(--border)]"
      aria-label="Hero"
    >
      <div className="hero-orb hero-orb-a" aria-hidden="true" />
      <div className="hero-orb hero-orb-b" aria-hidden="true" />
      <div className="hero-sweep" aria-hidden="true" />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
        <ArtFrame className="absolute inset-3 md:inset-5 lg:inset-6 lg:left-0">
          <div className="hero-image-stage relative h-full min-h-[72vh] lg:min-h-full">
            <motion.div className="absolute inset-0" style={{ x: parallaxX, y: imageY, scale: scrollScale }}>
              <div className="hero-kenburns absolute inset-[-12%]">
                <Image
                  src={hero.image}
                  alt={hero.alt}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 62vw"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 17%',
                    filter: 'brightness(0.68) contrast(1.2) saturate(0.74)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </ArtFrame>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgba(8,7,6,.94)_28%,rgba(8,7,6,.18)_58%,rgba(8,7,6,.76)_100%)]" />
      </div>

      <motion.div
        className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-14 pt-36 md:px-12 lg:w-[64%] lg:px-[4.5rem] lg:pb-20"
        style={{ y: reduceMotion ? 0 : copyY, opacity: reduceMotion ? 1 : copyOpacity }}
      >
        <motion.div variants={reduceMotion ? undefined : heroContainer} initial="hidden" animate="show">
          <motion.p variants={reduceMotion ? undefined : heroItem} className="mb-8 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-oxide">
            Melbourne · oil on canvas
          </motion.p>
          <motion.h1
            variants={reduceMotion ? undefined : titleItem}
            className="max-w-[64rem] font-serif text-[clamp(4.8rem,13vw,14rem)] font-light leading-[0.76] tracking-[-0.085em]"
          >
            Harrison<br />Ferraro
          </motion.h1>
          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="mt-9 max-w-[49rem] font-serif text-[clamp(1.9rem,3.9vw,4.6rem)] leading-[0.94] tracking-[-0.055em] text-[#eee3d5]"
          >
            {positioning}
          </motion.p>
          <motion.p variants={reduceMotion ? undefined : heroItem} className="mt-7 max-w-[35rem] font-mono text-[0.88rem] leading-8 text-text-2">
            {intro}
          </motion.p>
          <motion.div variants={reduceMotion ? undefined : heroItem} className="mt-10 flex flex-wrap gap-3">
            <Link href="/gallery" className="btn-ink">See the paintings</Link>
            <Link href="/who-i-am" className="btn-line">Who I am</Link>
          </motion.div>
          <motion.p variants={reduceMotion ? undefined : heroItem} className="mt-14 font-mono text-[0.58rem] uppercase tracking-[0.34em] text-text-3">
            Scroll
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  )
}