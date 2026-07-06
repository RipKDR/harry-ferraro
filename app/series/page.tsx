import type { Metadata } from 'next'
import { getActiveSeries, getSeriesWorks } from '@/lib/artworks'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { SeriesSection } from '@/components/SeriesSection'

export const metadata: Metadata = {
  title: 'Series',
  description: 'Bodies of work by Harrison Ferraro — figurative oil paintings grouped by subject, atmosphere, and repeated pressure.',
  alternates: { canonical: `${SITE.siteUrl}/series` },
}

export default function SeriesPage() {
  const entries = getActiveSeries()

  return (
    <div>
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
          <SeriesSection key={name} name={name} description={info.description} works={getSeriesWorks(name)} />
        ))}
      </section>

      <Footer />
    </div>
  )
}
