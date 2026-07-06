import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { POSITIONING, SITE } from '@/lib/site'

export const alt = 'Harrison Ferraro — figurative oil paintings, Melbourne'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const painting = await readFile(join(process.cwd(), 'public/paintings/ignition-ii.jpg'))
  const paintingSrc = `data:image/jpeg;base64,${painting.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #080706 0%, #100d0a 60%, #060504 100%)',
          color: '#f0e7dc',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 2, background: '#b65d2c' }} />
            <div style={{ fontSize: 20, letterSpacing: 6, textTransform: 'uppercase', color: '#d1844a' }}>
              Melbourne · oil on canvas
            </div>
          </div>
          <div style={{ marginTop: 28, fontSize: 88, lineHeight: 0.95, letterSpacing: -4, display: 'flex', flexDirection: 'column' }}>
            <span>Harrison</span>
            <span>Ferraro</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 24, lineHeight: 1.45, color: '#b7aa9b', maxWidth: 520 }}>
            {POSITIONING}
          </div>
          <div style={{ marginTop: 32, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: '#8f8375' }}>
            {new URL(SITE.siteUrl).host}
          </div>
        </div>
        <div style={{ width: 420, display: 'flex', position: 'relative' }}>
          <img src={paintingSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #080706 0%, rgba(8,7,6,0.25) 40%, rgba(8,7,6,0) 100%)',
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
