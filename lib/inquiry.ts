import { z } from 'zod'

export const commissionInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email: z.string().trim().email('A valid email is required').max(120),
  phone: z.string().trim().max(40).optional().default(''),
  socialHandle: z.string().trim().max(120).optional().default(''),
  artworkType: z.string().trim().min(1, 'Artwork type is required').max(120),
  preferredSize: z.string().trim().min(1, 'Preferred size is required').max(120),
  scaleNotes: z.string().trim().max(240).optional().default(''),
  timeline: z.string().trim().min(1, 'Timeline is required').max(160),
  description: z.string().trim().min(20, 'Describe the idea in at least 20 characters').max(3000),
  references: z.string().trim().max(800).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  company: z.string().trim().max(0).optional().default(''),
})

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email: z.string().trim().email('A valid email is required').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  company: z.string().trim().max(0).optional().default(''),
})

export type CommissionInquiry = z.infer<typeof commissionInquirySchema>
export type ContactInquiry = z.infer<typeof contactInquirySchema>

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function rowsHtml(rows: Array<[string, string | undefined]>) {
  return rows
    .map(([label, value]) => `
      <tr style="border-bottom:1px solid #3a342d">
        <td style="padding:12px 0;color:#8f8375;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;width:170px">${escapeHtml(label)}</td>
        <td style="padding:12px 0;font-size:13px;color:#f0e7dc">${escapeHtml(value || 'Not provided')}</td>
      </tr>
    `)
    .join('')
}
