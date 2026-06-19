'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const wordVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
}

type TextRevealProps = {
  children: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  splitBy?: 'words' | 'chars'
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  splitBy = 'words',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const parts = splitBy === 'words'
    ? children.split(' ')
    : children.split('')

  return (
    <div ref={ref}>
      <Tag className={className} aria-label={children}>
        <motion.span
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={wordVariants}
          transition={{ delay }}
          className="inline-flex flex-wrap"
        >
          {parts.map((part, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className="inline-block"
              style={{ marginRight: splitBy === 'words' ? '0.25em' : '0' }}
            >
              {part === ' ' ? '\u00A0' : part}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    </div>
  )
}
