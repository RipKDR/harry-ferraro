import type { Metadata } from 'next'
import Link from 'next/link'
import { PROCESS_STEPS, SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Process',
  description: 'Studio process and commission notes for Harrison Ferraro.',
  alternates: { canonical: `${SITE.siteUrl}/process` },
}

export default function ProcessPage() {
  return (
    <div>
      <section className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Process</p>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.68fr] lg:items-end">
          <h1 className="font-serif text-[clamp(3.8rem,9vw,10rem)] leading-[0.8] tracking-[-0.085em]">
            Simple steps, enough room for the painting to change.
          </h1>
          <p className="max-w-[40rem] font-mono text-[0.86rem] leading-8 text-text-2">
            The practical side stays clear: brief, fit, agreement, making, delivery. The painting itself does not run on a fixed formula, but the agreement around it should be plain before work begins.
          </p>
        </div>
      </section>

      <section className="section-pad site-shell">
        <ol className="relative">
          {PROCESS_STEPS.map(([number, title, body], index) => (
            <li
              key={number}
              className="relative flex flex-col gap-4 border-t border-[var(--border)] py-12 first:border-t-0 first:pt-0 md:flex-row md:items-start md:gap-10"
            >
              <Reveal
                delayMs={index * 90}
                className="font-serif text-[clamp(3.4rem,7vw,5rem)] leading-none text-oxide opacity-60 md:w-[7rem] md:shrink-0"
              >
                {number}
              </Reveal>
              <Reveal delayMs={index * 90 + 60} className="md:flex-1">
                <h2 className="font-serif text-[clamp(2.2rem,4vw,3.2rem)] leading-none tracking-[-0.055em]">{title}</h2>
                <p className="mt-4 max-w-[44rem] font-mono text-[0.86rem] leading-8 text-text-2">{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-pad-tight site-shell">
        <div className="border border-[var(--border)] bg-[var(--surface)] px-6 py-14 md:px-14 md:py-20">
          <Reveal>
            <h2 className="max-w-[34rem] font-serif text-[clamp(2.4rem,5vw,3rem)] leading-[0.95] tracking-[-0.06em]">
              Every commission is discussed directly.
            </h2>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/commissions" className="btn-ink">Start a conversation</Link>
              <Link href="/who-i-am" className="btn-line">Who I am</Link>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </div>
  )
}
