import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Text is ASCII on purpose — Satori's default font lacks Vietnamese glyphs, so
// the diacritic copy lives in the (HTML) metadata instead.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#6b5bd2',
          color: '#fffdf7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 30,
              background: '#fffdf7',
              color: '#4c3fb5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 88,
              fontWeight: 900,
            }}
          >
            Q
          </div>
          <div style={{ fontSize: 128, fontWeight: 900, letterSpacing: '-0.04em' }}>Quizzy</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 38, fontWeight: 700, opacity: 0.92 }}>
          code · english · fun
        </div>
        <div style={{ marginTop: 16, fontSize: 26, opacity: 0.66 }}>quiz.malburo.site</div>
      </div>
    ),
    { ...size }
  )
}
