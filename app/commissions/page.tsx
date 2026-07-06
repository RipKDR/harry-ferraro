import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PROCESS_STEPS, SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { CommissionForm } from './CommissionForm'

export const metadata: Metadata = {
  title: 'Commissions',
  description: 'Enquire about original paintings and selected commissions from Harrison Ferraro. Direct artist contact — no public pricing, no checkout.',
  alternates: { canonical: `${SITE.siteUrl}/commissions` },
}

export default function CommissionsPage() {
  return (
    <div>
      <section className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Commissions</p>
        <h1 className="max-w-[24ch] font-serif text-[clamp(3.2rem,6vw,8rem)] leading-[0.84] tracking-[-0.075em]">
          I accept a limited number of commissions each year.
        </h1>
      </section>

      <section className="section-pad-tight site-shell border-b border-[var(--border)]">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-5" aria-label="Commission process">
          {PROCESS_STEPS.map(([number, title]) => (
            <div key={number}>
              <p className="font-serif text-[clamp(3rem,5vw,4.6rem)] leading-none text-oxide opacity-50">{number}</p>
              <p className="mt-4 font-mono text-[0.82rem] uppercase tracking-[0.12em] text-text-2">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad site-shell">
        <Suspense
          fallback={
            <p className="font-mono text-[0.82rem] uppercase tracking-[0.18em] text-text-3" role="status">
              Loading enquiry form…
            </p>
          }
        >
          <CommissionForm />
        </Suspense>
      </section>
      <Footer />
    </div>
  )
}
