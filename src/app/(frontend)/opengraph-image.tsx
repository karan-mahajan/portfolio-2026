import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getSyneFont(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Syne:wght@800',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageResponse/1.0)' } },
  ).then((r) => r.text())
  const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1]
  if (!url) throw new Error('Could not parse Syne font URL from Google Fonts')
  return fetch(url).then((r) => r.arrayBuffer())
}

const PILLS = ['Next.js', 'React', 'TypeScript', 'Ontario, CA']

export default async function Image() {
  const syneFont = await getSyneFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#070710',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Center glow blob */}
        <div
          style={{
            position: 'absolute',
            width: '660px',
            height: '472px',
            background:
              'radial-gradient(ellipse at center, rgba(122,108,255,0.20) 0%, transparent 70%)',
            top: '79px',
            left: '270px',
          }}
        />

        {/* Content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Badge */}
          <div
            style={{
              fontFamily: 'Syne',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#7a6cff',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            PORTFOLIO
          </div>

          {/* Name — Syne 800, gradient fill */}
          <div
            style={{
              fontFamily: 'Syne',
              fontSize: '80px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #EFE3CA 30%, #60A5FA)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '10px',
            }}
          >
            Karan Mahajan
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: '26px',
              color: '#F59E0B',
              letterSpacing: '0.015em',
              marginBottom: '32px',
            }}
          >
            Full Stack Developer
          </div>

          {/* Divider */}
          <div
            style={{
              width: '56px',
              height: '2px',
              background: 'linear-gradient(90deg, #60A5FA, #7a6cff)',
              borderRadius: '2px',
              marginBottom: '32px',
            }}
          />

          {/* Pills */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {PILLS.map((pill) => (
              <div
                key={pill}
                style={{
                  padding: '6px 18px',
                  borderRadius: '100px',
                  border: '1px solid rgba(96,165,250,0.28)',
                  background: 'rgba(96,165,250,0.07)',
                  color: '#22D3EE',
                  fontSize: '18px',
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>

        {/* Corner URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '15px',
            color: 'rgba(239,227,202,0.28)',
            letterSpacing: '0.06em',
          }}
        >
          karanmahajan.ca
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Syne',
          data: syneFont,
          weight: 800,
          style: 'normal',
        },
      ],
    },
  )
}
