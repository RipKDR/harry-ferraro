import Link from 'next/link'

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
      <div className="border-t border-[#1e1c24] px-[52px] pt-[72px] pb-12 grid grid-cols-3 gap-12 max-md:grid-cols-2 max-md:px-6 max-sm:grid-cols-1">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-serif text-[22px] font-medium mb-4 block hover:opacity-75 transition-opacity"
          >
            Harry Ferraro<span className="text-ember">.</span>
          </Link>
          <p
            className="text-[12px] text-text-2 leading-[1.75] max-w-[220px] mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Original figurative oil paintings and mixed media works. Melbourne, AU.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <a
              href="https://instagram.com/harryferraroart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-[0.12em] uppercase px-3.5 py-2 border border-[#1e1c24] text-text-3 hover:text-text hover:border-[#45424f] transition-colors"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
              aria-label="Harry Ferraro on Instagram"
            >
              Instagram
            </a>
            <Link
              href="/contact"
              className="text-[9px] tracking-[0.12em] uppercase px-3.5 py-2 border border-[#1e1c24] text-text-3 hover:text-text hover:border-[#45424f] transition-colors"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <div
            className="text-[8.5px] tracking-[0.18em] uppercase text-text-3 mb-5"
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
            className="text-[8.5px] tracking-[0.18em] uppercase text-text-3 mb-5"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Studio
          </div>
          <div
            className="space-y-3 text-[13px] text-text-2"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            <a
              href="mailto:Harrisonferraro99@gmail.com"
              className="block hover:text-text transition-colors"
            >
              Harrisonferraro99@gmail.com
            </a>
            <p>Melbourne, AU</p>
          </div>
          <div className="mt-8">
            <div
              className="text-[8.5px] tracking-[0.18em] uppercase text-text-3 mb-3"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              Commission
            </div>
            <Link href="/commissions" className="btn-ghost text-[9px] tracking-[0.12em] uppercase px-4 py-2.5 inline-block">
              Start a Project
            </Link>
          </div>
        </address>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e1c24] mx-[52px] max-md:mx-6 py-6 flex justify-between items-center flex-wrap gap-3">
        <p
          className="text-[9px] tracking-[0.1em] uppercase text-text-3"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          © {new Date().getFullYear()} Harry Ferraro. All rights reserved.
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
