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
    <div className="border-y border-[var(--border)] bg-[rgba(16,13,10,0.72)]" aria-hidden="true">
      <div className="marquee-band">
        <div
          className="marquee-track font-serif italic text-[clamp(1.3rem,2.6vw,2.1rem)] tracking-[-0.01em] text-text-2"
          style={{ opacity: 0.42, animationDuration: '38s' }}
        >
          <span>{track}</span>
          <span aria-hidden="true">{track}</span>
        </div>
      </div>
      <div className="marquee-band border-t border-[var(--border)]">
        <div
          className="marquee-track font-serif italic text-[clamp(1.3rem,2.6vw,2.1rem)] tracking-[-0.01em] text-text-3"
          style={{ opacity: 0.32, animationDuration: '38s', animationDirection: 'reverse' }}
        >
          <span>{track}</span>
          <span aria-hidden="true">{track}</span>
        </div>
      </div>
    </div>
  )
}
