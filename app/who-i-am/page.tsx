import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ARTIST_STATEMENT, SITE } from '@/lib/site'
import { ARTWORKS } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Who I am',
  description: 'Artist statement and practice notes for Harrison Ferraro, Melbourne painter working in expressive figuration.',
}

export default function WhoIAmPage() {
  const primary = ARTWORKS.find((artwork) => artwork.slug === 'crimson-study') ?? ARTWORKS[0]
  const secondary = ARTWORKS.find((artwork) => artwork.slug === 'ascendant') ?? ARTWORKS[1]

  return (
    <div className="page-enter">
      <section className="site-shell grid min-h-[100dvh] border-b border-[var(--border)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-end px-5 pb-16 pt-36 md:px-12 lg:px-[4.5rem] lg:pb-24">
          <p className="eyebrow mb-5">Who I am</p>
          <h1 className="max-w-[58rem] font-serif text-[clamp(4rem,10vw,11rem)] leading-[0.78] tracking-[-0.085em]">
            Figures, faces, and uneasy weather.
          </h1>
          <div className="mt-8 max-w-[44rem] space-y-5 font-mono text-[0.9rem] leading-8 text-text-2">
            <p>
              I am Harrison Ferraro, a Melbourne based painter working in dark expressive figuration. I make oil paintings of faces and bodies caught in private weather: smoke, heat, movement, shadow, colour, and the pressure of being looked at.
            </p>
            <p>
              The work is not built around polish. Some marks stay rough because smoothing them out would flatten the feeling. I want the painting to keep the part of a person that usually disappears before anyone can explain it.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/gallery" className="btn-ink">View work</Link>
            <Link href="/contact" className="btn-line">Contact Harrison</Link>
          </div>
        </div>

        <div className="relative min-h-[70vh] border-t border-[var(--border)] lg:min-h-[100dvh] lg:border-l lg:border-t-0">
          <ArtFrame className="absolute inset-4 lg:inset-6">
            <div className="relative h-full min-h-[66vh] lg:min-h-full">
              <Image src={primary.image} alt={primary.alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 46vw" style={{ filter: 'brightness(0.74) contrast(1.15) saturate(0.84)' }} />
            </div>
          </ArtFrame>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.84),transparent_52%)]" />
        </div>
      </section>

      <Reveal as="section" className="section-pad site-shell border-b border-[var(--border)]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-5">Artist statement</p>
            <h2 className="font-serif text-[clamp(3.2rem,7vw,8rem)] leading-[0.84] tracking-[-0.075em]">
              I want the face to hold the feeling before it explains anything.
            </h2>
          </div>
          <div className="space-y-6 font-mono text-[0.94rem] leading-9 text-text-2">
            {ARTIST_STATEMENT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </Reveal>

      <section className="site-shell grid border-b border-[var(--border)] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative min-h-[38rem] border-b border-[var(--border)] lg:border-b-0 lg:border-r">
          <Image src={secondary.image} alt={secondary.alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 44vw" style={{ filter: 'brightness(.72) contrast(1.14) saturate(.82)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.72),transparent_58%)]" />
        </div>
        <div className="section-pad-tight">
          <p className="eyebrow mb-5">What I am about</p>
          <div className="grid gap-8">
            {[
              ['The figure', 'Faces and bodies give the work a human weight. I am interested in the moment before someone becomes readable.'],
              ['The surface', 'Paint is allowed to stay physical. Scraped marks, rough edges, dark fields, hard colour, and unresolved passages are part of the work.'],
              ['The room', 'The paintings are meant to change the room around them: quieter, heavier, closer to the nerve.'],
              ['The contact', 'The site is a portfolio and studio door. For original works, selected commissions, exhibitions, press, or collaboration, contact me directly.'],
            ].map(([title, body]) => (
              <section key={title} className="border-l border-oxide pl-5">
                <h3 className="font-serif text-[2.6rem] leading-none tracking-[-0.055em]">{title}</h3>
                <p className="mt-3 max-w-[40rem] font-mono text-[0.86rem] leading-8 text-text-2">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad site-shell">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ['Work', 'Figurative oil paintings, portraits, figure studies, and colour studies.'],
            ['Location', `${SITE.location}. Enquiries can start online. A studio conversation can be arranged when needed.`],
            ['Enquiries', 'Original work, selected commissions, exhibitions, press, and collaboration. The site does not list prices or run checkout.'],
          ].map(([title, body]) => (
            <div key={title} className="statement-panel">
              <h2 className="font-serif text-[2.8rem] leading-none tracking-[-0.06em]">{title}</h2>
              <p className="mt-4 font-mono text-[0.82rem] leading-7 text-text-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
