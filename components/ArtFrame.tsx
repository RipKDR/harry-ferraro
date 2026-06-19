import type { ReactNode } from 'react'

export function ArtFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`art-shell ${className}`.trim()}>
      <div className="art-core relative h-full w-full">{children}</div>
    </div>
  )
}