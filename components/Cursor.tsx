'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

type CursorState = 'default' | 'view' | 'link'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeFinePointer(callback: () => void) {
  const mql = window.matchMedia(FINE_POINTER_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getFinePointerSnapshot() {
  return window.matchMedia(FINE_POINTER_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function Cursor() {
  const reduce = useReducedMotion()
  const finePointer = useSyncExternalStore(subscribeFinePointer, getFinePointerSnapshot, getServerSnapshot)
  const enabled = finePointer && !reduce
  const [state, setState] = useState<CursorState>('default')

  // Raw pointer position
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Spring-lagged ring follow
  const ringX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (!enabled) return

    document.body.classList.add('cursor-active')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const value = el?.dataset.cursor
      setState(value === 'view' ? 'view' : value === 'link' ? 'link' : 'default')
    }

    const leave = () => {
      x.set(-100)
      y.set(-100)
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.body.classList.remove('cursor-active')
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const ringSize = state === 'view' ? 56 : state === 'link' ? 8 : 32

  return (
    <>
      {/* Precise dot (no lag) */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '999px',
          background: 'var(--oxide-2)',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
          opacity: state === 'link' ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Spring-lagged ring */}
      <motion.div
        aria-hidden="true"
        animate={{ width: ringSize, height: ringSize }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '999px',
          border: state === 'link' ? 'none' : '1px solid var(--oxide)',
          background: state === 'link' ? 'var(--oxide)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 9997,
          mixBlendMode: 'difference',
        }}
      >
        <motion.span
          aria-hidden="true"
          animate={{ opacity: state === 'view' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            userSelect: 'none',
          }}
        >
          View
        </motion.span>
      </motion.div>
    </>
  )
}
