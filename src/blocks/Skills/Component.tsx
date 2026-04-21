'use client'

import type { SkillsBlock as SkillsBlockProps } from '@/payload-types'
import React from 'react'
import { ICON_MAP, type IconKey } from './icons'

type Props = SkillsBlockProps & { showCloud?: boolean | null }

// Auto-assign a category based on skill name / icon key
const SKILL_GROUPS: { label: string; num: string; keywords: string[] }[] = [
  {
    num: '/ 01',
    label: 'Frontend',
    keywords: ['next', 'react', 'typescript', 'tailwind', 'framer', 'zustand', 'html', 'css', 'vue', 'angular', 'svelte', 'gatsby'],
  },
  {
    num: '/ 02',
    label: 'CMS',
    keywords: ['wordpress', 'acf', 'woocommerce', 'sanity', 'contentful', 'strapi', 'payload'],
  },
  {
    num: '/ 03',
    label: 'Backend & APIs',
    keywords: ['node', 'express', 'postgresql', 'postgres', 'mongo', 'mysql', 'graphql', 'prisma', 'redis', 'django', 'laravel', 'php', 'python', 'ruby'],
  },
  {
    num: '/ 04',
    label: 'DevOps & Tools',
    keywords: ['docker', 'aws', 'vercel', 'github', 'git', 'nginx', 'linux', 'ci', 'cd', 'terraform', 'kubernetes', 'jenkins'],
  },
  {
    num: '/ 05',
    label: 'AI & Workflow',
    keywords: ['claude', 'openai', 'langchain', 'cursor', 'n8n', 'ai', 'gpt', 'llm', 'zapier', 'make'],
  },
]

function assignGroup(name: string, icon?: string): string {
  const lower = `${name} ${icon ?? ''}`.toLowerCase()
  for (const g of SKILL_GROUPS) {
    if (g.keywords.some((k) => lower.includes(k))) return g.label
  }
  return 'Other'
}

// Two-letter abbreviation from skill name
function abbrev(name: string): string {
  const words = name.trim().split(/[\s.&+\-\/]+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export const SkillsBlock: React.FC<Props> = ({ title, skills }) => {
  const allSkills = skills ?? []

  // Group skills
  const grouped = new Map<string, typeof allSkills>()
  for (const skill of allSkills) {
    const g = assignGroup(skill.name, skill.icon ?? undefined)
    if (!grouped.has(g)) grouped.set(g, [])
    grouped.get(g)!.push(skill)
  }

  // Order groups by definition order, then Other last
  const orderedGroups: Array<{ label: string; num: string; items: typeof allSkills }> = []
  for (const def of SKILL_GROUPS) {
    if (grouped.has(def.label)) {
      orderedGroups.push({ label: def.label, num: def.num, items: grouped.get(def.label)! })
    }
  }
  if (grouped.has('Other')) {
    orderedGroups.push({
      label: 'Other',
      num: `/ ${String(orderedGroups.length + 1).padStart(2, '0')}`,
      items: grouped.get('Other')!,
    })
  }

  // Flat grid fallback if no groups matched
  const useGroups = orderedGroups.length > 0
  const flatSkills = useGroups ? [] : allSkills

  return (
    <section id="skills" className="km-section">
      <div className="km-container">
        <div className="km-eyebrow km-reveal">02 — Skills</div>
        <h2 className="km-section-title km-reveal">{title ?? 'The stack I reach for.'}</h2>
        <p className="km-section-sub km-reveal">
          Tools I use in production every week — grouped by where they live in the stack.
        </p>

        {useGroups ? (
          <div className="km-skills-groups">
            {orderedGroups.map(({ label, num, items }) => (
              <div className="km-skill-group" key={label}>
                <div className="km-skill-group-header km-reveal">
                  <div className="km-skill-group-num">{num}</div>
                  <h3 className="km-skill-group-title">{label}</h3>
                  <div className="km-skill-group-count">{items.length} tools</div>
                </div>

                <div className="km-skill-cards" data-km-stagger="">
                  {items.map((skill, i) => {
                    const iconSrc = skill.icon ? ICON_MAP[skill.icon as IconKey] : undefined
                    return (
                      <div className="km-skill-card" key={i}>
                        <div className="km-skill-icon">
                          {iconSrc ? (
                            <img src={iconSrc} alt={skill.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                          ) : (
                            abbrev(skill.name)
                          )}
                        </div>
                        <div className="km-skill-name">{skill.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="km-skill-cards" data-km-stagger="">
            {flatSkills.map((skill, i) => {
              const iconSrc = skill.icon ? ICON_MAP[skill.icon as IconKey] : undefined
              return (
                <div className="km-skill-card" key={i}>
                  <div className="km-skill-icon">
                    {iconSrc ? (
                      <img src={iconSrc} alt={skill.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                    ) : (
                      abbrev(skill.name)
                    )}
                  </div>
                  <div className="km-skill-name">{skill.name}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
