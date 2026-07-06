import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Harrison Ferraro directly for original work, exhibitions, press, or collaboration. Response within 48 hours.',
  alternates: { canonical: `${SITE.siteUrl}/contact` },
}

export default function ContactPage() {
  return (
    <div>
      <section className="section-pad site-shell pt-36 md:pt-44">
        <p className="eyebrow mb-5">Contact</p>
        <a
          href={`mailto:${SITE.email}`}
          className="inline-block font-serif text-[clamp(2.8rem,5vw,7rem)] leading-[0.9] tracking-[-0.06em] underline-offset-[0.12em] hover:underline"
        >
          {SITE.email}
        </a>
        <p className="mt-6 font-mono text-[0.86rem] leading-8 text-text-2">Response within 48 hours.</p>

        <div className="mt-16 max-w-[42rem]">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </div>
  )
}
