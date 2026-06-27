'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p
          className="eyebrow mb-4"
        >
          Something went wrong
        </p>
        <h1
          className="text-[2.5rem] font-light mb-6 leading-[1.1] sm:text-[2.75rem]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          An unexpected error occurred.
        </h1>
        <button onClick={reset} className="btn-ember">
          Try again
        </button>
      </div>
    </div>
  )
}
