'use client'

import { motion, useInView, useReducedMotion, type Variants } from 'motion/react'
import { useRef } from 'react'

const EASE_EXPO = [0.16, 1, 0.3, 1] as const

const group: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

const groupItem: Variants = {
  hidden: { y: 32, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: EASE_EXPO },
  },
}

type TextRevealProps = {
  text: string
  groupSize?: number
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

function chunk(words: string[], size: number): string[] {
  const out: string[] = []
  for (let i = 0; i < words.length; i += size) {
    out.push(words.slice(i, i + size).join(' '))
  }
  return out
}

export function TextReveal({
  text,
  groupSize = 5,
  className = '',
  as: Tag = 'div',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const groups = chunk(text.split(/\s+/).filter(Boolean), Math.max(1, groupSize))

  if (reduceMotion) {
    return (
      <Tag ref={ref as never} className={className}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        variants={group}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        className="inline"
      >
        {groups.map((g, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ marginRight: i < groups.length - 1 ? '0.28em' : 0 }}
          >
            <motion.span variants={groupItem} className="inline-block">
              {g}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
