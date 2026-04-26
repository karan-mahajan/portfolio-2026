import type { AboutBlock as AboutBlockProps, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'

export const AboutBlockComponent: React.FC<AboutBlockProps> = (props) => {
  const { description, sectionTitle, openToText, stats } = props
  const photo = (props as any).photo
  const photoMedia = photo && typeof photo === 'object' ? (photo as Media) : null

  const statItems = (stats ?? []).filter(
    (s): s is { value: string; label: string; id?: string | null } => !!(s.value && s.label),
  )

  return (
    <section id="about" className="km-section km-cinematic">
      <div className="km-container">
        <div className="km-section-num km-reveal">01 / about</div>
        <h2 className="km-section-title km-reveal">
          {sectionTitle ?? 'A developer who ships — and keeps shipping.'}
        </h2>

        <div className="km-about-grid">
          {/* Col 1 — photo */}
          {photoMedia?.url && (
            <div className="km-about-photo km-reveal km-reveal-left">
              <Image
                src={photoMedia.url}
                alt={photoMedia.alt ?? 'Profile photo'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 280px"
              />
            </div>
          )}

          {/* Col 2 — bio */}
          <div className="km-about-copy km-reveal">
            <p>{description}</p>

            <div className="km-about-signature">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {openToText ?? 'Currently open to senior full-stack and contract roles.'}
            </div>
          </div>

          {/* Col 3 — stats */}
          {statItems.length > 0 && (
            <div className="km-stats-grid km-reveal km-reveal-right">
              {statItems.map((stat, i) => (
                <div className="km-stat-card" key={stat.id ?? i}>
                  <div className="km-stat-value">{stat.value}</div>
                  <div className="km-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
