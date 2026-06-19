'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { SITE } from '@/lib/site'
import { ARTWORKS } from '@/lib/artworks'
import { Footer } from '@/components/Footer'

type FormState = {
  name: string
  email: string
  phone: string
  socialHandle: string
  artworkType: string
  preferredSize: string
  scaleNotes: string
  timeline: string
  description: string
  references: string
  consent: boolean
  company: string
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'not-configured'

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  socialHandle: '',
  artworkType: '',
  preferredSize: '',
  scaleNotes: '',
  timeline: '',
  description: '',
  references: '',
  consent: false,
  company: '',
}

const STEPS = [
  ['01', 'What', 'Send the person, idea, room, scale, timing, and references.'],
  ['02', 'Fit', 'Harrison checks whether it suits the work and what needs clearing up.'],
  ['03', 'Agreement', 'Scope, revision points, delivery, usage, and timeline are confirmed in writing.'],
  ['04', 'Making', 'Painting starts once the scope is clear. Progress updates are agreed case by case.'],
]

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
        <h1 className="font-serif text-[clamp(3.5rem,8vw,9rem)] leading-[0.86] tracking-[-0.07em]">Loading enquiry form.</h1>
      </section>
    </div>
  )
}

function CommissionsContent() {
  const searchParams = useSearchParams()
  const requestedArtwork = useMemo(() => ARTWORKS.find((artwork) => artwork.slug === searchParams.get('artwork')), [searchParams])
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    artworkType: requestedArtwork ? `Related to ${requestedArtwork.title}` : '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.artworkType) next.artworkType = 'Choose an enquiry type.'
    if (!form.preferredSize) next.preferredSize = 'Choose a size or scale.'
    if (!form.timeline) next.timeline = 'Choose a timeline.'
    if (form.description.trim().length < 20) next.description = 'Give at least a short brief.'
    if (!form.consent) next.consent = 'Consent is required so Harrison can reply.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const fallbackHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Studio enquiry')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSocial: ${form.socialHandle}\nType: ${form.artworkType}\nPreferred size: ${form.preferredSize}\nScale/range notes: ${form.scaleNotes}\nTimeline: ${form.timeline}\nReferences: ${form.references}\n\nIdea:\n${form.description}`)}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const response = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page-enter">
      <section className="section-pad site-shell border-b border-[var(--border)] pt-36 md:pt-44">
        <p className="eyebrow mb-5">Studio enquiry</p>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <h1 className="font-serif text-[clamp(3.8rem,9vw,10rem)] leading-[0.8] tracking-[-0.085em]">
            Tell me who or what the painting needs to hold.
          </h1>
          <p className="max-w-[40rem] font-mono text-[0.86rem] leading-8 text-text-2">
            Use this form for original work, selected commissions, studio contact, exhibitions, or collaboration. This starts a conversation. The site does not list prices or run checkout.
          </p>
        </div>
      </section>

      <section className="section-pad-tight site-shell border-b border-[var(--border)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Enquiry process">
          {STEPS.map(([number, title, body]) => (
            <div key={number} className="statement-panel">
              <p className="font-serif text-[2.8rem] leading-none text-oxide opacity-75">{number}</p>
              <h2 className="mt-5 font-serif text-[2rem] leading-none tracking-[-0.055em]">{title}</h2>
              <p className="mt-4 font-mono text-[0.78rem] leading-7 text-text-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad site-shell">
        {status === 'success' ? (
          <div className="success-box" role="status">
            <h2 className="font-serif text-[3.4rem] leading-none tracking-[-0.055em]">Enquiry sent.</h2>
            <p className="mt-4 font-mono text-[0.86rem] leading-8 text-text-2">Harrison will review it and reply using the contact details you provided.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="statement-panel" noValidate>
            <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company} onChange={update('company')} name="company" />

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" id="name" error={errors.name}><input id="name" className="form-input" value={form.name} onChange={update('name')} autoComplete="name" /></Field>
              <Field label="Email" id="email" error={errors.email}><input id="email" type="email" className="form-input" value={form.email} onChange={update('email')} autoComplete="email" /></Field>
              <Field label="Phone optional" id="phone"><input id="phone" className="form-input" value={form.phone} onChange={update('phone')} autoComplete="tel" /></Field>
              <Field label="Instagram or Facebook optional" id="social"><input id="social" className="form-input" value={form.socialHandle} onChange={update('socialHandle')} placeholder="@handle or profile URL" /></Field>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Enquiry type" id="artworkType" error={errors.artworkType}>
                <select id="artworkType" className="form-input" value={form.artworkType} onChange={update('artworkType')}>
                  <option value="">Select type</option>
                  <option>Original artwork enquiry</option>
                  <option>Portrait or figure commission</option>
                  <option>Piece inspired by an existing work</option>
                  <option>Exhibition, press, or collaboration</option>
                  <option>Related to {requestedArtwork?.title || 'a specific artwork'}</option>
                </select>
              </Field>
              <Field label="Preferred size or scale" id="preferredSize" error={errors.preferredSize}>
                <select id="preferredSize" className="form-input" value={form.preferredSize} onChange={update('preferredSize')}>
                  <option value="">Select scale</option>
                  <option>Small work</option>
                  <option>Medium work</option>
                  <option>Large work</option>
                  <option>Oversized work</option>
                  <option>Not sure yet</option>
                </select>
              </Field>
              <Field label="Scale / range notes optional" id="scaleNotes">
                <input id="scaleNotes" className="form-input" value={form.scaleNotes} onChange={update('scaleNotes')} placeholder="Anything Harrison should know about scope, room, or constraints" />
              </Field>
              <Field label="Timeline" id="timeline" error={errors.timeline}>
                <select id="timeline" className="form-input" value={form.timeline} onChange={update('timeline')}>
                  <option value="">Select timeline</option>
                  <option>Flexible</option>
                  <option>1 to 2 months</option>
                  <option>3 to 6 months</option>
                  <option>Specific date, details in brief</option>
                </select>
              </Field>
            </div>

            <div className="mt-5 space-y-5">
              <Field label="Description of idea" id="description" error={errors.description}>
                <textarea id="description" className="form-input" rows={7} value={form.description} onChange={update('description')} placeholder="Subject, feeling, colours, room, story, references, who it is for, and anything the work should avoid." />
              </Field>

              <Field label="Reference links or notes optional" id="references">
                <textarea id="references" className="form-input" rows={3} value={form.references} onChange={update('references')} placeholder="Paste public URLs or describe reference images." />
              </Field>

              <div>
                <label className="flex items-start gap-3 font-mono text-[0.78rem] leading-6 text-text-2">
                  <input type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-1" />
                  <span>I consent to being contacted about this enquiry using the details I provided.</span>
                </label>
                {errors.consent && <p className="form-error" role="alert">{errors.consent}</p>}
              </div>

              {status === 'error' && <p className="form-error" role="alert">The form could not be sent. Use the fallback email link below.</p>}
              {status === 'not-configured' && (
                <div className="border border-oxide bg-[rgba(182,93,44,.08)] p-5" role="alert">
                  <p className="mb-4 font-mono text-[0.82rem] leading-7 text-text-2">Email delivery is not configured yet. Use direct email for now.</p>
                  <a href={fallbackHref} className="btn-line">Send using email app</a>
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-ink btn-full" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                {status === 'loading' ? 'Sending...' : 'Send enquiry'}
              </button>
            </div>
          </form>
        )}
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
