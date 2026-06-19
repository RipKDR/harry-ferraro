import type { ReactNode } from 'react'

export function ArtFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`art-shell ${className}`.trim()}>
      <div
        className="art-core relative h-full w-full"
        // Stack a faint paper-toned inner hairline on top of the existing
        // .art-core dark inset (defined in globals.css) — both are listed so
        // the inline style does not clobber the class shadow.
        style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.35), inset 0 0 0 1px rgba(234,225,213,0.10)' }}
      >
        {children}
      </div>
    </div>
  )
}
