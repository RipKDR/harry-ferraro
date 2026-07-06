'use client'

export const INPUT_CLASS =
  'w-full appearance-none border-0 border-b border-[var(--border)] bg-transparent py-3 font-mono text-[0.95rem] text-text outline-none transition-colors duration-300 focus:border-oxide placeholder:text-text-3'

export type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-configured'

export function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-3">{label}</label>
      {children}
      {error && <p className="mt-2 font-mono text-[0.72rem] text-oxide-2" role="alert">{error}</p>}
    </div>
  )
}

export function SubmitButton({ status }: { status: FormStatus }) {
  const text =
    status === 'loading' ? 'Sending'
    : status === 'success' ? 'Sent ✓'
    : status === 'error' ? 'Try again'
    : 'Send message'

  return (
    <button type="submit" disabled={status === 'loading'} className="group inline-flex min-h-[44px] items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-text disabled:opacity-60">
      <span>{text}</span>
      {status !== 'success' && (
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">&rarr;</span>
      )}
    </button>
  )
}

export function DeliveryFallback({ status, fallbackHref }: { status: FormStatus; fallbackHref: string }) {
  if (status !== 'not-configured' && status !== 'error') return null
  return (
    <div className="border border-oxide bg-[rgba(182,93,44,.08)] p-5" role="alert">
      <p className="mb-4 font-mono text-[0.82rem] leading-7 text-text-2">
        {status === 'not-configured'
          ? 'Email delivery is not configured yet. Use direct email for now.'
          : 'The form could not be sent. Use direct email instead.'}
      </p>
      <a href={fallbackHref} className="btn-line">Send using email app</a>
    </div>
  )
}
