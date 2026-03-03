import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Send via Resend if API key is set
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
          subject: `New message from ${data.name}`,
          html: `
            <div style="font-family:monospace;background:#07060a;color:#ede8df;padding:40px;max-width:600px">
              <h2 style="font-family:serif;font-weight:300;color:#c8570a;font-size:28px;margin-bottom:24px">
                New Contact Message
              </h2>
              <table style="width:100%;border-collapse:collapse">
                <tr style="border-bottom:1px solid #1e1c24">
                  <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;width:100px">From</td>
                  <td style="padding:12px 0;font-size:13px">${data.name}</td>
                </tr>
                <tr style="border-bottom:1px solid #1e1c24">
                  <td style="padding:12px 0;color:#45424f;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Email</td>
                  <td style="padding:12px 0;font-size:13px">${data.email}</td>
                </tr>
              </table>
              <div style="margin-top:24px;padding:20px;background:#131118;border-left:2px solid #c8570a">
                <p style="font-size:13px;line-height:1.8;color:#8a8494;white-space:pre-wrap">${data.message}</p>
              </div>
            </div>
          `,
        }),
      })
      if (!res.ok) console.error('Resend error:', await res.text())
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 422 })
    }
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
