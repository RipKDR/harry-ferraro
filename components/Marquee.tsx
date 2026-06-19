const ITEMS = ['Harrison Ferraro', 'Melbourne painter', 'Figurative oil painting', 'Studio enquiries']

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[var(--border)] py-3" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.22em] text-text-3">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
      </div>
    </div>
  )
}
