import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Experience, ExperienceBlock as ExperienceBlockProps } from '@/payload-types'

async function getExperiences(): Promise<Experience[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'experiences',
    sort: 'order',
    limit: 100,
  })
  return result.docs
}

const TimelineIcon = ({ type }: { type: 'experience' | 'education' }) => {
  if (type === 'education') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.51 15.49 0 12 0S6 2.51 6 4.64c0 .48.11.92.18 1.36H4c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-8-4c1.93 0 3.5 1.19 3.5 2.64S14 7.36 12 7.36 8.5 6.19 8.5 4.64 10.07 2 12 2zm8 18H4V8h16v12z" />
    </svg>
  )
}

const ExperienceCard = ({
  item,
  side,
}: {
  item: Experience
  side: 'left' | 'right'
}) => {
  const isExperience = item.type === 'experience'
  const dateRange = item.endDate ? `${item.startDate} – ${item.endDate}` : item.startDate

  const accentBorder = isExperience ? 'border-blue-500/40' : 'border-amber-500/40'
  const accentBg = isExperience ? 'bg-blue-500/[0.07]' : 'bg-amber-500/[0.07]'
  const accentText = isExperience ? 'text-blue-300' : 'text-amber-300'
  const accentBadgeBorder = isExperience ? 'border-blue-500/30' : 'border-amber-500/30'
  const accentBadgeBg = isExperience ? 'bg-blue-500/10' : 'bg-amber-500/10'
  const bulletColor = isExperience ? 'bg-blue-400/70' : 'bg-amber-400/70'
  const iconBg = isExperience
    ? 'bg-blue-600 shadow-blue-600/40'
    : 'bg-amber-600 shadow-amber-600/40'

  return (
    <div
      className={`
        relative flex w-full items-start
        ${side === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'}
        flex-row
      `}
    >
      {/* Card */}
      <div
        className={`
          w-full md:w-[45%] shrink-0
          ${side === 'left' ? 'md:mr-auto' : 'md:ml-auto'}
          ml-12 md:ml-0
        `}
      >
        <div
          className={`
            rounded-xl border ${accentBorder} ${accentBg}
            bg-white/4 backdrop-blur-sm p-5
            shadow-xl shadow-black/40
            transition-transform duration-300 hover:-translate-y-1
          `}
        >
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-white font-semibold text-base leading-snug">{item.name}</h3>
              <p className={`text-sm font-medium mt-0.5 ${accentText}`}>{item.role}</p>
            </div>
            <span
              className={`
                shrink-0 text-xs font-medium px-2.5 py-1 rounded-full
                border ${accentBadgeBorder} ${accentBadgeBg} ${accentText} whitespace-nowrap
              `}
            >
              {dateRange}
            </span>
          </div>

          {item.description && item.description.length > 0 && (
            <ul className="mt-3 space-y-2">
              {item.description.map((d, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-400 leading-relaxed">
                  <span className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full ${bulletColor}`} />
                  {d.point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Timeline icon */}
      <div className="absolute left-0 md:static md:w-[10%] flex justify-center items-start pt-4 shrink-0">
        <div
          className={`
            w-10 h-10 rounded-full ${iconBg} flex items-center justify-center
            ring-4 ring-[#060d1f] z-10 shadow-lg
          `}
        >
          <TimelineIcon type={item.type} />
        </div>
      </div>

      {/* Spacer for opposite side (desktop) */}
      <div className="hidden md:block md:w-[45%] shrink-0" />
    </div>
  )
}

export const ExperienceBlockComponent: React.FC<ExperienceBlockProps> = async ({ title }) => {
  const items = await getExperiences()

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      {title && (
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white mb-16 tracking-tight">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Vertical center line — hidden on mobile, shown on md+ */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-blue-500/50 via-gray-600/50 to-amber-500/50 -translate-x-1/2" />

        {/* Mobile line — left edge */}
        <div className="md:hidden absolute left-5 top-0 bottom-0 w-px bg-linear-to-b from-blue-500/50 via-gray-600/50 to-amber-500/50" />

        <div className="flex flex-col gap-10">
          {items.map((item) => (
            <ExperienceCard key={item.id} item={item} side={item.cardSide} />
          ))}
        </div>
      </div>
    </section>
  )
}
