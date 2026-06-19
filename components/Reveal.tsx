'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

type RevealProps = {
  children: ReactNode
  className?: string
  delayMs?: number
  as?: 'div' | 'section' | 'article'
} & Pick<HTMLMotionProps<'div'>, 'id' | 'aria-label' | 'aria-labelledby' | 'aria-hidden'>

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const

export function Reveal({ children, className = '', delayMs = 0, as = 'div', ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Component = TAGS[as]

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px', amount: 0.12 }}
      transition={{ duration: 1.1, delay: delayMs / 1000, ease: [0.32, 0.72, 0, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}