import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ARTIST_INTRO, ARTIST_STATEMENT, POSITIONING, SITE } from '@/lib/site'
import { AVAILABLE_ARTWORKS, getFeaturedArtworks } from '@/lib/artworks'
import { BLUR_PLACEHOLDERS } from '@/lib/blurPlaceholders'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { HomeHero } from '@/components/HomeHero'
import { PracticeMarquee } from '@/components/PracticeMarquee'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Harrison Ferraro — Painter, Melbourne',
  description: `${POSITIONING} Portfolio, series, and studio enquiries.`,
  alternates: { canonical: SITE.siteUrl },
}

const TILE_LAYOUT = [
  { col: 'md:col-span-7', offset: '', ratio: '4 / 5' },
  { col: 'md:col-span-5', offset: 'md:translate-y-24', ratio: '3 / 4' },
  { col: 'md:col-span-12', offset: 'md:-translate-y-8', ratio: '16 / 7' },
  { col: 'md:col-span-4', offset: 'md:translate-y-16', ratio: '4 / 5' },
  { col: 'md:col-span-8', offset: '', ratio: '3 / 4' },
] as const

export default function HomePage() {
  const featured = getFeaturedArtworks()
  const hero = AVAILABLE_ARTWORKS.find((artwork) => artwork.slug === 'ignition-ii') ?? featured[0] ?? AVAILABLE_ARTWORKS[0]
  const second = AVAILABLE_ARTWORKS.find((artwork) => artwork.slug === 'crimson-study') ?? AVAILABLE_ARTWORKS[1]
  const closing = AVAILABLE_ARTWORKS.find((artwork) => artwork.slug === 'ignition-i') ?? AVAILABLE_ARTWORKS[0]

  return (
    <div>
      <HomeHero hero={hero} positioning={POSITIONING} intro={ARTIST_INTRO} />

      <PracticeMarquee />

      <Reveal as="section" className="section-pad site-shell" aria-labelledby="selected-heading">
        <div className="grid gap-10 lg:grid-cols-[0.48fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">Selected paintings</p>
            <h2 id="selected-heading" className="font-serif text-[clamp(3.4rem,8vw,9.5rem)] leading-[0.82] tracking-[-0.08em]">
              Work that stays loud in a quiet room.
            </h2>
          </div>
          <p className="max-w-[34rem] font-mono text-[0.86rem] leading-8 text-text-2 lg:justify-self-end">
            The index stays sparse. Titles and materials only where they are confirmed. The painting leads.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-12 md:gap-x-10 md:gap-y-0">
          {featured.slice(0, 5).map((artwork, index) => {
            const layout = TILE_LAYOUT[index] ?? TILE_LAYOUT[TILE_LAYOUT.length - 1]
            return (
              <Reveal key={artwork.slug} delayMs={index * 90} className={layout.col}>
                <Link href={`/gallery/${artwork.slug}`} className={`group block ${layout.offset}`.trim()}>
                  <article>
                    <ArtFrame>
                      <div className="relative overflow-hidden" style={{ aspectRatio: layout.ratio }}>
                        <Image
                          src={artwork.image}
                          alt={artwork.alt}
                          fill
                          sizes="(max-width:768px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDERS[artwork.slug]}
                          className="object-cover brightness-100 transition-[filter] duration-300 ease-out md:group-hover:brightness-[0.72]"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(8,7,6,0.82),transparent)] opacity-100 transition-opacity duration-[220ms] md:opacity-0 md:group-hover:opacity-100" />
                        <div className="pointer-events-none absolute bottom-0 left-0 p-5 opacity-100 transition-opacity duration-[220ms] md:opacity-0 md:group-hover:opacity-100">
                          <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-text-3">{artwork.series}</p>
                          <h3 className="mt-2 font-serif text-[clamp(1.8rem,2.5vw,3rem)] leading-[0.9] tracking-[-0.05em] text-text">{artwork.title}</h3>
                        </div>
                      </div>
                    </ArtFrame>
                  </article>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-28 flex justify-end">
          <Link
            href="/gallery"
            className="group relative inline-flex items-center gap-2 font-serif text-[1.4rem] italic text-text-2 transition-colors duration-200 hover:text-text after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full"
          >
            View full work index
            <span aria-hidden="true" className="not-italic">→</span>
          </Link>
        </div>
      </Reveal>

      <section className="site-shell grid border-y border-[var(--border)] lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="statement-heading">
        <div className="relative min-h-[34rem] border-b border-[var(--border)] lg:min-h-[40rem] lg:border-b-0 lg:border-r">
          <ArtFrame className="absolute inset-4 lg:inset-6">
            <div className="relative h-full min-h-[30rem]">
              <Image
                src={second.image}
                alt={second.alt}
                fill
                sizes="(max-width:1024px) 100vw, 45vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDERS[second.slug]}
                className="object-cover"
                style={{ filter: 'brightness(.74) contrast(1.12) saturate(.84)' }}
              />
            </div>
          </ArtFrame>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.72),transparent_62%)]" />
        </div>
        <Reveal as="section" className="section-pad-tight flex flex-col justify-end">
          <p className="eyebrow mb-5">Artist statement</p>
          <h2 id="statement-heading" className="font-serif text-[clamp(3rem,7vw,8rem)] leading-[0.85] tracking-[-0.075em]">
            I want the face to hold the feeling before it explains anything.
          </h2>
          <div className="mt-8 max-w-[42rem] space-y-5 font-mono text-[0.88rem] leading-8 text-text-2">
            {ARTIST_STATEMENT.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-9">
            <Link href="/who-i-am" className="btn-ink">Read who I am</Link>
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="section-pad site-shell" aria-labelledby="preview-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">Wall preview</p>
            <h2 id="preview-heading" className="font-serif text-[clamp(3rem,7vw,8rem)] leading-[0.85] tracking-[-0.075em]">
              See a painting on your wall before it moves in.
            </h2>
            <p className="mt-8 max-w-[38rem] font-mono text-[0.88rem] leading-8 text-text-2">
              Open a work on your phone, point the camera at your wall, and drag the painting into place. Pinch to scale, save a photo, compare rooms. No app, no upload — the camera never leaves your device.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/preview" className="btn-ink">Try wall preview</Link>
              <Link href="/gallery" className="btn-line">Browse the work first</Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="statement-panel">
              <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-oxide">How it works</p>
              <ol className="space-y-4 font-mono text-[0.82rem] leading-7 text-text-2">
                <li><span className="text-oxide-2">01</span> — Pick a painting from the index.</li>
                <li><span className="text-oxide-2">02</span> — Allow the camera and face your wall.</li>
                <li><span className="text-oxide-2">03</span> — Drag, pinch, and save the picture.</li>
              </ol>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section-pad site-shell border-t border-[var(--border)]" aria-labelledby="studio-heading">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">Studio contact</p>
            <h2 id="studio-heading" className="font-serif text-[clamp(3.2rem,7vw,8.8rem)] leading-[0.84] tracking-[-0.075em]">
              For original work, selected commissions, or studio conversations.
            </h2>
          </div>
          <div>
            <p className="mb-7 font-mono text-[0.86rem] leading-8 text-text-2">
              Send a direct message with the painting, person, room, reference, or question. Portfolio-first — no public pricing, no checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/commissions" className="btn-ink">Start a conversation</Link>
              <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-line">Instagram</a>
            </div>
          </div>
        </div>
      </Reveal>

      <section className="site-shell relative min-h-[42rem] overflow-hidden border-t border-[var(--border)]" aria-labelledby="closing-heading">
        <Image
          src={closing.image}
          alt={closing.alt}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDERS[closing.slug]}
          className="object-cover"
          style={{ filter: 'brightness(.58) contrast(1.2) saturate(.72)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--bg)_0%,rgba(8,7,6,.3)_62%,rgba(8,7,6,.78)_100%)]" />
        <Reveal className="absolute bottom-0 left-0 max-w-[70rem] p-5 md:p-12 lg:p-[4.5rem]">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-oxide">{closing.title}</p>
          <p id="closing-heading" className="mt-5 font-serif text-[clamp(2.4rem,6vw,6.5rem)] leading-[0.88] tracking-[-0.07em] text-text">
            How much of a person can a room hold before the air changes?
          </p>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
