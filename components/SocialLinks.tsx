import { SITE, SOCIAL } from '@/lib/site'

type Variant = 'pills' | 'inline'

/**
 * Real social links (Instagram + Facebook). Single source: lib/site.ts.
 */
export function SocialLinks({
  variant = 'pills',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const items = [SOCIAL.instagram, SOCIAL.facebook]

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}>
        {items.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-text-2 hover:text-ember transition-colors"
          >
            {s.label}
            <span className="text-text-3"> · {s.handle}</span>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex gap-2.5 flex-wrap ${className}`}>
      {items.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] tracking-[0.12em] uppercase px-3.5 py-2 border border-[#38354a] text-text-3 hover:text-text hover:border-[#7c768a] transition-colors"
          aria-label={`${SITE.name} on ${s.label}`}
        >
          {s.label}
        </a>
      ))}
    </div>
  )
}
