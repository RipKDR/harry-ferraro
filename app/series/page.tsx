'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ARTWORKS, SERIES } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import type { Artwork, SeriesName } from '@/lib/artworks'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { InquireModal } from '@/components/InquireModal'

export default function SeriesPage() {
  const [active, setActive] = useState<SeriesName | null>(null)
  const [lb, setLb] = useState<Artwork | null>(null)
  const [inqModal, setInqModal] = useState<Artwork | null>(null)

  const seriesWorks = active ? ARTWORKS.filter((a) => a.series === active) : []

  return (
    <>
      <div className="page-enter pt-[80px]">
        <section className="px-[52px] py-[100px] max-md:px-6">
          <Reveal>
            <div className="flex justify-between items-baseline mb-3">
              {active ? (
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ember flex items-center gap-2 hover:gap-4 transition-all bg-none border-none cursor-pointer"
                >
                  ← All Series
                </button>
              ) : (
                <h1 className="font-serif font-light" style={{ fontSize: 'clamp(44px,7vw,88px)' }}>Series</h1>
              )}
            </div>
          </Reveal>

          {!active ? (
            <>
              <Reveal delay={0.1}>
                <p className="font-mono text-[13px] text-text-2 leading-[1.8] max-w-[520px] mb-[52px]">
                  The work is organised into series — not by theme, but by the emotional state that produced it.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="grid grid-cols-2 gap-[5px] max-md:grid-cols-1">
                  {(Object.entries(SERIES) as [SeriesName, typeof SERIES[SeriesName]][]).map(([name, info]) => {
                    const works = ARTWORKS.filter((a) => a.series === name)
                    const cover = works[0]
                    if (!cover) return null
                    return (
                      <button
                        key={name}
                        onClick={() => setActive(name)}
                        className="series-card text-left"
                        aria-label={`${name} series — ${works.length} works`}
                      >
                        <Image
                          src={`/paintings/${cover.filename}`} alt={name}
                          width={800} height={600} className="w-full"
                          style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                          sizes="(max-width:768px) 100vw, 50vw"
                          placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[cover.slug]}
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-8"
                          style={{ background: 'linear-gradient(to top, rgba(7,6,10,0.93) 0%, rgba(7,6,10,0.3) 60%, transparent 100%)' }}>
                          <h2 className="font-serif font-light mb-2" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{name}</h2>
                          <p className="font-mono text-[12px] text-text-2 leading-[1.65] max-w-[320px] mb-3.5">{info.desc}</p>
                          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ember">{works.length} work{works.length !== 1 ? 's' : ''}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Reveal>
            </>
          ) : (
            <div className="page-enter">
              <Reveal>
                <div className="mb-12">
                  <div className="eyebrow mb-4">{active} Series</div>
                  <p className="font-serif font-light leading-[1.65] text-text-2 max-w-[580px]" style={{ fontSize: 'clamp(18px,2.5vw,26px)' }}>
                    {SERIES[active].desc}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div style={{ columns: seriesWorks.length === 1 ? 1 : 2, gap: '5px', columnFill: 'balance' }}
                  className="max-sm:columns-1">
                  {seriesWorks.map((art) => (
                    <div key={art.id} className="break-inside-avoid mb-[5px]">
                      <button
                        className="gallery-card w-full text-left"
                        onClick={() => setLb(art)}
                        aria-label={`View ${art.title}`}
                      >
                        <Image
                          src={`/paintings/${art.filename}`}
                          alt={`${art.title} by Harrison Ferraro, ${art.year}. ${art.medium}.`}
                          width={600} height={750} className="w-full"
                          sizes="(max-width:640px) 100vw, 50vw"
                          placeholder="blur" blurDataURL={BLUR_PLACEHOLDERS[art.slug]}
                        />
                        <div className="gallery-overlay">
                          <div className="gallery-card-info">
                            <span className={`badge ${art.status === 'available' ? 'badge-available' : 'badge-sold'} mb-2.5 block`}>{art.status === 'available' ? 'Available' : 'Sold'}</span>
                            <div className="font-serif text-[20px] font-light mb-1">{art.title}</div>
                            <div className="font-mono text-[9px] uppercase text-text-2 tracking-[0.1em]">{art.year} · {art.medium}</div>
                            <div className="font-mono text-[9px] uppercase text-text-3 tracking-[0.1em]">{art.dimensions}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          )}
        </section>
        <Footer />
      </div>

      {lb && (
        <Lightbox
          art={lb} all={seriesWorks}
          onClose={() => setLb(null)}
          onNav={(d) => {
            const i = seriesWorks.findIndex((a) => a.id === lb.id)
            const next = seriesWorks[i + d]
            if (next) setLb(next)
          }}
          onJumpTo={(i) => { if (seriesWorks[i]) setLb(seriesWorks[i]) }}
          onInquire={(a) => { setLb(null); setInqModal(a) }}
        />
      )}
      {inqModal && <InquireModal art={inqModal} onClose={() => setInqModal(null)} />}
    </>
  )
}
