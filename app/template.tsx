'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}