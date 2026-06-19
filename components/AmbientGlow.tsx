'use client'

import { motion } from 'framer-motion'

type AmbientGlowProps = {
  color?: string
  size?: number
  className?: string
  animate?: boolean
}

export function AmbientGlow({
  color = 'rgba(212, 90, 14, 0.15)',
  size = 400,
  className = '',
  animate = true,
}: AmbientGlowProps) {
  return (
    <motion.div
      className={`ambient-glow ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={animate ? {
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
      } : undefined}
      transition={animate ? {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      } : undefined}
    />
  )
}
