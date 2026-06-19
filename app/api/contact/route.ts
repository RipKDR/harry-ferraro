import { NextResponse } from 'next/server'
import { SITE } from '@/lib/site'
import { contactInquirySchema, escapeHtml, rowsHtml } from '@/lib/inquiry'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = contactInquirySchema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service is not configured', mailto: `mailto:${SITE.email}` },
        { status: 503 },
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Harrison Ferraro Studio <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || SITE.email],
        reply_to: data.email,
        subject: `Website enquiry from ${data.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#080706;color:#f0e7dc;padding:32px;max-width:680px">
            <h1 style="font-family:Georgia,serif;font-weight:400;color:#f0e7dc;font-size:30px;margin:0 0 24px">Website enquiry</h1>
            <table style="width:100%;border-collapse:collapse">
              ${rowsHtml([
                ['Name', data.name],
                ['Email', data.email],
              ])}
            </table>
            <div style="margin-top:24px;padding:20px;background:#15120f;border-left:2px solid #b65d2c">
              <p style="font-size:14px;line-height:1.8;color:#f0e7dc;white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Resend contact error:', text)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err && typeof err === 'object' && 'issues' in err) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 422 })
    }
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
