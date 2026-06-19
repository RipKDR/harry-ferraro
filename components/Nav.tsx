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
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return undefined
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`) || (href === '/who-i-am' && pathname === '/about')
  const immersivePreview = /^\/preview\/[^/]+$/.test(pathname)

  if (immersivePreview) return null

  return (
    <>
      <nav aria-label="Main navigation" className="fixed left-0 right-0 top-0 z-[400] px-4 pt-4 md:px-8">
        <div className={`mx-auto grid max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center border px-4 py-3 transition-all duration-500 ${
          scrolled
            ? 'border-[rgba(234,225,213,0.24)] bg-[rgba(7,6,7,0.88)] backdrop-blur-2xl'
            : 'border-[rgba(234,225,213,0.14)] bg-[rgba(7,6,7,0.58)] backdrop-blur-xl'
        }`}>
          <Link href="/" aria-label="Harrison Ferraro home" className="justify-self-start font-mono text-[0.68rem] uppercase tracking-[0.26em] text-text transition-colors hover:text-oxide">
            Harrison Ferraro
          </Link>

          <div className="desktop-nav flex items-center justify-center" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} role="listitem" className={`nav-link ${active(href) ? 'active' : ''}`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="desktop-nav justify-self-end">
            <Link href="/commissions" className={`nav-link cta ${pathname.startsWith('/commissions') ? 'active' : ''}`}>Enquire</Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className={`hamburger-btn justify-self-end ${menuOpen ? 'hamburger-open' : ''}`}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" style={{ width: '16px' }} />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <nav className="flex flex-col items-center gap-1">
          {[{ label: 'Home', href: '/' }, ...NAV_LINKS, { label: 'Enquire', href: '/commissions' }].map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`mobile-menu-link ${pathname === href ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
