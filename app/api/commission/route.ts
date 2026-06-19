import { NextResponse } from 'next/server'
import { SITE } from '@/lib/site'
import { commissionInquirySchema, escapeHtml, rowsHtml } from '@/lib/inquiry'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = commissionInquirySchema.parse(body)

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
        subject: `Studio enquiry from ${data.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#080706;color:#f0e7dc;padding:32px;max-width:720px">
            <h1 style="font-family:Georgia,serif;font-weight:400;color:#f0e7dc;font-size:34px;margin:0 0 8px">Studio enquiry</h1>
            <p style="color:#b7aa9b;font-size:13px;line-height:1.7;margin:0 0 28px">Submitted through ${escapeHtml(SITE.shortName)} website.</p>
            <table style="width:100%;border-collapse:collapse">
              ${rowsHtml([
                ['Name', data.name],
                ['Email', data.email],
                ['Phone', data.phone],
                ['Social', data.socialHandle],
                ['Type', data.artworkType],
                ['Preferred size', data.preferredSize],
                ['Scale / range notes', data.scaleNotes],
                ['Timeline', data.timeline],
                ['References', data.references],
              ])}
            </table>
            <div style="margin-top:24px;padding:20px;background:#15120f;border-left:2px solid #b65d2c">
              <p style="font-size:11px;color:#8f8375;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 10px">Idea</p>
              <p style="font-size:14px;line-height:1.8;color:#f0e7dc;white-space:pre-wrap;margin:0">${escapeHtml(data.description)}</p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Resend commission error:', text)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err && typeof err === 'object' && 'issues' in err) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 422 })
    }
    console.error('Commission API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
