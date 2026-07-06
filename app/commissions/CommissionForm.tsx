'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { SITE } from '@/lib/site'
import { AVAILABLE_ARTWORKS } from '@/lib/artworks'
import { DeliveryFallback, Field, INPUT_CLASS, SubmitButton, type FormStatus } from '@/components/FormPrimitives'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  company: string
}

const SUBJECTS = [
  ['original', 'Original artwork enquiry'],
  ['commission', 'Portrait or figure commission'],
  ['other', 'Exhibition, press, or collaboration'],
] as const

// Field id map + focus order so the first invalid field receives focus on a
// failed submit (WCAG 3.3.1 / 4.1.3 — errors are announced and reachable).
const ERROR_FIELD_IDS = { name: 'c-name', email: 'c-email', subject: 'c-subject', message: 'c-message' } as const
const ERROR_FIELD_ORDER = ['name', 'email', 'subject', 'message'] as const

function focusFirstError(errs: Partial<Record<keyof FormState, string>>) {
  for (const key of ERROR_FIELD_ORDER) {
    if (errs[key]) {
      document.getElementById(ERROR_FIELD_IDS[key])?.focus()
      return
    }
  }
}

export function CommissionForm() {
  const reduce = useReducedMotion()
  const searchParams = useSearchParams()
  const requestedArtwork = useMemo(() => AVAILABLE_ARTWORKS.find((artwork) => artwork.slug === searchParams.get('artwork')), [searchParams])

  const [form, setForm] = useState<FormState>(() => ({
    name: '',
    email: '',
    subject: requestedArtwork ? 'commission' : '',
    message: requestedArtwork ? `Enquiry related to "${requestedArtwork.title}".\n\n` : '',
    company: '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
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

  const validate = (): Partial<Record<keyof FormState, string>> => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.subject) next.subject = 'Choose a subject.'
    if (form.message.trim().length < 20) next.message = 'Give at least a short brief.'
    setErrors(next)
    return next
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs)
      shake()
      return
    }
    setStatus('loading')
    const subjectLabel = SUBJECTS.find(([value]) => value === form.subject)?.[1] ?? 'Original artwork enquiry'
    const payload = {
      name: form.name,
      email: form.email,
      phone: '',
      socialHandle: '',
      artworkType: requestedArtwork ? `${subjectLabel} (related to ${requestedArtwork.title})` : subjectLabel,
      preferredSize: 'Not sure yet',
      scaleNotes: '',
      timeline: 'Flexible',
      description: form.message,
      references: '',
      consent: true,
      company: form.company,
    }
    try {
      const response = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        setStatus('success')
        return
      }
      if (response.status === 503) {
        setStatus('not-configured')
        return
      }
      setStatus('error')
      shake()
    } catch {
      setStatus('error')
      shake()
    }
  }

  const fallbackHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Studio enquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`

  if (status === 'success') {
    return (
      <div className="success-box" role="status">
        <h2 className="font-serif text-[3.4rem] leading-none tracking-[-0.055em]">Sent.</h2>
        <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will review your note and reply using the email you provided.</p>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      className="max-w-[42rem]"
      animate={shakeControls}
    >
      <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />

      <div className="space-y-9">
        <Field label="Name" id="c-name" error={errors.name}>
          <input id="c-name" className={INPUT_CLASS} value={form.name} onChange={update('name')} autoComplete="name" />
        </Field>
        <Field label="Email" id="c-email" error={errors.email}>
          <input id="c-email" type="email" className={INPUT_CLASS} value={form.email} onChange={update('email')} autoComplete="email" spellCheck={false} />
        </Field>
        <Field label="Subject" id="c-subject" error={errors.subject}>
          <select id="c-subject" className={INPUT_CLASS} value={form.subject} onChange={update('subject')} autoComplete="off">
            <option value="">Select subject</option>
            {SUBJECTS.map(([value, labelText]) => (
              <option key={value} value={value}>{labelText}</option>
            ))}
          </select>
        </Field>
        <Field label="Message" id="c-message" error={errors.message}>
          <textarea id="c-message" className={`${INPUT_CLASS} min-h-[120px] resize-none`} rows={5} value={form.message} onChange={update('message')} autoComplete="off" placeholder="Subject, feeling, room, scale, timing, and anything the work should avoid." />
        </Field>

        <DeliveryFallback status={status} fallbackHref={fallbackHref} />

        <SubmitButton status={status} />
      </div>
    </motion.form>
  )
}
