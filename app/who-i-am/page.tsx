import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ARTIST_STATEMENT, SITE } from '@/lib/site'
import { ARTWORKS } from '@/lib/artworks'
import { ArtFrame } from '@/components/ArtFrame'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { TextReveal } from '@/components/TextReveal'

export const metadata: Metadata = {
  title: 'Who I am',
  description: 'Artist statement and practice notes for Harrison Ferraro, Melbourne painter working in expressive figuration.',
}

const ABOUT = [
  ['01', 'The figure', 'Faces and bodies give the work a human weight. I am interested in the moment before someone becomes readable.'],
  ['02', 'The surface', 'Paint is allowed to stay physical. Scraped marks, rough edges, dark fields, hard colour, and unresolved passages are part of the work.'],
  ['03', 'The room', 'The paintings are meant to change the room around them: quieter, heavier, closer to the nerve.'],
  ['04', 'The contact', 'The site is a portfolio and studio door. For original works, selected commissions, exhibitions, press, or collaboration, contact me directly.'],
]

export default function WhoIAmPage() {
  const primary = ARTWORKS.find((artwork) => artwork.slug === 'crimson-study') ?? ARTWORKS[0]
  const secondary = ARTWORKS.find((artwork) => artwork.slug === 'ascendant') ?? ARTWORKS[1]

  const summary: Array<[string, string, string]> = [
    ['01', 'Work', 'Figurative oil paintings, portraits, figure studies, and colour studies.'],
    ['02', 'Location', `${SITE.location}. Enquiries can start online. A studio conversation can be arranged when needed.`],
    ['03', 'Enquiries', 'Original work, selected commissions, exhibitions, press, and collaboration. The site does not list prices or run checkout.'],
  ]

  return (
    <div className="page-enter">
      <section className="site-shell relative grid min-h-[100dvh] border-b border-[var(--border)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative z-10 flex flex-col justify-end px-5 pb-16 pt-36 md:px-12 lg:px-[4.5rem] lg:pb-24">
          <p className="eyebrow mb-5">Who I am</p>
          <div className="mb-7 h-px w-24 bg-[var(--border-strong)]" />
          <h1 className="max-w-[58rem] font-serif text-[clamp(3.6rem,11vw,11rem)] leading-[0.78] tracking-[-0.085em]">
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

        <div className="relative min-h-[70vh] border-t border-[var(--border)] lg:min-h-[100dvh] lg:-ml-[8%] lg:border-l lg:border-t-0">
          <ArtFrame className="absolute inset-4 lg:inset-6">
            <div className="relative h-full min-h-[66vh] lg:min-h-full">
              <Image src={primary.image} alt={primary.alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 46vw" style={{ filter: 'brightness(0.74) contrast(1.15) saturate(0.84)' }} />
            </div>
          </ArtFrame>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.84),transparent_52%)]" />
        </div>
      </section>

      <section className="section-pad site-shell relative overflow-hidden border-b border-[var(--border)]">
        <span aria-hidden className="pointer-events-none absolute -left-2 top-2 font-serif text-[12rem] leading-none text-oxide opacity-[0.12] md:text-[16rem]">&ldquo;</span>
        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-5">Artist statement</p>
            <TextReveal
              as="h2"
              groupSize={4}
              text="I want the face to hold the feeling before it explains anything."
              className="font-serif text-[clamp(3.2rem,7vw,8rem)] leading-[0.84] tracking-[-0.075em]"
            />
          </div>
          <div className="space-y-6 font-mono text-[0.94rem] leading-9 text-text-2">
            {ARTIST_STATEMENT.map((paragraph, index) => (
              <Reveal key={paragraph} as="div" delayMs={index * 110}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell grid border-b border-[var(--border)] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative min-h-[38rem] border-b border-[var(--border)] lg:border-b-0 lg:border-r">
          <Image src={secondary.image} alt={secondary.alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 44vw" style={{ filter: 'brightness(.72) contrast(1.14) saturate(.82)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,7,6,.72),transparent_58%)]" />
        </div>
        <div className="section-pad-tight">
          <p className="eyebrow mb-5">What I am about</p>
          <div className="grid gap-12">
            {ABOUT.map(([number, title, body], index) => (
              <Reveal key={title} as="section" delayMs={index * 150} className="border-l border-oxide pl-5">
                <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-oxide">{number}</p>
                <h3 className="font-serif text-[2.6rem] leading-none tracking-[-0.055em]">{title}</h3>
                <p className="mt-3 max-w-[40rem] font-mono text-[0.86rem] leading-8 text-text-2">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad site-shell">
        <div>
          {summary.map(([number, title, body], index) => (
            <Reveal
              key={title}
              as="section"
              delayMs={index * 110}
              className="flex flex-col gap-5 border-t border-[var(--border)] py-12 first:border-t-0 first:pt-0 md:flex-row md:items-baseline md:gap-12"
            >
              <p className="font-serif text-[clamp(3.6rem,7vw,7rem)] leading-none text-oxide opacity-40 md:w-[9rem] md:shrink-0">{number}</p>
              <div className="md:flex-1">
                <h2 className="font-serif text-[clamp(2.4rem,4vw,3.4rem)] leading-none tracking-[-0.06em]">{title}</h2>
                <p className="mt-4 max-w-[44rem] font-mono text-[0.86rem] leading-8 text-text-2">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
