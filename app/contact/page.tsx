'use client'

import { useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { SITE } from '@/lib/site'
import { Footer } from '@/components/Footer'

type FormState = { name: string; email: string; subject: string; message: string; company: string }
type Status = 'idle' | 'loading' | 'success' | 'error' | 'not-configured'

const SUBJECTS = [
  ['original', 'Original artwork enquiry'],
  ['commission', 'Portrait or figure commission'],
  ['other', 'Exhibition, press, or collaboration'],
] as const

const INPUT_CLASS = 'w-full appearance-none border-0 border-b border-[var(--border)] bg-transparent py-3 font-mono text-[0.95rem] text-text outline-none transition-colors duration-300 focus:border-oxide placeholder:text-text-3'

export default function ContactPage() {
  const reduce = useReducedMotion()
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '', company: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<Status>('idle')
  const shakeControls = useAnimationControls()

  const shake = () => {
    if (reduce) return
    void shakeControls.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.45 } })
  }

  const update = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!validate()) {
      shake()
      return
    }
    setStatus('loading')
    const subjectLabel = SUBJECTS.find(([value]) => value === form.subject)?.[1]
    const message = subjectLabel ? `[${subjectLabel}]\n\n${form.message}` : form.message
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message, company: form.company }),
      })
      if (response.ok) return setStatus('success')
      if (response.status === 503) return setStatus('not-configured')
      setStatus('error')
      shake()
    } catch {
      setStatus('error')
      shake()
    }
  }

  return (
    <div className="page-enter">
      <section className="section-pad site-shell pt-36 md:pt-44">
        <p className="eyebrow mb-5">Contact</p>
        <a
          href={`mailto:${SITE.email}`}
          className="inline-block font-serif text-[clamp(2.8rem,5vw,7rem)] leading-[0.9] tracking-[-0.06em] underline-offset-[0.12em] hover:underline"
        >
          {SITE.email}
        </a>
        <p className="mt-6 font-mono text-[0.86rem] leading-8 text-text-2">Response within 48 hours.</p>

        <div className="mt-16 max-w-[42rem]">
          {status === 'success' ? (
            <div className="success-box" role="status">
              <h2 className="font-serif text-[3rem] leading-none tracking-[-0.055em]">Sent.</h2>
              <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will reply using the email address you provided.</p>
            </div>
          ) : (
            <motion.form
              onSubmit={submit}
              noValidate
              animate={shakeControls}
            >
              <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />
              <div className="space-y-9">
                <BareField label="Name" id="contact-name" error={errors.name}>
                  <input id="contact-name" className={INPUT_CLASS} value={form.name} onChange={update('name')} autoComplete="name" />
                </BareField>
                <BareField label="Email" id="contact-email" error={errors.email}>
                  <input id="contact-email" type="email" className={INPUT_CLASS} value={form.email} onChange={update('email')} autoComplete="email" />
                </BareField>
                <BareField label="Subject" id="contact-subject">
                  <select id="contact-subject" className={INPUT_CLASS} value={form.subject} onChange={update('subject')}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(([value, labelText]) => (
                      <option key={value} value={value}>{labelText}</option>
                    ))}
                  </select>
                </BareField>
                <BareField label="Message" id="contact-message" error={errors.message}>
                  <textarea id="contact-message" className={`${INPUT_CLASS} min-h-[120px] resize-none`} rows={5} value={form.message} onChange={update('message')} />
                </BareField>

                {(status === 'not-configured' || status === 'error') && (
                  <div className="border border-oxide bg-[rgba(182,93,44,.08)] p-5" role="alert">
                    <p className="mb-4 font-mono text-[0.82rem] leading-7 text-text-2">
                      {status === 'not-configured'
                        ? 'Email delivery is not configured yet. Use direct email for now.'
                        : 'The form could not be sent. Use direct email instead.'}
                    </p>
                    <a href={fallbackHref} className="btn-line">Send using email app</a>
                  </div>
                )}

                <SubmitButton status={status} />
              </div>
            </motion.form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function BareField({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block font-mono text-[0.58rem] uppercase tracking-[0.18em] text-text-3">{label}</label>
      {children}
      {error && <p className="mt-2 font-mono text-[0.72rem] text-oxide-2" role="alert">{error}</p>}
    </div>
  )
}

function SubmitButton({ status }: { status: Status }) {
  const text =
    status === 'loading' ? 'Sending'
    : status === 'success' ? 'Sent ✓'
    : status === 'error' ? 'Try again'
    : 'Send message'

  return (
    <button type="submit" disabled={status === 'loading'} className="group inline-flex min-h-[44px] items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-text disabled:opacity-60">
      <span>{text}</span>
      {status !== 'success' && (
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">&rarr;</span>
      )}
    </button>
  )
}
