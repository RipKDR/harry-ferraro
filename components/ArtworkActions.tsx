import Link from 'next/link'
import type { Artwork } from '@/lib/artworks'

export function ArtworkActions({ artwork }: { artwork: Artwork }) {
  const enquiryHref = `/commissions?artwork=${encodeURIComponent(artwork.slug)}`
  const previewHref = `/preview/${artwork.slug}`

  return (
    <div className="grid gap-3" aria-label="Artwork enquiry actions">
      <Link href={previewHref} className="btn-ember btn-full text-center">
        See on your wall
      </Link>
      <Link href={enquiryHref} className="btn-ink btn-full text-center">
        Ask about this work
      </Link>
      <Link href="/contact" className="btn-line btn-full text-center">
        Contact Harrison
      </Link>
    </div>
  )
}
