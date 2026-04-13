'use client'

import type { SkillsBlock as SkillsBlockProps } from '@/payload-types'
import React from 'react'
import SkillsIconCloud from './IconCloud'
import { ICON_MAP, type IconKey } from './icons'

// Extended until types are regenerated
type Props = SkillsBlockProps & { showCloud?: boolean | null }

export const SkillsBlock: React.FC<Props> = ({ title, skills, showCloud }) => {
  const iconKeys = (skills ?? []).map((s) => s.icon).filter((k): k is IconKey => !!k)

  return (
    <section id="skills" className="py-16 container">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight">
        {title ?? 'Skills'}
      </h2>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10 max-w-5xl mx-auto px-4">
        {skills?.map((skill, i) => {
          const iconSrc = skill.icon ? ICON_MAP[skill.icon as IconKey] : undefined

          return (
            <li
              key={i}
              className="flex flex-col items-center w-24 transition-transform duration-300 hover:scale-110"
            >
              {iconSrc && (
                <img
                  src={iconSrc}
                  width={72}
                  height={72}
                  alt={skill.name}
                  className="object-contain h-18 w-18"
                />
              )}
              <span className="mt-3 text-sm text-white">{skill.name}</span>
            </li>
          )
        })}
      </ul>

      {showCloud !== false && iconKeys.length > 0 && (
        <div className="mt-4 max-w-3xl mx-auto">
          <SkillsIconCloud iconKeys={iconKeys} />
        </div>
      )}
    </section>
  )
}
