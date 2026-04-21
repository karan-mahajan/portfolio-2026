import type { AboutBlock as AboutBlockProps, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'

export const AboutBlockComponent: React.FC<AboutBlockProps> = ({
  image,
  heading,
  description,
}) => {
  const imageMedia = image && typeof image === 'object' ? (image as Media) : null

  return (
    <section id="about" className="km-section">
      <div className="km-container">
        <div className="km-eyebrow km-reveal">01 — About</div>
        <h2 className="km-section-title km-reveal">
          A developer who ships — and keeps shipping.
        </h2>

        <div className="km-about-grid">
          {/* Left — copy */}
          <div className="km-about-copy km-reveal km-reveal-left">
            {imageMedia?.url && (
              <Image
                src={imageMedia.url}
                width={280}
                height={280}
                alt={imageMedia.alt ?? 'Profile photo'}
                style={{
                  borderRadius: 16,
                  marginBottom: 32,
                  maxWidth: 200,
                  height: 'auto',
                  border: '1px solid var(--border)',
                }}
              />
            )}

            {description ? (
              <p>{description}</p>
            ) : (
              <>
                <p>
                  I&apos;m <strong>Karan Mahajan</strong>, a full stack web developer based in
                  Ontario, Canada, with <strong>five years</strong> of experience turning
                  ambiguous briefs into production applications.
                </p>
                <p>
                  I hold a <strong>Master&apos;s degree from the University of Windsor</strong>,
                  and I&apos;ve worked across two countries on everything from custom WordPress
                  builds to AI-integrated SaaS tools. My day-to-day: Next.js, React, TypeScript,
                  and whichever backend keeps the product honest.
                </p>
                <p>
                  What I care about: clean architecture, measurable performance, and the kind of
                  interfaces that feel obvious once you use them.
                </p>
              </>
            )}

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
              Currently open to senior full-stack and contract roles.
            </div>
          </div>

          {/* Right — stats */}
          <div className="km-stats-grid km-reveal km-reveal-right">
            <div className="km-stat-card">
              <div className="km-stat-value">5+</div>
              <div className="km-stat-label">Years Experience</div>
            </div>
            <div className="km-stat-card">
              <div className="km-stat-value">20+</div>
              <div className="km-stat-label">Projects Delivered</div>
            </div>
            <div className="km-stat-card">
              <div className="km-stat-value">10+</div>
              <div className="km-stat-label">Technologies</div>
            </div>
            <div className="km-stat-card">
              <div className="km-stat-value">2</div>
              <div className="km-stat-label">Countries Worked In</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
