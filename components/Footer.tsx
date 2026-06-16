import Link from 'next/link'
import { SITE } from '@/lib/site'
import { SocialLinks } from '@/components/SocialLinks'

const FOOTER_NAV = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Series', href: '/series' },
  { label: 'Process', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Commissions', href: '/commissions' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer aria-label="Site footer">
      <div className="border-t border-[#38354a] px-[52px] pt-[72px] pb-12 grid grid-cols-3 gap-12 max-md:grid-cols-2 max-md:px-6 max-sm:grid-cols-1">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-serif text-[22px] font-medium mb-4 block hover:opacity-75 transition-opacity"
          >
            Harrison Ferraro<span className="text-ember">.</span>
          </Link>
          <p
            className="text-[12px] text-text-2 leading-[1.75] max-w-[220px] mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Original figurative oil paintings and mixed media works. {SITE.locationShort}.
          </p>
          <SocialLinks />
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <div
            className="text-[10px] tracking-[0.18em] uppercase text-text-3 mb-5"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Navigate
          </div>
          <ul className="space-y-0.5 list-none">
            {FOOTER_NAV.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13px] text-text-2 py-1.5 block hover:text-text transition-colors hover:translate-x-1 transition-transform"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <address className="not-italic">
          <div
            className="text-[10px] tracking-[0.18em] uppercase text-text-3 mb-5"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Studio
          </div>
          <div
            className="space-y-3 text-[13px] text-text-2"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            <a
              href={`mailto:${SITE.email}`}
              className="block hover:text-text transition-colors"
            >
              {SITE.email}
            </a>
            <p>{SITE.location}</p>
          </div>
          <div className="mt-8">
            <div
              className="text-[10px] tracking-[0.18em] uppercase text-text-3 mb-3"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Commissions
            </div>
            <Link href="/commissions" className="btn-ghost text-[9px] tracking-[0.12em] uppercase px-4 py-2.5 inline-block">
              Enquire
            </Link>
          </div>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#38354a] mx-[52px] max-md:mx-6 py-6 flex justify-between items-center flex-wrap gap-3">
        <p
          className="text-[9px] tracking-[0.1em] uppercase text-text-3"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          © {new Date().getFullYear()} Harrison Ferraro. All rights reserved.
        </p>
        <p
          className="text-[9px] tracking-[0.1em] uppercase text-text-3"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Original works. No reproductions.
        </p>
      </div>
    </footer>
  )
}
