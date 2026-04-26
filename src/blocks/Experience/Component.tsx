import type { Experience, ExperienceBlock as ExperienceBlockProps } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

async function getExperiences(): Promise<Experience[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'experiences',
    sort: 'order',
    limit: 100,
  })
  return result.docs
}

const TimelineEntry = ({
  item,
  side,
  index,
  total,
}: {
  item: Experience
  side: 'left' | 'right'
  index: number
  total: number
}) => {
  const dateRange = item.endDate ? `${item.startDate} – ${item.endDate}` : `${item.startDate} — Present`

  return (
    <div
      className={`km-timeline-entry ${side}${side === 'left' ? ' km-reveal km-reveal-left' : ' km-reveal km-reveal-right'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="km-timeline-node">
        <div className="km-timeline-node-ring" />
        <div className="km-timeline-node-dot" />
      </div>
      <div className="km-timeline-card">
        <div className="km-timeline-date">{dateRange}</div>
        <h3 className="km-timeline-role">{item.role}</h3>
        <div className="km-timeline-company">{item.name}</div>
        {item.description && item.description.length > 0 && (
          <ul className="km-timeline-bullets">
            {item.description.map((d, i) => (
              <li key={i}>{d.point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const ExperienceBlockComponent: React.FC<ExperienceBlockProps> = async ({ title, subtitle }) => {
  const items = await getExperiences()

  return (
    <section id="experience" className="km-section">
      <div className="km-container">
        <div className="km-eyebrow km-reveal">04 — Experience</div>
        <h2 className="km-section-title km-reveal">
          {title ?? "Where I've built."}
        </h2>
        <p className="km-section-sub km-reveal">
          {subtitle ?? 'Five years across two countries — agency, in-house, and independent.'}
        </p>

        <div className="km-timeline">
          <div className="km-timeline-progress" aria-hidden="true" />
          {items.map((item, i) => (
            <TimelineEntry
              key={item.id}
              item={item}
              side={item.cardSide ?? (i % 2 === 0 ? 'right' : 'left')}
              index={i}
              total={items.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
