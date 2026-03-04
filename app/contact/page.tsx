'use client'

import { useState } from 'react'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

type FormState = { name: string; email: string; message: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

const CONTACT_ITEMS = [
  { label: 'Email', value: 'Harrisonferraro99@gmail.com', href: 'mailto:Harrisonferraro99@gmail.com' },
  { label: 'Instagram', value: '@harryferraroart', href: 'https://instagram.com/harryferraroart' },
  { label: 'Location', value: 'Melbourne, AU', href: null },
  { label: 'Response', value: 'Within 48 hours', href: null },
]

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })

  const up = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Please enter your name'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Please enter a valid email'
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page-enter">
      <div className="max-w-[580px] mx-auto px-[52px] pt-[160px] pb-[160px] max-md:px-6">
        <Reveal><div className="eyebrow mb-4">Get in Touch</div></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif font-light leading-[1.03] mb-16" style={{ fontSize: 'clamp(38px,6vw,72px)' }}>
            Say<br /><em className="italic">something.</em>
          </h1>
        </Reveal>

        {status === 'success' ? (
          <Reveal>
            <div className="success-box">
              <h2 className="font-serif font-light text-[32px] mb-4">Message sent.</h2>
              <p className="font-mono text-[14px] text-text-2 leading-[1.8]">I will get back to you within 48 hours.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="form-label" htmlFor="ct-name">Name</label>
                <input id="ct-name" className="form-input" value={form.name} onChange={up('name')} placeholder="Your name" aria-invalid={!!errors.name} />
                {errors.name && <p className="form-error" role="alert">{errors.name}</p>}
              </div>
              <div>
                <label className="form-label" htmlFor="ct-email">Email</label>
                <input id="ct-email" type="email" className="form-input" value={form.email} onChange={up('email')} placeholder="your@email.com" aria-invalid={!!errors.email} />
                {errors.email && <p className="form-error" role="alert">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label" htmlFor="ct-msg">Message</label>
                <textarea id="ct-msg" className="form-input" rows={6} value={form.message} onChange={up('message')} placeholder="What is on your mind?" aria-invalid={!!errors.message} />
                {errors.message && <p className="form-error" role="alert">{errors.message}</p>}
              </div>
              {status === 'error' && <p className="form-error" role="alert">Something went wrong. Try emailing directly.</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-ember btn-full mt-2" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        )}

        <Reveal delay={0.3} className="mt-20 pt-12 border-t border-[#38354a]">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-3 mb-6">Or find me here</p>
          <dl>
            {CONTACT_ITEMS.map(({ label, value, href }) => (
              <div key={label} className="info-row">
                <dt className="info-key">{label}</dt>
                <dd className="info-val">
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-ember transition-colors">{value}</a>
                  ) : value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <Footer />
    </div>
  )
}
