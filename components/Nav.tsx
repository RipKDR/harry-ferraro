'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Series', href: '/series' },
  { label: 'Process', href: '/process' },
  { label: 'About', href: '/about' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 60), [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Keyboard trap
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[400] flex items-center justify-between transition-all max-md:px-6 ${
          scrolled
            ? 'px-[52px] py-[17px] bg-[rgba(21,19,28,0.97)] backdrop-blur-2xl border-b border-[#38354a]'
            : 'px-[52px] py-7 bg-gradient-to-b from-[rgba(21,19,28,0.9)] to-transparent'
        }`}
        style={{ transitionDuration: '0.4s', transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        <Link
          href="/"
          aria-label="Harry Ferraro — Home"
          className="font-serif text-[21px] font-medium tracking-[0.02em] text-text hover:opacity-75 transition-opacity"
        >
          Harry Ferraro<span className="text-ember">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav flex items-center gap-0" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              role="listitem"
              className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/commissions" className="nav-link cta">Commission</Link>
        </div>

        {/* Hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={`hamburger-btn hidden max-md:flex flex-col gap-[5px] p-2 z-[450] relative ${menuOpen ? 'hamburger-open' : ''}`}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" style={{ width: '16px' }} />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
      >
        <nav className="flex flex-col items-center gap-2">
          {[{ label: 'Home', href: '/' }, ...NAV_LINKS, { label: 'Commissions', href: '/commissions' }, { label: 'Contact', href: '/contact' }].map(({ label, href }, i) => (
            <Link
              key={href}
              href={href}
              className="mobile-menu-link"
              style={{ transitionDelay: menuOpen ? `${i * 0.04}s` : '0s', opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'none' : 'translateY(12px)', transition: 'opacity 0.4s, transform 0.4s' }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div
          className="absolute bottom-16 text-[9px] tracking-[0.2em] uppercase text-text-3"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Harrisonferraro99@gmail.com
        </div>
      </div>
    </>
  )
}
