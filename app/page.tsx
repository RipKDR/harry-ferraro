'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES, priceLabel } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { Marquee } from '@/components/Marquee'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { InquireModal } from '@/components/InquireModal'
import { SITE, SOCIAL } from '@/lib/site'
import type { Artwork } from '@/lib/artworks'

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => { setOut(true); setTimeout(onDone, 600) }, reduce ? 200 : 1200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center gap-6"
      style={{
        background: '#0b0a09',
        transition: 'opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)',
        opacity: out ? 0 : 1,
        transform: out ? 'translateY(-14px)' : 'none',
        pointerEvents: out ? 'none' : 'all',
      }}
      aria-hidden
    >
      <h1
        className="splash-logo font-serif font-light tracking-[-0.01em]"
        style={{ fontSize: 'clamp(36px,7vw,72px)' }}
      >
        Harrison Ferraro<span className="text-ember">.</span>
      </h1>
      <span
        className="splash-sub text-[10px] tracking-[0.32em] uppercase text-text-3 font-mono"
      >
        Original Fine Art · Melbourne
      </span>
    </div>
  )
}

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false)
  const [lb, setLb] = useState<Artwork | null>(null)
  const [inqModal, setInqModal] = useState<Artwork | null>(null)

  const featured = ARTWORKS.filter((a) => a.featured).slice(0, 5)

  return (
    <>
      <SplashScreen onDone={() => setSplashDone(true)} />

      <div style={{ opacity: splashDone ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}>

        {/* ─── HERO — work first, quiet split ─── */}
        <section
          className="relative min-h-screen flex items-center px-[clamp(20px,5vw,80px)] pt-[140px] pb-[88px]"
          aria-label="Introduction"
        >
          <div className="w-full grid grid-cols-[1.05fr_0.95fr] gap-[clamp(40px,6vw,104px)] items-center max-lg:grid-cols-1 max-lg:gap-12">
            {/* Identity */}
            <div style={{ animation: 'fadeUp 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
              <div className="eyebrow mb-8">Original Fine Art · Melbourne</div>
              <h1
                className="font-serif leading-[0.9] tracking-[-0.02em] mb-9"
                style={{ fontSize: 'clamp(52px,8.5vw,112px)', fontWeight: 400 }}
              >
                Harrison<br />Ferraro<span className="text-ember">.</span>
              </h1>
              <p className="font-sans text-[16px] text-text-2 leading-[1.65] max-w-[440px] mb-11">
                Figurative oil paintings that live in the space between tension and release —
                dark, expressive, and made to be lived with.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/gallery" className="btn-ember">View the Work</Link>
                <Link href="/commissions" className="btn-ghost">Commission a Piece</Link>
                <a href={SOCIAL.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">Instagram</a>
              </div>
            </div>

            {/* The work, shown truthfully with a caption */}
            <figure
              className="relative max-lg:order-first"
              style={{ animation: 'fadeUp 1.3s cubic-bezier(0.16,1,0.3,1) 0.28s both' }}
            >
              <div className="relative w-full overflow-hidden bg-surface" style={{ aspectRatio: '4 / 5' }}>
                <Image
                  src="/paintings/ignition-ii.jpg"
                  alt="Ignition II — Harrison Ferraro, 2024. Oil & mixed media on canvas."
                  fill priority
                  className="object-cover"
                  style={{ objectPosition: 'center 14%' }}
                  sizes="(max-width:1024px) 100vw, 46vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDERS['ignition-ii']}
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 font-sans text-[12.5px] text-text-3">
                <span className="text-text-2">Ignition II</span>
                <span>2024 · Oil &amp; mixed media</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <Marquee />

        {/* ─── STUDIO FACTS (no fabricated numbers) ─── */}
        <div className="grid grid-cols-3 border-b border-[#2a2622] max-sm:grid-cols-1" role="list" aria-label="About the work">
          {[
            ['Original Works', 'One of one — no prints, no editions'],
            ['Oil & Mixed Media', 'Figurative painting on canvas'],
            ['Commissions Open', 'Custom work by enquiry'],
          ].map(([title, sub]) => (
            <div
              key={title}
              role="listitem"
              className="px-12 py-[52px] border-r border-[#2a2622] last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0"
            >
              <div className="font-serif font-light text-text mb-2.5" style={{ fontSize: '30px' }}>{title}</div>
              <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-text-3">{sub}</div>
            </div>
          ))}
        </div>

        {/* ─── SELECTED WORKS ─── */}
        <section className="px-[52px] py-[100px] max-md:px-6" aria-label="Selected works">
          <Reveal>
            <div className="flex justify-between items-baseline mb-[52px]">
              <h2 className="font-serif font-light" style={{ fontSize: 'clamp(28px,4vw,54px)' }}>Selected Works</h2>
              <Link href="/gallery" className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ember hover:gap-4 flex items-center gap-2 transition-all">
                View All →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-[5px]" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
              {/* Main */}
              <button
                className="feat-card text-left"
                style={{ minHeight: '60vh' }}
                onClick={() => setLb(featured[0])}
                aria-label={`View ${featured[0].title}`}
              >
                <Image
                  src={`/paintings/${featured[0].filename}`}
                  alt={`${featured[0].title} by Harrison Ferraro`}
                  fill className="object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  sizes="(max-width:768px) 100vw, 55vw"
                  placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[featured[0].slug]}
                />
                <div className="feat-card-overlay">
                  <div className="feat-card-info">
                    <div className="font-serif text-[20px] font-light mb-1.5">{featured[0].title}</div>
                    <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-text-2 mb-2">{featured[0].medium} / {featured[0].year}</div>
                    <div className="font-mono text-[10px] tracking-[0.08em] text-ember">{priceLabel(featured[0])}</div>
                  </div>
                </div>
              </button>

              {/* 2×2 */}
              <div className="grid grid-rows-2 grid-cols-2 gap-[5px] max-md:grid-rows-none max-md:grid-cols-2">
                {featured.slice(1, 5).map((art) => (
                  <button
                    key={art.id}
                    className="feat-card relative text-left"
                    onClick={() => setLb(art)}
                    aria-label={`View ${art.title}`}
                  >
                    <Image
                      src={`/paintings/${art.filename}`}
                      alt={`${art.title} by Harrison Ferraro`}
                      fill className="object-cover"
                      sizes="(max-width:768px) 50vw, 25vw"
                      placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
                    />
                    <div className="feat-card-overlay">
                      <div className="feat-card-info">
                        <div className="font-serif text-[17px] font-light mb-1">{art.title}</div>
                        <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-text-2">
                          {priceLabel(art)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ─── QUOTE ─── */}
        <div className="relative h-[440px] overflow-hidden flex items-center justify-center" aria-hidden="true">
          <Image src="/paintings/crimson-study.jpg" alt="" fill className="object-cover"
            style={{ objectPosition: 'center 25%', filter: 'brightness(0.16) contrast(1.4) saturate(0.45)' }}
            aria-hidden sizes="100vw" />
          <Reveal className="relative z-[2] text-center px-[52px] max-w-[820px] mx-auto max-md:px-6">
            <blockquote
              className="font-serif font-light italic leading-[1.25]"
              style={{ fontSize: 'clamp(22px,4vw,48px)' }}
            >
              “I paint the figure the way I experience it — as a force of nature, not an object of observation.”
            </blockquote>
            <footer
              className="font-mono text-[9px] tracking-[0.26em] uppercase text-ember mt-7 flex items-center justify-center gap-4"
              aria-label="Harrison Ferraro"
            >
              <span className="inline-block w-6 h-px bg-[#6e4631]" aria-hidden="true" />
              Harrison Ferraro
              <span className="inline-block w-6 h-px bg-[#6e4631]" aria-hidden="true" />
            </footer>
          </Reveal>
        </div>

        {/* ─── SERIES ─── */}
        <section className="px-[52px] py-[100px] max-md:px-6" aria-label="Series">
          <Reveal>
            <div className="flex justify-between items-baseline mb-[52px]">
              <h2 className="font-serif font-light" style={{ fontSize: 'clamp(28px,4vw,54px)' }}>Series</h2>
              <Link href="/series" className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ember flex items-center gap-2 hover:gap-4 transition-all">
                Explore →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-[5px] max-md:grid-cols-1">
              {(Object.entries(SERIES) as [string, typeof SERIES[keyof typeof SERIES]][]).map(([name, info]) => {
                const works = ARTWORKS.filter((a) => a.series === name)
                const cover = works[0]
                if (!cover) return null
                return (
                  <Link key={name} href="/series" className="series-card" aria-label={`${name} series — ${works.length} works`}>
                    <Image
                      src={`/paintings/${cover.filename}`} alt={name}
                      width={800} height={600} className="w-full"
                      style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                      sizes="(max-width:768px) 100vw, 50vw"
                      placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[cover.slug]}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8"
                      style={{ background: 'linear-gradient(to top, rgba(11, 10, 9,0.93) 0%, rgba(11, 10, 9,0.28) 60%, transparent 100%)' }}>
                      <h3 className="font-serif font-light mb-2" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>{name}</h3>
                      <p className="font-mono text-[12px] text-text-2 leading-[1.65] max-w-[300px] mb-3.5">{info.desc.slice(0, 90)}…</p>
                      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ember">{works.length} work{works.length !== 1 ? 's' : ''}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </section>

        {/* ─── COMMISSION CTA ─── */}
        <section
          className="px-[52px] py-[100px] border-t border-[#2a2622] flex justify-between items-center flex-wrap gap-8 max-md:px-6"
          aria-label="Commission a work"
        >
          <Reveal>
            <div>
              <div className="eyebrow mb-4">Commission</div>
              <h2 className="font-serif font-light leading-[1.08]" style={{ fontSize: 'clamp(32px,4vw,60px)' }}>
                Something made<br /><em className="italic text-text-2">only for you.</em>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <Link href="/commissions" className="btn-ember flex-shrink-0">Start a Commission</Link>
          </Reveal>
        </section>

        <Footer />
      </div>

      {lb && (
        <Lightbox
          art={lb} all={ARTWORKS}
          onClose={() => setLb(null)}
          onNav={(d) => {
            const i = ARTWORKS.findIndex((a) => a.id === lb.id)
            const next = ARTWORKS[i + d]
            if (next) setLb(next)
          }}
          onJumpTo={(i) => { if (ARTWORKS[i]) setLb(ARTWORKS[i]) }}
          onInquire={(a) => { setLb(null); setInqModal(a) }}
        />
      )}
      {inqModal && <InquireModal art={inqModal} onClose={() => setInqModal(null)} />}
    </>
  )
}
