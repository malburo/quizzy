import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#4f3fb8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 180,
            height: 174,
            borderRadius: 40,
            background: '#6b5bd2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              fontSize: 120,
              color: 'white',
              lineHeight: 1,
              marginTop: 10,
            }}
          >
            Q
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
