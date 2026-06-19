'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
  clipReveal: {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: { clipPath: 'inset(0% 0 0 0)' },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
}

type MotionRevealProps = {
  children: ReactNode
  variant?: keyof typeof variants
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
  as?: 'div' | 'span' | 'section' | 'article' | 'header' | 'footer'
}

export function MotionReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  amount = 0.08,
  as = 'div',
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const Tag = as

  return (
    <Tag ref={ref as any}>
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants[variant]}
        transition={{
          duration,
          delay,
          ease: easeOutExpo,
        }}
        className={className}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </Tag>
  )
}
