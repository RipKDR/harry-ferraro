'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { SITE, mailto } from '@/lib/site'

type F = {
  name: string
  email: string
  phone: string
  social: string
  artworkType: string
  size: string
  budget: string
  timeline: string
  description: string
  consent: boolean
  company: string // honeypot
}

type Attachment = { filename: string; content: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

const ARTWORK_TYPES = ['Portrait', 'Figurative', 'Abstract / colour study', 'Other (describe below)']
const SIZES = ['Small (up to 50 cm)', 'Medium (50–100 cm)', 'Large (100 cm +)', 'Not sure yet']
const BUDGETS = ['Under A$1,000', 'A$1,000 – 2,500', 'A$2,500 – 5,000', 'A$5,000 +', 'Not sure yet']
const TIMELINES = ['Flexible — no deadline', 'Within 3 months', 'Within 6 weeks', 'Specific date (note below)']

const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4MB

const EMPTY: F = {
  name: '', email: '', phone: '', social: '', artworkType: '', size: '',
  budget: '', timeline: '', description: '', consent: false, company: '',
}

export default function CommissionsPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({})
  const [form, setForm] = useState<F>(EMPTY)
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const up = (k: keyof F) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((f) => ({ ...f, [k]: value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    const file = e.target.files?.[0]
    if (!file) { setAttachment(null); return }
    if (!file.type.startsWith('image/')) { setFileError('Please choose an image file.'); return }
    if (file.size > MAX_IMAGE_BYTES) { setFileError('Image must be under 4 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      setAttachment({ filename: file.name, content: result.split(',')[1] ?? '' })
    }
    reader.onerror = () => setFileError('Could not read that file. Try another.')
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const e: Partial<Record<keyof F, string>> = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your name'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.artworkType) e.artworkType = 'Select a type of work'
    if (!form.size) e.size = 'Select a size'
    if (!form.budget) e.budget = 'Select a budget range'
    if (!form.timeline) e.timeline = 'Select a timeline'
    if (form.description.trim().length < 20) e.description = 'Tell me a little more (at least 20 characters)'
    if (!form.consent) e.consent = 'Please tick the box so I can reply'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachment }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page-enter">
      <div className="max-w-[840px] mx-auto px-[52px] pt-[160px] pb-[160px] max-md:px-6">

        <Reveal><div className="eyebrow mb-4">Commission a Work</div></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif font-light leading-[1.03] mb-5" style={{ fontSize: 'clamp(38px,6vw,72px)' }}>
            Something made<br /><em className="italic">only for you</em>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="font-mono text-[14px] text-text-2 leading-[1.85] max-w-[560px] mb-6">
            I take on a small number of commissions at a time. If you have an idea — a portrait,
            a figure, a feeling you want made permanent — tell me about it below. There’s no
            obligation; the first step is just a conversation.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="font-mono text-[12px] text-text-3 leading-[1.85] max-w-[560px] mb-16">
            Prefer email? Write to{' '}
            <a href={mailto} className="text-ember hover:underline">{SITE.email}</a>.
          </p>
        </Reveal>

        {/* How it works */}
        <Reveal delay={0.2} className="grid grid-cols-3 gap-5 mb-16 max-sm:grid-cols-1">
          {[
            { n: '01', t: 'We talk', b: 'A conversation about the work you want to live with. No commitment yet.' },
            { n: '02', t: 'I paint', b: 'Once the idea and details are agreed, focused studio time. Progress shared at key stages.' },
            { n: '03', t: 'It arrives', b: 'Professionally packed and delivered when you’re happy with it.' },
          ].map(({ n, t, b }) => (
            <div key={n} className="p-6 border border-[#38354a] bg-[#22202c]">
              <div className="font-serif text-[36px] font-light text-ember opacity-60 mb-3 italic">{n}</div>
              <div className="font-serif text-[18px] font-light mb-2">{t}</div>
              <p className="font-mono text-[12px] text-text-2 leading-[1.7]">{b}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.25}>
          <p className="font-mono text-[11px] text-text-3 leading-[1.8] max-w-[560px] mb-12 italic">
            Note: timelines, deposits, revisions and delivery are agreed together before any work
            begins — the details below just help me understand what you have in mind. (Draft terms,
            for discussion — not a contract.)
          </p>
        </Reveal>

        {status === 'success' ? (
          <Reveal>
            <div className="success-box">
              <h2 className="font-serif font-light text-[32px] mb-4">Received.</h2>
              <p className="font-mono text-[14px] text-text-2 leading-[1.8]">
                Thanks — I’ll read this properly and get back to you within 48 hours.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="cm-name">Your Name</label>
                  <input id="cm-name" className="form-input" value={form.name} onChange={up('name')} placeholder="Full name" aria-invalid={!!errors.name} />
                  {errors.name && <p className="form-error" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="cm-email">Email</label>
                  <input id="cm-email" type="email" className="form-input" value={form.email} onChange={up('email')} placeholder="your@email.com" aria-invalid={!!errors.email} />
                  {errors.email && <p className="form-error" role="alert">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="cm-phone">Phone <span className="text-text-3 normal-case">(optional)</span></label>
                  <input id="cm-phone" type="tel" className="form-input" value={form.phone} onChange={up('phone')} placeholder="Best number to reach you" />
                </div>
                <div>
                  <label className="form-label" htmlFor="cm-social">Instagram / Facebook <span className="text-text-3 normal-case">(optional)</span></label>
                  <input id="cm-social" className="form-input" value={form.social} onChange={up('social')} placeholder="@yourhandle" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="cm-type">Type of Work</label>
                  <select id="cm-type" className="form-input" value={form.artworkType} onChange={up('artworkType')} aria-invalid={!!errors.artworkType}>
                    <option value="">Select type</option>
                    {ARTWORK_TYPES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {errors.artworkType && <p className="form-error" role="alert">{errors.artworkType}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="cm-size">Preferred Size</label>
                  <select id="cm-size" className="form-input" value={form.size} onChange={up('size')} aria-invalid={!!errors.size}>
                    <option value="">Select size</option>
                    {SIZES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {errors.size && <p className="form-error" role="alert">{errors.size}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="cm-budget">Budget Range</label>
                  <select id="cm-budget" className="form-input" value={form.budget} onChange={up('budget')} aria-invalid={!!errors.budget}>
                    <option value="">Select budget</option>
                    {BUDGETS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {errors.budget && <p className="form-error" role="alert">{errors.budget}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="cm-timeline">Timeline</label>
                  <select id="cm-timeline" className="form-input" value={form.timeline} onChange={up('timeline')} aria-invalid={!!errors.timeline}>
                    <option value="">Select timeline</option>
                    {TIMELINES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {errors.timeline && <p className="form-error" role="alert">{errors.timeline}</p>}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="cm-desc">What do you have in mind?</label>
                <textarea id="cm-desc" className="form-input" rows={5} value={form.description} onChange={up('description')} placeholder="Subject, mood, setting, emotional tone, where it will hang — the more specific the better." aria-invalid={!!errors.description} />
                {errors.description && <p className="form-error" role="alert">{errors.description}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="cm-file">Reference image <span className="text-text-3 normal-case">(optional, under 4 MB)</span></label>
                <input id="cm-file" type="file" accept="image/*" onChange={onFile} className="form-input" style={{ padding: '12px' }} />
                {attachment && <p className="font-mono text-[11px] text-text-3 mt-2">Attached: {attachment.filename}</p>}
                {fileError && <p className="form-error" role="alert">{fileError}</p>}
              </div>

              {/* Honeypot — hidden from real users */}
              <input
                type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                name="company" value={form.company} onChange={up('company')}
                className="hidden"
              />

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.consent} onChange={up('consent')} className="mt-1 accent-ember w-4 h-4 flex-shrink-0" aria-invalid={!!errors.consent} />
                  <span className="font-mono text-[12px] text-text-2 leading-[1.6]">
                    I’m happy for {SITE.name} to contact me about this enquiry.
                  </span>
                </label>
                {errors.consent && <p className="form-error" role="alert">{errors.consent}</p>}
              </div>

              {status === 'error' && (
                <p className="form-error" role="alert">
                  Something went wrong sending this. Please email{' '}
                  <a href={mailto} className="underline text-ember">{SITE.email}</a> directly.
                </p>
              )}

              <button type="submit" disabled={status === 'loading'} className="btn-ember btn-full mt-2" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                {status === 'loading' ? 'Sending…' : 'Send Commission Enquiry'}
              </button>
            </form>
          </Reveal>
        )}

        <Reveal delay={0.2} className="mt-16 pt-8 border-t border-[#38354a]">
          <p className="font-mono text-[12px] text-text-3">
            Just want to browse first?{' '}
            <Link href="/gallery" className="text-ember hover:underline">See the gallery</Link>.
          </p>
        </Reveal>
      </div>
      <Footer />
    </div>
  )
}
