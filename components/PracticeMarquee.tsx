'use client'

const ITEMS = [
  'Figurative oil',
  'Melbourne studio',
  'Portraits & figures',
  'Selected commissions',
  'Dark colour fields',
  'Original works',
]

export function PracticeMarquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS].join(' · ')

  return (
    <div className="marquee-band border-y border-[var(--border)] bg-[rgba(16,13,10,0.72)]" aria-hidden="true">
      <div className="marquee-track font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-3">
        <span>{track}</span>
        <span aria-hidden="true">{track}</span>
      </div>
    </div>
  )
}