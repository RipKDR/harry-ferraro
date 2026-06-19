import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SITE } from '@/lib/site'
import { EMAIL_FROM, escapeHtml, safeFilename } from '@/lib/email'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(''),
  social: z.string().max(80).optional().default(''),
  artworkType: z.string().min(1).max(80),
  size: z.string().min(1).max(80),
  budget: z.string().min(1).max(80),
  timeline: z.string().min(1).max(80),
  description: z.string().min(20).max(3000),
  consent: z.literal(true),
  company: z.string().max(0).optional().default(''), // honeypot — must be empty
  attachment: z
    .object({
      filename: z.string().min(1).max(200),
      // Declared type must be an image; combined with the client image-only check.
      mimeType: z.string().regex(/^image\/[a-z0-9.+-]+$/i),
      // Base64 only (the client strips the data-URL prefix). ~5 MB ceiling.
      content: z.string().regex(/^[A-Za-z0-9+/=\s]+$/).max(7_000_000),
    })
    .nullable()
    .optional(),
})

const row = (k: string, v: string) => `
  <tr style="border-bottom:1px solid #1e1c24">
    <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;width:130px">${k}</td>
    <td style="padding:12px 0;font-size:13px">${v}</td>
  </tr>`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    // Honeypot or invalid: respond OK without sending (don't tip off bots).
    if (!parsed.success) {
      if (body?.company) return NextResponse.json({ ok: true })
      return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 422 })
    }
    const data = parsed.data
    if (data.company) return NextResponse.json({ ok: true })

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const payload: Record<string, unknown> = {
        from: EMAIL_FROM,
        to: [SITE.email],
        reply_to: data.email,
        subject: `Commission enquiry from ${data.name} — ${data.budget}`,
        html: `
          <div style="font-family:monospace;background:#060504;color:#ede8df;padding:40px;max-width:600px">
            <h2 style="font-family:serif;font-weight:300;color:#b8714c;font-size:28px;margin-bottom:24px">Commission Enquiry</h2>
            <table style="width:100%;border-collapse:collapse">
              ${row('From', data.name)}
              ${row('Email', data.email)}
              ${row('Phone', data.phone || '—')}
              ${row('Social', data.social || '—')}
              ${row('Type', data.artworkType)}
              ${row('Size', data.size)}
              ${row('Budget', data.budget)}
              ${row('Timeline', data.timeline)}
            </table>
            <div style="margin-top:24px;padding:20px;background:#120f0d;border-left:2px solid #b8714c">
              <p style="font-size:11px;color:#45424f;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px">Description</p>
              <p style="font-size:13px;line-height:1.8;color:#8a8494;white-space:pre-wrap">${escapeHtml(data.description)}</p>
            </div>
            ${data.attachment ? '<p style="margin-top:16px;font-size:11px;color:#45424f">Reference image attached.</p>' : ''}
          </div>`,
      }

      if (data.attachment?.content) {
        payload.attachments = [{
          filename: safeFilename(data.attachment.filename),
          content: data.attachment.content,
          content_type: data.attachment.mimeType,
        }]
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        console.error('Resend error:', await res.text())
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Commission API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
