import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS, SERIES, type SeriesName } from '@/lib/artworks'
import { Footer } from '@/components/Footer'

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

      <section className="section-pad site-shell">
        <div className="grid gap-16">
          {entries.map(([name, info], index) => {
            const works = ARTWORKS.filter((artwork) => artwork.series === name)
            const cover = works[0]
            if (!cover) return null
            return (
              <section key={name} className={`grid gap-6 lg:grid-cols-[0.8fr_1.2fr] ${index % 2 ? 'lg:grid-cols-[1.2fr_0.8fr]' : ''}`}>
                <div className={`${index % 2 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden bg-[#050403]" style={{ aspectRatio: '4 / 5' }}>
                    <Image src={cover.image} alt={cover.alt} fill className="art-image object-cover" sizes="(max-width:1024px) 100vw, 44vw" />
                  </div>
                </div>
                <div className="flex flex-col justify-end border-t border-[var(--border)] pt-6 lg:pb-8">
                  <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-oxide">{works.length} work{works.length === 1 ? '' : 's'}</p>
                  <h2 className="font-serif text-[clamp(3rem,7vw,7.8rem)] leading-[0.82] tracking-[-0.08em]">{name}</h2>
                  <p className="mt-6 max-w-[40rem] font-mono text-[0.86rem] leading-8 text-text-2">{info.description}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {works.map((artwork) => (
                      <Link key={artwork.slug} href={`/gallery/${artwork.slug}`} className="border border-[var(--border)] px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-text-2 transition-colors hover:border-oxide hover:text-text">
                        {artwork.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </section>
      <Footer />
    </div>
  )
}
