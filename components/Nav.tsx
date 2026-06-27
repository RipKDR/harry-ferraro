'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Work', href: '/gallery' },
  { label: 'Series', href: '/series' },
  { label: 'Who I am', href: '/who-i-am' },
  { label: 'Process', href: '/process' },
  { label: 'Contact', href: '/contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`) || (href === '/who-i-am' && pathname === '/about')
  const immersivePreview = /^\/preview\/[^/]+$/.test(pathname)

  if (immersivePreview) return null

  return (
    <>
      {/* Desktop nav (>= lg): top centered bar, wrapped in <header> for the
          banner landmark. */}
      <header className="fixed left-0 right-0 top-0 z-[400] hidden px-4 pt-4 md:px-8 lg:block">
        <nav aria-label="Primary" className={`mx-auto grid max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center border px-4 py-3 transition-all duration-500 ${
          scrolled
            ? 'border-[rgba(234,225,213,0.24)] bg-[rgba(7,6,7,0.88)] backdrop-blur-2xl'
            : 'border-[rgba(234,225,213,0.14)] bg-[rgba(7,6,7,0.58)] backdrop-blur-xl'
        }`}>
          <Link href="/" aria-label="Harrison Ferraro home" className="justify-self-start font-mono text-[0.7rem] uppercase tracking-[0.26em] text-text transition-colors hover:text-oxide">
            Harrison Ferraro
          </Link>

          <ul className="flex items-center justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={`nav-link ${active(href) ? 'active' : ''}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="justify-self-end">
            <Link href="/commissions" className={`nav-link cta ${pathname.startsWith('/commissions') ? 'active' : ''}`}>Enquire</Link>
          </div>
        </nav>
      </header>

      {/* Mobile nav (< lg): bottom-pinned bar. Trimmed to primary destinations
          (Home + the four most-used routes) so labels never overflow on narrow
          screens. Process and Contact remain reachable via the footer. */}
      <nav aria-label="Mobile" className="mobile-bottom-nav lg:hidden">
        <Link href="/" className={`mobile-bottom-link ${pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        {NAV_LINKS.filter((l) => l.href === '/gallery' || l.href === '/series' || l.href === '/who-i-am').map(({ label, href }) => (
          <Link key={href} href={href} className={`mobile-bottom-link ${active(href) ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
        <Link href="/commissions" className={`mobile-bottom-link cta ${pathname.startsWith('/commissions') ? 'active' : ''}`}>
          Enquire
        </Link>
      </nav>
    </>
  )
}
