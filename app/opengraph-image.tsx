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
          background: '#0b0a09',
          padding: '80px',
          color: '#ede8e1',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 2, background: '#b8714c' }} />
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: '#b8714c' }}>
            Original Fine Art
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 108, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            {SITE.name}
            <span style={{ color: '#b8714c' }}>.</span>
          </div>
          <div style={{ fontSize: 30, color: '#a8a099', marginTop: 24, maxWidth: 760 }}>
            {SITE.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#6e665f' }}>
          <span>{SITE.location}</span>
          <span>{SOCIAL.instagram.handle}</span>
        </div>
      </div>
    ),
    size,
  )
}
