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
      <div className="site-shell grid gap-12 px-5 py-16 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-12 lg:px-[4.5rem]">
        <div>
          <Link href="/" className="mb-5 block font-serif text-[2.6rem] leading-none tracking-[-0.06em] transition-colors hover:text-oxide">
            Harrison Ferraro
          </Link>
          <p className="max-w-[24rem] font-mono text-[0.82rem] leading-7 text-text-2">
            Melbourne painter. Figurative oil paintings, private states, smoke, wind, colour, and faces under pressure.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-line min-h-0 px-4 py-2 text-[0.58rem]" aria-label={`${SITE.artistName} on ${link.label}`}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <div className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-text-3">Navigate</div>
          <ul className="space-y-1 list-none p-0">
            {FOOTER_NAV.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="block py-1.5 font-mono text-[0.82rem] text-text-2 transition-all hover:translate-x-1 hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <div className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-text-3">Studio</div>
          <div className="space-y-3 font-mono text-[0.82rem] leading-7 text-text-2">
            <a href={`mailto:${SITE.email}`} className="block transition-colors hover:text-text">{SITE.email}</a>
            <p>{SITE.location}</p>
            <p>{SITE.handle}</p>
          </div>
          <Link href="/commissions" className="btn-ink mt-8">Start a conversation</Link>
        </address>
      </div>

      <div className="site-shell flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-6 md:px-12 lg:px-[4.5rem]">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-text-3">© {new Date().getFullYear()} Harrison Ferraro.</p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-text-3">Original work. Direct artist contact.</p>
      </div>
    </footer>
  )
}
