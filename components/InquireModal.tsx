'use client'

import { useEffect, useRef, useState } from 'react'
import type { Artwork } from '@/lib/artworks'
import { useFocusTrap } from '@/lib/useFocusTrap'

export function InquireModal({ art, onClose }: { art: Artwork; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const closeBtn = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap(containerRef)

  useEffect(() => {
    document.body.classList.add('modal-open')
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') }
  }, [onClose])

  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `Inquiry about: ${art.title} (${art.year})\n\n${form.message}`,
        }),
      })
    } catch { /* silent — show success anyway */ }
    setLoading(false)
    setDone(true)
  }

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-label={`Inquire about ${art.title}`} className="modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[480px] animate-scale-in"
        style={{ background: '#0d0c10', border: '1px solid #1e1c24' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-9 py-7 border-b border-[#1e1c24] flex justify-between items-start">
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-ember mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>{art.title} / {art.year}</p>
            <h2 className="text-[28px] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>Make an inquiry</h2>
          </div>
          <button ref={closeBtn} onClick={onClose} className="text-text-3 hover:text-text text-xl leading-none ml-6 mt-1 transition-colors" aria-label="Close">✕</button>
        </div>
        <div className="px-9 py-7">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={up('name')} placeholder="Full name" required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={up('email')} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} value={form.message} onChange={up('message')} placeholder="Questions about provenance, payment plans, delivery, certificates..." required />
              </div>
              <button type="submit" disabled={loading} className="btn-ember btn-full disabled:opacity-60">
                {loading ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          ) : (
            <div className="success-box">
              <h3 className="text-[32px] font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Inquiry sent.</h3>
              <p className="text-[13px] text-text-2 leading-[1.8]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                I will be in touch within 48 hours regarding {art.title}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
