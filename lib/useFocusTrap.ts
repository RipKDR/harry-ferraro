import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    if (!active) return

    const trap = (e: KeyboardEvent) => {
      const el = ref.current
      if (!el || e.key !== 'Tab') return
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault() }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault() }
      }
    }

    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [ref, active])
}
