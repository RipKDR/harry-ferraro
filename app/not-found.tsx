import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 | Not Found' }

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 font-serif text-[clamp(5rem,18vw,13rem)] font-light leading-none text-oxide opacity-15" aria-hidden>
        404
      </div>
      <h1 className="font-serif text-[clamp(2.4rem,6vw,5rem)] font-light leading-none tracking-[-0.05em]">This page does not exist.</h1>
      <p className="mb-10 mt-5 max-w-[25rem] font-mono text-[0.86rem] leading-8 text-text-2">
        The page may have moved. Return to the gallery or start a commission enquiry.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/gallery" className="btn-ember">View gallery</Link>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  )
}
