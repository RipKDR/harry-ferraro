import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ARTWORKS } from '@/lib/artworks'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Wall preview',
  description: 'Use your phone camera to place a Harrison Ferraro painting on your wall.',
  robots: { index: true, follow: true },
}

export default function PreviewIndexPage() {
  return (
    <div className="page-enter min-h-[100dvh] border-b border-[var(--border)]">
      <header className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Virtual preview</p>
        <h1 className="max-w-[52rem] font-serif text-[clamp(3.4rem,9vw,9rem)] leading-[0.82] tracking-[-0.08em]">
          See a painting on your wall.
        </h1>
        <p className="mt-8 max-w-[40rem] font-mono text-[0.88rem] leading-8 text-text-2">
          Opens your camera (best on a phone). Drag and pinch to place the work. Save a photo to compare rooms or share with someone who needs to see it in context.
        </p>
      </header>

      <section className="section-pad site-shell" aria-label="Choose a painting">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTWORKS.map((artwork) => (
            <Link key={artwork.slug} href={`/preview/${artwork.slug}`} className="work-tile group block border border-[var(--border)] p-4 transition-colors hover:border-[var(--border-strong)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#050403]">
                <Image src={artwork.image} alt={artwork.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <h2 className="mt-4 font-serif text-[2.4rem] leading-none tracking-[-0.05em]">{artwork.title}</h2>
              <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-oxide">Open wall preview</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="site-shell px-5 pb-16 font-mono text-[0.72rem] leading-7 text-text-3 md:px-12 lg:px-[4.5rem]">
        Works on {SITE.siteUrl} over HTTPS. Allow camera access when prompted.
      </footer>
    </div>
  )
}