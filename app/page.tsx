import Image from 'next/image'
import Link from 'next/link'
import { ARTIST_INTRO, ARTIST_STATEMENT, POSITIONING, SITE } from '@/lib/site'
import { ARTWORKS, getFeaturedArtworks, formatArtworkMeta } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { HomeHero } from '@/components/HomeHero'
import { PracticeMarquee } from '@/components/PracticeMarquee'
import { Reveal } from '@/components/Reveal'

export default function HomePage() {
  const featured = getFeaturedArtworks()
  const hero = ARTWORKS.find((artwork) => artwork.slug === 'ignition-ii') ?? featured[0] ?? ARTWORKS[0]
  const second = ARTWORKS.find((artwork) => artwork.slug === 'crimson-study') ?? ARTWORKS[1]
  const third = ARTWORKS.find((artwork) => artwork.slug === 'tempest') ?? ARTWORKS[2]

  return (
    <div className="page-enter">
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

        <div className="mt-16 grid gap-8 md:grid-cols-12">
          {featured.slice(0, 5).map((artwork, index) => {
            const meta = [formatArtworkMeta(artwork.year), formatArtworkMeta(artwork.medium)].filter(Boolean).join(' · ')
            return (
              <Reveal key={artwork.slug} delayMs={index * 90} className={`${index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5 md:translate-y-20' : index === 2 ? 'md:col-span-4' : index === 3 ? 'md:col-span-5 md:-translate-y-8' : 'md:col-span-3 md:translate-y-16'}`}>
                <Link href={`/gallery/${artwork.slug}`} className="work-tile group block">
                  <article>
                    <ArtFrame>
                      <div className="relative overflow-hidden" style={{ aspectRatio: index === 0 ? '4 / 5' : index === 1 ? '3 / 4' : '4 / 5' }}>
                        <Image src={artwork.image} alt={artwork.alt} fill sizes="(max-width:768px) 100vw, 50vw" className="art-image object-cover" />
                      </div>
                    </ArtFrame>
                    <div className="mt-4 flex items-start justify-between gap-4 border-t border-[var(--border)] pt-4">
                      <h3 className="font-serif text-[clamp(1.9rem,3vw,3.3rem)] leading-none tracking-[-0.055em]">{artwork.title}</h3>
                      <p className="max-w-[12rem] text-right font-mono text-[0.62rem] uppercase leading-5 tracking-[0.17em] text-text-3">{meta || artwork.series}</p>
                    </div>
                  </article>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-28 flex justify-end">
          <Link href="/gallery" className="btn-line">View full work index</Link>
        </div>
      </Reveal>

      <section className="site-shell grid border-y border-[var(--border)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[34rem] border-b border-[var(--border)] lg:min-h-[40rem] lg:border-b-0 lg:border-r">
          <ArtFrame className="absolute inset-4 lg:inset-6">
            <div className="relative h-full min-h-[30rem]">
              <Image src={second.image} alt={second.alt} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" style={{ filter: 'brightness(.74) contrast(1.12) saturate(.84)' }} />
            </div>
          </ArtFrame>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.72),transparent_62%)]" />
        </div>
        <Reveal as="section" className="section-pad-tight flex flex-col justify-end">
          <p className="eyebrow mb-5">Artist statement</p>
          <h2 className="font-serif text-[clamp(3rem,7vw,8rem)] leading-[0.85] tracking-[-0.075em]">
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

      <Reveal as="section" className="section-pad site-shell" aria-labelledby="studio-heading">
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

      <section className="site-shell relative min-h-[42rem] overflow-hidden border-t border-[var(--border)]">
        <Image src={third.image} alt={third.alt} fill sizes="100vw" className="object-cover" style={{ filter: 'brightness(.58) contrast(1.2) saturate(.72)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#080706_0%,rgba(8,7,6,.3)_62%,rgba(8,7,6,.78)_100%)]" />
        <Reveal className="absolute bottom-0 left-0 max-w-[70rem] p-5 md:p-12 lg:p-[4.5rem]">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-oxide">{third.title}</p>
          <p className="mt-5 font-serif text-[clamp(2.4rem,6vw,6.5rem)] leading-[0.88] tracking-[-0.07em] text-[#f4eadc]">
            How much of a person can a room hold before the air changes?
          </p>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}