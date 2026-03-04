'use client'

import { useEffect, useRef, useState } from 'react'

type StatCounterProps = {
  value: number
  suffix?: string
  label: string
}

export function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const start = Date.now()
          const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setCount(Math.floor(ease * value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <div ref={ref} className="reveal px-12 py-[52px] border-r border-[#38354a] last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0">
      <div
        className="text-ember leading-none mb-2.5"
        style={{ fontFamily: 'var(--font-cormorant)', fontSize: '68px', fontWeight: 300 }}
      >
        {count}{suffix}
      </div>
      <div
        className="text-[10.5px] tracking-[0.18em] uppercase text-text-2"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </div>
    </div>
  )
}
