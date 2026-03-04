'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { Marquee } from '@/components/Marquee'
import { StatCounter } from '@/components/StatCounter'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { PurchaseModal } from '@/components/PurchaseModal'
import { InquireModal } from '@/components/InquireModal'
import type { Artwork } from '@/lib/artworks'

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => { setOut(true); setTimeout(onDone, 850) }, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center gap-6"
      style={{
        background: '#15131c',
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
        Harry Ferraro<span className="text-ember">.</span>
      </h1>
      <span
        className="splash-sub text-[10px] tracking-[0.32em] uppercase text-text-3 font-mono"
      >
        Fine Art Studio
      </span>
      <div className="w-[120px] h-px bg-[#38354a] relative overflow-hidden mt-2">
        <div className="splash-bar-fill absolute inset-0 bg-ember" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false)
  const [lb, setLb] = useState<Artwork | null>(null)
  const [buyModal, setBuyModal] = useState<Artwork | null>(null)
  const [inqModal, setInqModal] = useState<Artwork | null>(null)

  const featured = ARTWORKS.slice(0, 5)

  return (
    <>
      <SplashScreen onDone={() => setSplashDone(true)} />

      <div style={{ opacity: splashDone ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}>

        {/* ─── HERO ─── */}
        <section className="relative h-screen min-h-[640px] flex flex-col justify-end overflow-hidden" aria-label="Hero">
          <div
            className="absolute pointer-events-none select-none"
            style={{
              top: '50%', right: '52px', transform: 'translateY(-50%)',
              fontFamily: 'var(--font-cormorant)', fontSize: 'min(18vw, 200px)',
              fontWeight: 300, color: 'rgba(255,255,255,0.022)', lineHeight: 1, letterSpacing: '-0.04em',
            }}
            aria-hidden="true"
          >I</div>

          <div className="absolute inset-0">
            <Image
              src="/paintings/ignition-ii.jpg"
              alt="Ignition II — Harry Ferraro, 2024. Oil & mixed media on canvas."
              fill priority
              className="object-cover"
              style={{ objectPosition: 'center 18%', filter: 'brightness(0.38) contrast(1.22) saturate(0.78)', animation: 'heroZoom 18s ease-out forwards' }}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDERS['ignition-ii']}
            />
          </div>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 90% at 65% 50%, transparent 15%, rgba(7,6,10,0.65) 100%)' }} aria-hidden />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #15131c 0%, rgba(21,19,28,0.52) 38%, transparent 72%)' }} aria-hidden />

          <div
            className="relative z-[2] px-[52px] pb-20 max-md:px-6"
            style={{ animation: 'fadeUp 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}
          >
            <div className="eyebrow mb-6">Original Fine Art</div>
            <h1
              className="font-serif font-light leading-[0.86] tracking-[-0.03em] mb-8"
              style={{ fontSize: 'clamp(64px,11.5vw,140px)' }}
            >
              The<br />moment<br /><em className="italic text-text-2">before</em><br />the flame
            </h1>
            <p
              className="font-mono text-[13px] text-text-2 leading-[1.85] max-w-[340px] mb-12 font-light tracking-[0.025em]"
            >
              Figurative oil paintings that live in the emotional space between tension and release. Dark. Dramatic. Permanent.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/gallery" className="btn-ember">View the Gallery</Link>
              <Link href="/commissions" className="btn-ghost">Commission a Work</Link>
            </div>
          </div>

          <div
            className="absolute bottom-20 right-[52px] z-[2] flex flex-col items-center gap-2 max-md:right-6"
            style={{ animation: 'fadeUp 1.5s cubic-bezier(0.16,1,0.3,1) 0.85s both' }}
            aria-hidden="true"
          >
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-text-3">scroll</span>
            <div className="w-px h-16" style={{ background: 'linear-gradient(to bottom, transparent, #7a3408)', animation: 'scrollPulse 2.4s ease-in-out infinite' }} />
          </div>
        </section>

        <Marquee />

        {/* ─── STATS ─── */}
        <div className="grid grid-cols-3 border-b border-[#38354a] max-sm:grid-cols-1" role="list" aria-label="Studio statistics">
          <StatCounter value={7} suffix="+" label="Years in Practice" />
          <StatCounter value={40} suffix="+" label="Works Sold" />
          <StatCounter value={5} label="Active Series" />
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
                  alt={`${featured[0].title} by Harry Ferraro`}
                  fill className="object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  sizes="(max-width:768px) 100vw, 55vw"
                  placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[featured[0].slug]}
                />
                <div className="feat-card-overlay">
                  <div className="feat-card-info">
                    <div className="font-serif text-[20px] font-light mb-1.5">{featured[0].title}</div>
                    <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-text-2 mb-2">{featured[0].medium} / {featured[0].year}</div>
                    <div className="font-mono text-[10px] tracking-[0.08em] text-ember">GBP {featured[0].price.toLocaleString()}</div>
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
                      alt={`${art.title} by Harry Ferraro`}
                      fill className="object-cover"
                      sizes="(max-width:768px) 50vw, 25vw"
                      placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
                    />
                    <div className="feat-card-overlay">
                      <div className="feat-card-info">
                        <div className="font-serif text-[17px] font-light mb-1">{art.title}</div>
                        <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-text-2">
                          {art.status === 'available' ? `GBP ${art.price.toLocaleString()}` : 'Sold'}
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
              "I paint women the way I experience them. As forces of nature, not objects of observation."
            </blockquote>
            <footer
              className="font-mono text-[9px] tracking-[0.26em] uppercase text-ember mt-7 flex items-center justify-center gap-4"
              aria-label="Harry Ferraro"
            >
              <span className="inline-block w-6 h-px bg-[#7a3408]" aria-hidden="true" />
              Harry Ferraro
              <span className="inline-block w-6 h-px bg-[#7a3408]" aria-hidden="true" />
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
                      style={{ background: 'linear-gradient(to top, rgba(21,19,28,0.93) 0%, rgba(21,19,28,0.28) 60%, transparent 100%)' }}>
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
          className="px-[52px] py-[100px] border-t border-[#38354a] flex justify-between items-center flex-wrap gap-8 max-md:px-6"
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
          onBuy={(a) => { setLb(null); setBuyModal(a) }}
          onInquire={(a) => { setLb(null); setInqModal(a) }}
        />
      )}
      {buyModal && <PurchaseModal art={buyModal} onClose={() => setBuyModal(null)} />}
      {inqModal && <InquireModal art={inqModal} onClose={() => setInqModal(null)} />}
    </>
  )
}
