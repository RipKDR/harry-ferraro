import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/site'

const FOOTER_NAV = [
  { label: 'Work', href: '/gallery' },
  { label: 'Series', href: '/series' },
  { label: 'Who I am', href: '/who-i-am' },
  { label: 'Process', href: '/process' },
  { label: 'Enquire', href: '/commissions' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer aria-label="Site footer" className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="site-shell px-5 pt-20 pb-12 md:px-12 lg:px-[4.5rem]">
        <p className="max-w-[18ch] font-serif font-light leading-[0.96] tracking-[-0.04em] text-text" style={{ fontSize: 'clamp(3.6rem, 8vw, 10rem)' }}>
          The painting leads. Everything else follows.
        </p>

        <div className="mt-16 flex flex-col gap-8 border-t border-[var(--border)] pt-8 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link href="/" className="font-serif text-[1.8rem] leading-none tracking-[-0.06em] transition-colors hover:text-oxide">
            Harrison Ferraro
          </Link>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_NAV.map(({ label, href }) => (
              <Link key={href} href={href} className="py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-2 transition-colors hover:text-text">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-2 transition-colors hover:text-text" aria-label={`${SITE.artistName} on ${link.label}`}>
                {link.label}
              </a>
            ))}
            <a href={`mailto:${SITE.email}`} className="py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxide-2 transition-colors hover:text-text">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <div className="site-shell flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-6 md:px-12 lg:px-[4.5rem]">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-3">© {new Date().getFullYear()} Harrison Ferraro.</p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-text-3">Original work. Direct artist contact.</p>
      </div>
    </footer>
  )
}
