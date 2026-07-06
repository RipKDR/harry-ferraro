'use client'

import * as React from 'react'

type TransitionProps = { name: string; children: React.ReactNode }

// React's ViewTransition component is experimental (enabled through Next's
// `experimental.viewTransition` flag). Resolve it dynamically so the site
// degrades to a plain wrapper if the export is absent, instead of crashing.
const NativeViewTransition = (React as unknown as Record<string, unknown>).ViewTransition as
  | React.ComponentType<{ name?: string; children?: React.ReactNode }>
  | undefined

/**
 * Tags a painting with a stable view-transition name so it morphs between the
 * gallery index card and the artwork detail hero during navigation. Browsers
 * without the View Transitions API simply navigate as usual.
 */
export function ArtworkTransition({ name, children }: TransitionProps) {
  if (!NativeViewTransition) return <>{children}</>
  return <NativeViewTransition name={name}>{children}</NativeViewTransition>
}
