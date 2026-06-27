import type { ReactNode } from 'react'

export function ArtFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`art-shell ${className}`.trim()}>
      {/* The double inner hairline (dark + paper-toned) is defined on .art-core
          in globals.css so it isn't duplicated inline on every instance. */}
      <div className="art-core relative h-full w-full">
        {children}
      </div>
    </div>
  )
}
