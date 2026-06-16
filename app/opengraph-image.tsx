import { ImageResponse } from 'next/og'
import { SITE, SOCIAL } from '@/lib/site'

export const alt = `${SITE.name} — Fine Art`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#15131c',
          padding: '80px',
          color: '#f2ede5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 2, background: '#c8570a' }} />
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: '#c8570a' }}>
            Original Fine Art
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 108, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            {SITE.name}
            <span style={{ color: '#c8570a' }}>.</span>
          </div>
          <div style={{ fontSize: 30, color: '#b0a9bc', marginTop: 24, maxWidth: 760 }}>
            {SITE.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#7c768a' }}>
          <span>{SITE.location}</span>
          <span>{SOCIAL.instagram.handle}</span>
        </div>
      </div>
    ),
    size,
  )
}
