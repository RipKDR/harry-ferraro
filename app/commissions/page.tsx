'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { SITE } from '@/lib/site'
import { ARTWORKS } from '@/lib/artworks'
import { Footer } from '@/components/Footer'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  company: string
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'not-configured'

const SUBJECTS = [
  ['original', 'Original artwork enquiry'],
  ['commission', 'Portrait or figure commission'],
  ['other', 'Exhibition, press, or collaboration'],
] as const

const PROCESS = [
  ['01', 'Reach out'],
  ['02', 'We discuss the work'],
  ['03', 'I paint'],
] as const

const FAQ = [
  [
    'How does pricing work?',
    'Every painting is quoted individually after the brief — size, complexity, and framing all move it. There is no public price list and no checkout; the number is agreed directly, in writing, before work begins.',
  ],
  [
    'What sizes can you paint?',
    'From small studies to large statement canvases. If you are not sure what suits the space, describe the wall and the room in your message — scale is one of the first things worked out together.',
  ],
  [
    'How long will it take?',
    'It depends on the painting and the current queue. A realistic timeline is part of the written agreement before the work starts, so there are no surprises either way.',
  ],
  [
    'Do you ship?',
    'Melbourne collection or delivery can be arranged directly. Shipping within Australia and internationally is quoted per work, and packing and care details are confirmed before the painting leaves the studio.',
  ],
  [
    'Can I ask about a painting already on the site?',
    'Yes. Every original in the work index can be enquired about directly — choose “Original artwork enquiry” and name the painting, or use the enquiry button on its page.',
  ],
] as const

const INPUT_CLASS = 'w-full appearance-none border-0 border-b border-[var(--border)] bg-transparent py-3 font-mono text-[0.95rem] text-text outline-none transition-colors duration-300 focus:border-oxide placeholder:text-text-3'

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

export default function CommissionsPage() {
  return (
    <Suspense fallback={<CommissionsFallback />}>
      <CommissionsContent />
    </Suspense>
  )
}

function CommissionsFallback() {
  return (
    <div className="page-enter">
      <section className="section-pad site-shell min-h-screen pt-36 md:pt-44">
        <p className="eyebrow mb-5">Studio enquiry</p>
        <h1 className="font-serif text-[clamp(3.2rem,6vw,8rem)] leading-[0.86] tracking-[-0.07em]">Loading enquiry form.</h1>
      </section>
    </div>
  )
}

function CommissionsContent() {
  const reduce = useReducedMotion()
  const searchParams = useSearchParams()
  const requestedArtwork = useMemo(() => ARTWORKS.find((artwork) => artwork.slug === searchParams.get('artwork')), [searchParams])

  const [form, setForm] = useState<FormState>(() => ({
    name: '',
    email: '',
    subject: requestedArtwork ? 'commission' : '',
    message: requestedArtwork ? `Enquiry related to "${requestedArtwork.title}".\n\n` : '',
    company: '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
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

  return (
    <div className="page-enter">
      <section className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Commissions</p>
        <h1 className="max-w-[24ch] font-serif text-[clamp(3.2rem,6vw,8rem)] leading-[0.84] tracking-[-0.075em]">
          I accept a limited number of commissions each year.
        </h1>
      </section>

      <section className="section-pad-tight site-shell border-b border-[var(--border)]">
        <div className="grid gap-10 md:grid-cols-3" aria-label="Commission process">
          {PROCESS.map(([number, phrase]) => (
            <div key={number}>
              <p className="font-serif text-[clamp(3.6rem,7vw,6rem)] leading-none text-oxide opacity-50">{number}</p>
              <p className="mt-4 font-mono text-[0.86rem] uppercase tracking-[0.12em] text-text-2">{phrase}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad site-shell">
        {status === 'success' ? (
          <div className="success-box" role="status">
            <h2 className="font-serif text-[3.4rem] leading-none tracking-[-0.055em]">Sent.</h2>
            <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will review your note and reply using the email you provided.</p>
          </div>
        ) : (
          <motion.form
            onSubmit={submit}
            noValidate
            className="max-w-[42rem]"
            animate={shakeControls}
          >
            <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />

            <div className="space-y-9">
              <BareField label="Name" id="c-name" error={errors.name}>
                <input id="c-name" className={INPUT_CLASS} value={form.name} onChange={update('name')} autoComplete="name" />
              </BareField>
              <BareField label="Email" id="c-email" error={errors.email}>
                <input id="c-email" type="email" className={INPUT_CLASS} value={form.email} onChange={update('email')} autoComplete="email" spellCheck={false} />
              </BareField>
              <BareField label="Subject" id="c-subject" error={errors.subject}>
                <select id="c-subject" className={INPUT_CLASS} value={form.subject} onChange={update('subject')} autoComplete="off">
                  <option value="">Select subject</option>
                  {SUBJECTS.map(([value, labelText]) => (
                    <option key={value} value={value}>{labelText}</option>
                  ))}
                </select>
              </BareField>
              <BareField label="Message" id="c-message" error={errors.message}>
                <textarea id="c-message" className={`${INPUT_CLASS} min-h-[120px] resize-none`} rows={5} value={form.message} onChange={update('message')} autoComplete="off" placeholder="Subject, feeling, room, scale, timing, and anything the work should avoid." />
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
      </section>

      <section className="section-pad site-shell border-t border-[var(--border)]" aria-labelledby="faq-heading">
        <div className="grid gap-12 lg:grid-cols-[0.62fr_1fr]">
          <div>
            <p className="eyebrow mb-5">Before you ask</p>
            <h2 id="faq-heading" className="font-serif text-[clamp(2.6rem,5vw,5.5rem)] leading-[0.88] tracking-[-0.06em]">
              The practical side, answered plainly.
            </h2>
          </div>
          <div>
            {FAQ.map(([question, answer]) => (
              <details key={question} className="faq-item">
                <summary>
                  <h3 className="font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-tight tracking-[-0.03em] transition-colors duration-200">{question}</h3>
                </summary>
                <p className="max-w-[40rem] pb-8 font-mono text-[0.86rem] leading-8 text-text-2">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function BareField({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-3">{label}</label>
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
    <button type="submit" disabled={status === 'loading'} className="group inline-flex min-h-[44px] items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-text disabled:opacity-60">
      <span>{text}</span>
      {status !== 'success' && (
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">&rarr;</span>
      )}
    </button>
  )
}
