import Link from 'next/link'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Process',
  description: 'Studio process and commission notes for Harrison Ferraro.',
}

const STEPS = [
  ['01', 'Brief', 'Send the subject, references, room, size, timing, and what the painting should avoid.'],
  ['02', 'Fit check', 'Harrison confirms whether the request suits the work and asks for anything that needs clearing up.'],
  ['03', 'Agreement', 'Scope, revision points, delivery, image usage, and timeline are confirmed in writing.'],
  ['04', 'Making', 'The painting begins once the practical details are clear. Progress expectations are agreed case by case.'],
  ['05', 'Delivery', 'Collection, shipping, and care details are confirmed before the work leaves the studio.'],
]

export default function ProcessPage() {
  return (
    <div className="page-enter">
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {STEPS.map(([number, title, body]) => (
            <div key={number} className="statement-panel">
              <p className="font-serif text-[3.6rem] leading-none text-oxide opacity-75">{number}</p>
              <h2 className="mt-7 font-serif text-[2.1rem] leading-none tracking-[-0.055em]">{title}</h2>
              <p className="mt-4 font-mono text-[0.78rem] leading-7 text-text-2">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/commissions" className="btn-ink">Start a conversation</Link>
          <Link href="/who-i-am" className="btn-line">Who I am</Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
