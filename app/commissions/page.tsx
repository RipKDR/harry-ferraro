'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'

type F = { name: string; email: string; description: string; budget: string; timeline: string; references: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CommissionsPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<F>>({})
  const [form, setForm] = useState<F>({ name: '', email: '', description: '', budget: '', timeline: '', references: '' })

  const up = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((err) => ({ ...err, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<F> = {}
    if (form.name.length < 2) e.name = 'Please enter your name'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (form.description.length < 20) e.description = 'Please describe the work you have in mind (at least 20 characters)'
    if (!form.budget) e.budget = 'Please select a budget range'
    if (!form.timeline) e.timeline = 'Please select a timeline'
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
      <div className="max-w-[840px] mx-auto px-[52px] pt-[160px] pb-[160px] max-md:px-6">

        <Reveal><div className="eyebrow mb-4">Commission a Work</div></Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif font-light leading-[1.03] mb-5" style={{ fontSize: 'clamp(38px,6vw,72px)' }}>
            Something made<br /><em className="italic">only for you</em>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="font-mono text-[14px] text-text-2 leading-[1.85] max-w-[520px] mb-16">
            Commissions are taken selectively. I work closely with each collector to understand not just what you want to see, but what you want to <em>feel</em>. I will respond within 48 hours.
          </p>
        </Reveal>

        {/* How it works */}
        <Reveal delay={0.2} className="grid grid-cols-3 gap-5 mb-16 max-sm:grid-cols-1">
          {[
            { n: '01', t: 'We talk', b: 'A conversation about the work you want to live with.' },
            { n: '02', t: 'I paint', b: '6–12 weeks of focused studio work. Progress shared at key stages.' },
            { n: '03', t: 'It arrives', b: 'Professionally packed and delivered with certificate of authenticity.' },
          ].map(({ n, t, b }) => (
            <div key={n} className="p-6 border border-[#1e1c24] bg-[#131118]">
              <div className="font-serif text-[36px] font-light text-ember opacity-60 mb-3 italic">{n}</div>
              <div className="font-serif text-[18px] font-light mb-2">{t}</div>
              <p className="font-mono text-[12px] text-text-2 leading-[1.7]">{b}</p>
            </div>
          ))}
        </Reveal>

        {status === 'success' ? (
          <Reveal>
            <div className="success-box">
              <h2 className="font-serif font-light text-[32px] mb-4">Received.</h2>
              <p className="font-mono text-[14px] text-text-2 leading-[1.8]">
                I will review your inquiry and be in touch within 48 hours.
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

              <div>
                <label className="form-label" htmlFor="cm-desc">What do you have in mind?</label>
                <textarea id="cm-desc" className="form-input" rows={5} value={form.description} onChange={up('description')} placeholder="Subject, mood, setting, emotional tone. The more specific the better." aria-invalid={!!errors.description} />
                {errors.description && <p className="form-error" role="alert">{errors.description}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="cm-ref">References — artists or images you love (optional)</label>
                <input id="cm-ref" className="form-input" value={form.references} onChange={up('references')} placeholder="URLs, artist names, or describe the feeling" />
              </div>

              <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div>
                  <label className="form-label" htmlFor="cm-budget">Budget Range</label>
                  <select id="cm-budget" className="form-input" value={form.budget} onChange={up('budget')} aria-invalid={!!errors.budget}>
                    <option value="">Select budget</option>
                    <option>GBP 1,500 – 3,000</option>
                    <option>GBP 3,000 – 5,000</option>
                    <option>GBP 5,000 – 10,000</option>
                    <option>GBP 10,000+</option>
                  </select>
                  {errors.budget && <p className="form-error" role="alert">{errors.budget}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="cm-timeline">Timeline</label>
                  <select id="cm-timeline" className="form-input" value={form.timeline} onChange={up('timeline')} aria-invalid={!!errors.timeline}>
                    <option value="">Select timeline</option>
                    <option>Flexible, 3+ months</option>
                    <option>2 to 3 months</option>
                    <option>1 to 2 months</option>
                    <option>Under 4 weeks (rush fee applies)</option>
                  </select>
                  {errors.timeline && <p className="form-error" role="alert">{errors.timeline}</p>}
                </div>
              </div>

              {status === 'error' && <p className="form-error" role="alert">Something went wrong. Please email me directly at Harrisonferraro99@gmail.com</p>}

              <button type="submit" disabled={status === 'loading'} className="btn-ember btn-full mt-2" style={{ opacity: status === 'loading' ? 0.65 : 1 }}>
                {status === 'loading' ? 'Sending…' : 'Send Commission Inquiry'}
              </button>
            </form>
          </Reveal>
        )}
      </div>
      <Footer />
    </div>
  )
}
