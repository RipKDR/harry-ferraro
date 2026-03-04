'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BOT_LINKS = [
  { label: 'Home', href: '/', icon: '○' },
  { label: 'Gallery', href: '/gallery', icon: '▣' },
  { label: 'Series', href: '/series', icon: '◇' },
  { label: 'Work', href: '/commissions', icon: '+' },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-nav fixed bottom-0 left-0 right-0 z-[400] border-t border-[#38354a]"
      style={{ background: 'rgba(21,19,28,0.97)', backdropFilter: 'blur(24px) saturate(1.5)', paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around py-2">
        {BOT_LINKS.map(({ label, href, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-1 px-5 py-1.5 transition-colors"
              style={{ color: active ? '#c8570a' : '#7c768a' }}
            >
              <span className="text-sm leading-none">{icon}</span>
              <span className="text-[8px] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
