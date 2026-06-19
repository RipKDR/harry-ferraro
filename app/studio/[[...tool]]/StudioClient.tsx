'use client'

import dynamic from 'next/dynamic'

const SanityStudio = dynamic(() => import('@/components/SanityStudio'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#101010',
        fontFamily: 'monospace',
        color: '#555',
        fontSize: 12,
        letterSpacing: '0.1em',
      }}
    >
      Loading Studio…
    </div>
  ),
})

export default function StudioClient() {
  return <SanityStudio />
}
