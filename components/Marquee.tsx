const ITEMS = [
  'Original fine art', 'Oil on canvas', 'Mixed media', 'Melbourne, AU',
  'Fire series', 'Wind series', 'Portraits', 'Private commissions',
  'Harrison Ferraro', 'Figurative painting', 'One of one', 'No prints, no editions',
]

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]
  return (
    <div className="border-t border-b border-[#38354a] overflow-hidden flex" aria-hidden="true">
      {[0, 1].map((t) => (
        <div key={t} className={`marquee-track ${t === 1 ? 'marquee-track-2' : ''}`}>
          {doubled.map((item, i) => (
            <span
              key={i}
              className="px-10 py-[17px] text-[10px] tracking-[0.18em] uppercase text-text-3 border-r border-[#38354a] flex items-center gap-3.5 whitespace-nowrap"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              <span className="w-[3px] h-[3px] bg-ember rounded-full flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
