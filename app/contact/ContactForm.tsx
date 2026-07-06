'use client'

import { useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { SITE } from '@/lib/site'
import { DeliveryFallback, Field, INPUT_CLASS, SubmitButton, type FormStatus } from '@/components/FormPrimitives'

type FormState = { name: string; email: string; subject: string; message: string; company: string }

const SUBJECTS = [
  ['original', 'Original artwork enquiry'],
  ['commission', 'Portrait or figure commission'],
  ['other', 'Exhibition, press, or collaboration'],
] as const

// Field id map + focus order so the first invalid field receives focus on a
// failed submit (WCAG 3.3.1 / 4.1.3 — errors are announced and reachable).
const ERROR_FIELD_IDS = { name: 'contact-name', email: 'contact-email', message: 'contact-message' } as const
const ERROR_FIELD_ORDER = ['name', 'email', 'message'] as const

function focusFirstError(errs: Partial<FormState>) {
  for (const key of ERROR_FIELD_ORDER) {
    if (errs[key]) {
      document.getElementById(ERROR_FIELD_IDS[key])?.focus()
      return
    }
  }
}

export function ContactForm() {
  const reduce = useReducedMotion()
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '', company: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const shakeControls = useAnimationControls()

  const shake = () => {
    if (reduce) return
    void shakeControls.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.45 } })
  }

  const update = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = (): Partial<FormState> => {
    const next: Partial<FormState> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.message.trim().length < 10) next.message = 'Write at least 10 characters.'
    setErrors(next)
    return next
  }

  const fallbackHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs)
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

  if (status === 'success') {
    return (
      <div className="success-box" role="status">
        <h2 className="font-serif text-[3rem] leading-none tracking-[-0.055em]">Sent.</h2>
        <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will reply using the email address you provided.</p>
      </div>
    )
  }

  return (
    <motion.form onSubmit={submit} noValidate animate={shakeControls}>
      <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />
      <div className="space-y-9">
        <Field label="Name" id="contact-name" error={errors.name}>
          <input id="contact-name" className={INPUT_CLASS} value={form.name} onChange={update('name')} autoComplete="name" />
        </Field>
        <Field label="Email" id="contact-email" error={errors.email}>
          <input id="contact-email" type="email" className={INPUT_CLASS} value={form.email} onChange={update('email')} autoComplete="email" spellCheck={false} />
        </Field>
        <Field label="Subject" id="contact-subject">
          <select id="contact-subject" className={INPUT_CLASS} value={form.subject} onChange={update('subject')} autoComplete="off">
            <option value="">Select subject</option>
            {SUBJECTS.map(([value, labelText]) => (
              <option key={value} value={value}>{labelText}</option>
            ))}
          </select>
        </Field>
        <Field label="Message" id="contact-message" error={errors.message}>
          <textarea id="contact-message" className={`${INPUT_CLASS} min-h-[120px] resize-none`} rows={5} value={form.message} onChange={update('message')} autoComplete="off" />
        </Field>

        <DeliveryFallback status={status} fallbackHref={fallbackHref} />

        <SubmitButton status={status} />
      </div>
    </motion.form>
  )
}
