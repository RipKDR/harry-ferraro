'use client'

import { useEffect, useRef } from 'react'

const HOVER_SELECTOR = 'a, button, [role="button"], .gallery-card, .feat-card, .series-card, .gallery-item'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return

    let bx = -100, by = -100, ax = -100, ay = -100
    let raf: number

    const move = (e: MouseEvent) => {
      ax = e.clientX; ay = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${ax - 2.5}px, ${ay - 2.5}px)`
    }

    const lerp = () => {
      bx += (ax - bx) * 0.1
      by += (ay - by) * 0.1
      if (ring.current) ring.current.style.transform = `translate(${bx - 19}px, ${by - 19}px)`
      raf = requestAnimationFrame(lerp)
    }

    const over = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) document.body.classList.add('cursor-hover')
    }
    const out = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) document.body.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseout', out, { passive: true })
    raf = requestAnimationFrame(lerp)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} id="cursor-dot" aria-hidden="true" />
      <div ref={ring} id="cursor-ring" aria-hidden="true" />
    </>
  )
}
