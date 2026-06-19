import StudioClient from './StudioClient'

export const metadata = {
  title: 'Harry Ferraro — Studio CMS',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          background: '#15131c',
          color: '#f2ede5',
          padding: 40,
          gap: 16,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: '#7c768a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Sanity CMS not configured
        </p>
        <p style={{ fontSize: 12, color: '#7c768a', maxWidth: 360, lineHeight: 1.8 }}>
          Add{' '}
          <code style={{ color: '#c8570a' }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> to your
          environment variables to enable the CMS.
        </p>
        <p style={{ fontSize: 11, color: '#48455a' }}>
          Create a free project at{' '}
          <span style={{ color: '#c8570a' }}>sanity.io</span>
        </p>
      </div>
    )
  }

  return <StudioClient />
}
