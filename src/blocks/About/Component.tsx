import type { AboutBlock as AboutBlockProps } from '@/payload-types'
import React from 'react'

export const AboutBlockComponent: React.FC<AboutBlockProps> = ({
  description,
  sectionTitle,
  openToText,
  stats,
}) => {
  const statItems = (stats ?? []).filter(
    (s): s is { value: string; label: string; id?: string | null } => !!(s.value && s.label),
  )

  return (
    <section id="about" className="km-section">
      <div className="km-container">
        <div className="km-eyebrow km-reveal">01 — About</div>
        <h2 className="km-section-title km-reveal">
          {sectionTitle ?? 'A developer who ships — and keeps shipping.'}
        </h2>

        <div className="km-about-grid">
          {/* Left — copy */}
          <div className="km-about-copy km-reveal km-reveal-left">
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

          {/* Right — stats */}
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
