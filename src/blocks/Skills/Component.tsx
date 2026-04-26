'use client'

import type { SkillsBlock as SkillsBlockProps } from '@/payload-types'
import dynamic from 'next/dynamic'
import React from 'react'

const SkillSphere = dynamic(() => import('./SkillSphere'), { ssr: false })

type Props = SkillsBlockProps & { showCloud?: boolean | null }

const SKILL_GROUPS: {
  label: string
  num: string
  keywords: string[]
  color: string
}[] = [
  {
    num: '01',
    label: 'Frontend',
    keywords: [
      'next', 'react', 'typescript', 'tailwind', 'framer', 'zustand',
      'html', 'css', 'vue', 'angular', 'svelte', 'gatsby', 'redux',
      'shadcn', 'radix', 'motion',
    ],
    color: 'blue',
  },
  {
    num: '02',
    label: 'CMS',
    keywords: ['wordpress', 'acf', 'woocommerce', 'sanity', 'contentful', 'strapi', 'payload'],
    color: 'amber',
  },
  {
    num: '03',
    label: 'Backend & APIs',
    keywords: [
      'node', 'express', 'postgresql', 'postgres', 'mongo', 'mysql',
      'graphql', 'prisma', 'redis', 'django', 'laravel', 'php', 'python',
      'ruby', 'trpc', 'rest', 'drizzle',
    ],
    color: 'green',
  },
  {
    num: '04',
    label: 'DevOps & Tools',
    keywords: [
      'docker', 'aws', 'vercel', 'github', 'git', 'nginx', 'linux',
      'ci', 'cd', 'terraform', 'kubernetes', 'jenkins', 'figma', 'cloudflare',
    ],
    color: 'purple',
  },
  {
    num: '05',
    label: 'AI & Workflow',
    keywords: ['claude', 'openai', 'langchain', 'cursor', 'n8n', 'ai', 'gpt', 'llm', 'zapier', 'make'],
    color: 'cyan',
  },
]

function assignGroup(name: string): string {
  const lower = name.toLowerCase()
  for (const g of SKILL_GROUPS) {
    if (g.keywords.some((k) => lower.includes(k))) return g.label
  }
  return 'Other'
}

export const SkillsBlock: React.FC<Props> = ({ title, subtitle, skills }) => {
  const allSkills = (skills ?? []).filter((s): s is NonNullable<typeof s> => !!s?.name)

  const grouped = SKILL_GROUPS.map((group) => ({
    ...group,
    items: allSkills.filter((s) => assignGroup(s.name ?? '') === group.label),
  })).filter((g) => g.items.length > 0)

  const other = allSkills.filter((s) => assignGroup(s.name ?? '') === 'Other')
  if (other.length) {
    grouped.push({ num: '06', label: 'Other', keywords: [], color: 'neutral', items: other })
  }

  const allSkillNames = allSkills.map((s) => s.name ?? '').filter(Boolean)

  return (
    <section id="skills" className="km-section km-cinematic">
      <div className="km-container">
        <div className="km-section-num km-reveal">03 / stack</div>
        <h2 className="km-section-title km-reveal">{title ?? 'The stack I reach for.'}</h2>

        {subtitle && <p className="km-section-sub km-reveal">{subtitle}</p>}

        {/* Categorized pill grid */}
        <div className="km-skills-cats km-reveal">
          {grouped.map((group) => (
            <div key={group.label} className={`km-skill-cat km-skill-cat--${group.color}`}>
              <div className="km-skill-cat-header">
                <span className="km-skill-cat-num">{group.num}</span>
                <span className="km-skill-cat-label">{group.label}</span>
                <span className="km-skill-cat-count">{group.items.length}</span>
              </div>
              <div className="km-skill-pills">
                {group.items.map((skill, i) => (
                  <span key={i} className="km-skill-pill">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive skill sphere */}
        {allSkillNames.length > 3 && (
          <div className="km-sphere-section km-reveal">
            <p className="km-sphere-label">hover to pause</p>
            <SkillSphere skills={allSkillNames} />
          </div>
        )}
      </div>
    </section>
  )
}
