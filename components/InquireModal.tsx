'use client'

import { useEffect, useRef, useState } from 'react'
import type { Artwork } from '@/lib/artworks'
import { priceLabel } from '@/lib/artworks'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { SITE, mailto } from '@/lib/site'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function InquireModal({ art, onClose }: { art: Artwork; onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
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
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company, // honeypot
          message: `Enquiry about: ${art.title} (${art.year}) — ${priceLabel(art)}\n\n${form.message}`,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const mailHref = `${mailto}?subject=${encodeURIComponent(`Enquiry: ${art.title}`)}`

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-label={`Enquire about ${art.title}`} className="modal-backdrop" onClick={onClose}>
      <div
        className="w-full max-w-[480px] animate-scale-in"
        style={{ background: '#1c1a24', border: '1px solid #38354a' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-9 py-7 border-b border-[#38354a] flex justify-between items-start">
          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-ember mb-2" style={{ fontFamily: 'var(--font-jetbrains)' }}>{art.title} / {art.year}</p>
            <h2 className="text-[28px] font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>Make an enquiry</h2>
          </div>
          <button ref={closeBtn} onClick={onClose} className="text-text-3 hover:text-text text-xl leading-none ml-6 mt-1 transition-colors" aria-label="Close">✕</button>
        </div>
        <div className="px-9 py-7">
          {status === 'success' ? (
            <div className="success-box">
              <h3 className="text-[32px] font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>Enquiry sent.</h3>
              <p className="text-[13px] text-text-2 leading-[1.8]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                {SITE.name} will be in touch within 48 hours regarding {art.title}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="iq-name">Name</label>
                  <input id="iq-name" className="form-input" value={form.name} onChange={up('name')} placeholder="Full name" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="iq-email">Email</label>
                  <input id="iq-email" className="form-input" type="email" value={form.email} onChange={up('email')} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="iq-msg">Message</label>
                <textarea id="iq-msg" className="form-input" rows={4} value={form.message} onChange={up('message')} placeholder="Questions about price, provenance, payment plans, delivery, certificates…" required />
              </div>
              {/* Honeypot — hidden from real users */}
              <input
                type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={form.company} onChange={up('company')}
                className="hidden" name="company"
              />
              {status === 'error' && (
                <p className="form-error" role="alert">
                  Couldn’t send just now. Please email <a href={mailHref} className="underline text-ember">{SITE.email}</a> directly.
                </p>
              )}
              <button type="submit" disabled={status === 'loading'} className="btn-ember btn-full disabled:opacity-60">
                {status === 'loading' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
