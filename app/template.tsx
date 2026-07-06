'use client'

import { motion, useReducedMotion } from 'motion/react'

// Opacity-only route fade: a vertical shift here would fight the shared-element
// view transition (the artwork morph measures the incoming element's rect).
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}
