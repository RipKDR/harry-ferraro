import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SITE } from '@/lib/site'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(3000),
  company: z.string().max(0).optional().default(''), // honeypot — must be empty
})

const FROM = process.env.CONTACT_FROM ?? 'Harrison Ferraro <onboarding@resend.dev>'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      if (body?.company) return NextResponse.json({ ok: true }) // bot caught by honeypot
      return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 422 })
    }
    const data = parsed.data
    if (data.company) return NextResponse.json({ ok: true })

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [SITE.email],
          reply_to: data.email,
          subject: `New message from ${data.name}`,
          html: `
            <div style="font-family:monospace;background:#060504;color:#ede8df;padding:40px;max-width:600px">
              <h2 style="font-family:serif;font-weight:300;color:#b8714c;font-size:28px;margin-bottom:24px">New Message</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr style="border-bottom:1px solid #1e1c24">
                  <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;width:100px">From</td>
                  <td style="padding:12px 0;font-size:13px">${escapeHtml(data.name)}</td>
                </tr>
                <tr style="border-bottom:1px solid #1e1c24">
                  <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Email</td>
                  <td style="padding:12px 0;font-size:13px">${escapeHtml(data.email)}</td>
                </tr>
              </table>
              <div style="margin-top:24px;padding:20px;background:#120f0d;border-left:2px solid #b8714c">
                <p style="font-size:13px;line-height:1.8;color:#8a8494;white-space:pre-wrap">${escapeHtml(data.message)}</p>
              </div>
            </div>`,
        }),
      })
      if (!res.ok) {
        console.error('Resend error:', await res.text())
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ))
}
