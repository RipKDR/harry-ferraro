'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p
          className="text-[9px] tracking-[0.2em] uppercase text-oxide mb-4"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Something went wrong
        </p>
        <h2
          className="text-[40px] font-light mb-6 leading-[1.1]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          An unexpected error occurred.
        </h2>
        <button onClick={reset} className="btn-ember">
          Try again
        </button>
      </div>
    </div>
  )
}
