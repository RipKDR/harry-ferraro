import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Not Found' }

export default function NotFound() {
  return (
    <div className="not-found-wrap">
      <div
        className="font-serif font-light text-ember mb-4 leading-none"
        style={{ fontSize: 'clamp(80px,18vw,180px)', opacity: 0.12 }}
        aria-hidden
      >
        404
      </div>
      <h1 className="font-serif font-light text-[36px] mb-4">This page doesn&apos;t exist.</h1>
      <p className="font-mono text-[13px] text-text-2 mb-10 max-w-[340px] leading-[1.8]">
        The work may have been moved or sold. Return to the gallery to browse available pieces.
      </p>
      <div className="flex gap-3">
        <Link href="/gallery" className="btn-ember">View Gallery</Link>
        <Link href="/" className="btn-ghost">Go Home</Link>
      </div>
    </div>
  )
}
