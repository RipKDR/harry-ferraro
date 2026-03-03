import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  description: z.string().min(20).max(3000),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  references: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Harry Ferraro Studio <noreply@harryferraro.com.au>',
          to: ['Harrisonferraro99@gmail.com'],
          reply_to: data.email,
          subject: `Commission inquiry from ${data.name} — ${data.budget}`,
          html: `
            <div style="font-family:monospace;background:#07060a;color:#ede8df;padding:40px;max-width:600px">
              <h2 style="font-family:serif;font-weight:300;color:#c8570a;font-size:28px;margin-bottom:24px">
                Commission Inquiry
              </h2>
              <table style="width:100%;border-collapse:collapse">
                ${[
                  ['From', data.name],
                  ['Email', data.email],
                  ['Budget', data.budget],
                  ['Timeline', data.timeline],
                  ['References', data.references || '—'],
                ].map(([k, v]) => `
                  <tr style="border-bottom:1px solid #1e1c24">
                    <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;width:120px">${k}</td>
                    <td style="padding:12px 0;font-size:13px">${v}</td>
                  </tr>
                `).join('')}
              </table>
              <div style="margin-top:24px;padding:20px;background:#131118;border-left:2px solid #c8570a">
                <p style="font-size:11px;color:#45424f;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px">Description</p>
                <p style="font-size:13px;line-height:1.8;color:#8a8494;white-space:pre-wrap">${data.description}</p>
              </div>
            </div>
          `,
        }),
      })
      if (!res.ok) {
        console.error('Resend error:', await res.text())
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 422 })
    }
    console.error('Commission API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
