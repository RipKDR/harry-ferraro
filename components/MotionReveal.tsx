'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

type MotionRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'span' | 'section' | 'article' | 'header' | 'footer'
}

const TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
} as const

export function MotionReveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: MotionRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const Component = TAGS[as]

  if (reduceMotion) {
    return (
      <Component ref={ref as never} className={className}>
        {children}
      </Component>
    )
  }

  return (
    <Component
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE_EXPO }}
    >
      {children}
    </Component>
  )
}
