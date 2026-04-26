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

function abbrev(name: string): string {
  const words = name.trim().split(/[\s.&+\-\/]+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export const SkillsBlock: React.FC<Props> = ({ title, subtitle, skills }) => {
  const allSkills = skills ?? []

  return (
    <section id="skills" className="km-section km-cinematic">
      <div className="km-container">
        <div className="km-section-num km-reveal">03 / stack</div>
        <h2 className="km-section-title km-reveal">{title ?? 'The stack I reach for.'}</h2>

        {subtitle && (
          <p className="km-section-sub km-reveal">{subtitle}</p>
        )}

        {/* 3-column plain text grid */}
        <div className="km-skills-text-grid" data-km-stagger="">
          {allSkills.map((skill, i) => (
            <div key={i} className="km-skill-text-item">
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
