'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE, SOCIAL_LINKS } from '@/lib/site'
import { Footer } from '@/components/Footer'

type FormState = { name: string; email: string; message: string; company: string }
type Status = 'idle' | 'loading' | 'success' | 'error' | 'not-configured'

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<FormState> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.message.trim().length < 10) next.message = 'Write at least 10 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const fallbackHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (response.ok) return setStatus('success')
      if (response.status === 503) return setStatus('not-configured')
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page-enter">
      <section className="section-pad site-shell pt-36 md:pt-44">
        <p className="eyebrow mb-5">Contact</p>
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h1 className="font-serif text-[clamp(3.8rem,9vw,10rem)] leading-[0.8] tracking-[-0.085em]">
              Studio contact, artwork questions, press, or collaboration.
            </h1>
            <p className="mt-7 max-w-[36rem] font-mono text-[0.86rem] leading-8 text-text-2">
              Send a note if you want to ask about a painting, talk about a commission, discuss an exhibition, or contact Harrison directly.
            </p>
            <Link href="/commissions" className="btn-ink mt-8">Start a conversation</Link>

            <dl className="mt-12">
              <div className="info-row"><dt className="info-key">Email</dt><dd className="info-val"><a href={`mailto:${SITE.email}`} className="hover:text-oxide">{SITE.email}</a></dd></div>
              <div className="info-row"><dt className="info-key">Location</dt><dd className="info-val">{SITE.location}</dd></div>
              {SOCIAL_LINKS.map((link) => (
                <div className="info-row" key={link.href}>
                  <dt className="info-key">{link.label}</dt>
                  <dd className="info-val"><a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-oxide">{link.handle}</a></dd>
                </div>
              ))}
            </dl>
          </div>

          {status === 'success' ? (
            <div className="success-box" role="status">
              <h2 className="font-serif text-[3rem] leading-none tracking-[-0.055em]">Message sent.</h2>
              <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will reply using the email address you provided.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="statement-panel" noValidate>
              <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />
              <div className="space-y-5">
                <Field label="Name" id="contact-name" error={errors.name}><input id="contact-name" className="form-input" value={form.name} onChange={update('name')} autoComplete="name" /></Field>
                <Field label="Email" id="contact-email" error={errors.email}><input id="contact-email" type="email" className="form-input" value={form.email} onChange={update('email')} autoComplete="email" /></Field>
                <Field label="Message" id="contact-message" error={errors.message}><textarea id="contact-message" className="form-input" rows={8} value={form.message} onChange={update('message')} /></Field>

                {status === 'error' && <p className="form-error" role="alert">The form could not be sent. Use the fallback email link below.</p>}
                {status === 'not-configured' && (
                  <div className="border border-oxide bg-[rgba(182,93,44,.08)] p-5" role="alert">
                    <p className="mb-4 font-mono text-[0.82rem] leading-7 text-text-2">Email delivery is not configured yet. Use direct email for now.</p>
                    <a href={fallbackHref} className="btn-line">Send using email app</a>
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-ink btn-full" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                  {status === 'loading' ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      {children}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}
