/** Shared helpers for the contact + commission email routes. */

/** Sender address for outgoing form emails. Override with CONTACT_FROM. */
export const EMAIL_FROM =
  process.env.CONTACT_FROM ?? 'Harrison Ferraro <onboarding@resend.dev>'

/** Escape user-supplied text before interpolating into email HTML. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ))
}

/** Strip path separators / unusual characters from an uploaded filename. */
export function safeFilename(name: string): string {
  return name.replace(/[^\w.\- ]+/g, '_').slice(0, 120) || 'attachment'
}
