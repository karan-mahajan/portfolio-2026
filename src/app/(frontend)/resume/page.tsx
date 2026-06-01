import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Experience } from '@/payload-types'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { ResumeActions } from './ResumeActions'

export const dynamic = 'force-dynamic'

const RESUME_DESCRIPTION =
  'Resume of Karan Mahajan — full stack developer with 5+ years across Next.js, React, TypeScript, and WordPress. Based in Ontario, Canada. Open to senior and contract roles.'

export const metadata: Metadata = {
  title: 'Resume',
  description: RESUME_DESCRIPTION,
  alternates: { canonical: '/resume' },
  openGraph: mergeOpenGraph({
    title: 'Resume | Karan Mahajan',
    description: RESUME_DESCRIPTION,
    url: '/resume',
  }),
}

const SKILL_GROUPS = [
  {
    label: 'Frontend',
    keywords: ['next', 'react', 'typescript', 'tailwind', 'framer', 'zustand', 'html', 'css', 'vue', 'angular', 'svelte', 'gatsby'],
  },
  {
    label: 'CMS',
    keywords: ['wordpress', 'acf', 'woocommerce', 'sanity', 'contentful', 'strapi', 'payload'],
  },
  {
    label: 'Backend & APIs',
    keywords: ['node', 'express', 'postgresql', 'postgres', 'mongo', 'mysql', 'graphql', 'prisma', 'redis', 'django', 'laravel', 'php', 'python', 'ruby'],
  },
  {
    label: 'DevOps & Tools',
    keywords: ['docker', 'aws', 'vercel', 'github', 'git', 'nginx', 'linux', 'ci', 'cd', 'terraform', 'kubernetes', 'jenkins'],
  },
  {
    label: 'AI & Workflow',
    keywords: ['claude', 'openai', 'langchain', 'cursor', 'n8n', 'ai', 'gpt', 'llm', 'zapier', 'make'],
  },
]

function assignSkillGroup(name: string): string {
  const lower = name.toLowerCase()
  for (const g of SKILL_GROUPS) {
    if (g.keywords.some((k) => lower.includes(k))) return g.label
  }
  return 'Other'
}

export default async function ResumePage() {
  const payload = await getPayload({ config: configPromise })

  // Get home page layout to extract hero + skills block data
  const homeResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  const homePage = homeResult.docs[0]

  let heroBlock: any = null
  let skillsBlock: any = null
  if (homePage?.layout) {
    for (const block of homePage.layout as any[]) {
      if (block.blockType === 'heroBlock') heroBlock = block
      if (block.blockType === 'skills') skillsBlock = block
    }
  }

  // Fetch experiences and projects in parallel
  const [expResult, projResult] = await Promise.all([
    payload.find({
      collection: 'experiences',
      sort: 'order',
      limit: 100,
      pagination: false,
    }),
    payload.find({
      collection: 'projects',
      sort: 'order',
      limit: 10,
      pagination: false,
    }),
  ])

  const name: string = heroBlock?.name ?? 'Karan Mahajan'
  const position: string = heroBlock?.typewriterStrings?.[0]?.text ?? 'Full Stack Web Developer'
  const github: string | null = heroBlock?.socialLinks?.github ?? null
  const linkedin: string | null = heroBlock?.socialLinks?.linkedin ?? null

  const workExp: Experience[] = expResult.docs.filter((e) => e.type === 'experience')
  const education: Experience[] = expResult.docs.filter((e) => e.type === 'education')
  const projects = projResult.docs.filter((p) => !p.isPrivate).slice(0, 4)

  // Group skills by category
  const allSkills: Array<{ name: string; icon?: string | null }> = skillsBlock?.skills ?? []
  const grouped = new Map<string, typeof allSkills>()
  for (const skill of allSkills) {
    const g = assignSkillGroup(skill.name)
    if (!grouped.has(g)) grouped.set(g, [])
    grouped.get(g)!.push(skill)
  }
  const orderedGroups: Array<{ label: string; items: typeof allSkills }> = []
  for (const def of SKILL_GROUPS) {
    if (grouped.has(def.label)) {
      orderedGroups.push({ label: def.label, items: grouped.get(def.label)! })
    }
  }
  if (grouped.has('Other')) {
    orderedGroups.push({ label: 'Other', items: grouped.get('Other')! })
  }

  return (
    <div className="resume-page">
      {/* Toolbar */}
      <div className="resume-toolbar">
        <div className="resume-breadcrumb">
          <a href="/">Portfolio</a>
          <span className="sep">/</span>
          <span>Resume</span>
        </div>
        <ResumeActions />
      </div>

      <article className="resume">
        {/* Header */}
        <header className="resume-header">
          <div>
            <h1 className="resume-name">{name}</h1>
            <div className="resume-title">{position}</div>
            <p className="resume-summary">
              Full stack developer with 5+ years shipping fast, scalable web applications across
              Next.js, React, TypeScript, and WordPress. I lead projects end-to-end — from
              architecture to deployment — and embed AI into real production workflows. Based in
              Ontario, open to senior and contract roles.
            </p>
          </div>
          <div className="resume-contact">
            <a href="mailto:karanmahajan321@gmail.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
              </svg>
              karanmahajan321@gmail.com
            </a>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Ontario, Canada
            </span>
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
                LinkedIn
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.7.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.3-5.23-1.28-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.47.11-3.07 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.75 0c2.2-1.5 3.16-1.18 3.16-1.18.62 1.6.23 2.77.11 3.07.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.37-5.25 5.66.42.36.78 1.05.78 2.12v3.14c0 .3.21.66.78.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </header>

        <div className="resume-body">
          {/* LEFT COLUMN */}
          <aside className="rs-left">
            <section className="rs-section">
              <h2 className="rs-heading">Info</h2>
              <dl>
                <div className="rs-info-row"><dt>Role</dt><dd>Full Stack</dd></div>
                <div className="rs-info-row"><dt>Experience</dt><dd>5+ years</dd></div>
                <div className="rs-info-row"><dt>Location</dt><dd>Ontario, CA</dd></div>
                <div className="rs-info-row"><dt>Status</dt><dd>Open to work</dd></div>
                <div className="rs-info-row"><dt>Remote</dt><dd>Yes, global</dd></div>
              </dl>
            </section>

            {orderedGroups.length > 0 && (
              <section className="rs-section">
                <h2 className="rs-heading">Skills</h2>
                {orderedGroups.map(({ label, items }) => (
                  <div className="rs-skill-group" key={label}>
                    <div className="rs-skill-label">{label}</div>
                    <div className="rs-chips">
                      {items.map((skill, i) => (
                        <span className="rs-chip" key={i}>{skill.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {education.length > 0 && (
              <section className="rs-section">
                <h2 className="rs-heading">Education</h2>
                {education.map((edu) => {
                  const dateRange = edu.endDate
                    ? `${edu.startDate} — ${edu.endDate}`
                    : edu.startDate
                  return (
                    <div className="rs-edu" key={edu.id}>
                      <div className="rs-edu-degree">{edu.role}</div>
                      <div className="rs-edu-school">{edu.name}</div>
                      <div className="rs-edu-meta">
                        <span>{dateRange}</span>
                      </div>
                    </div>
                  )
                })}
              </section>
            )}

            <section className="rs-section">
              <h2 className="rs-heading">Languages</h2>
              {[
                { name: 'English', pct: '100%' },
                { name: 'Hindi', pct: '100%' },
                { name: 'Punjabi', pct: '80%' },
              ].map((lang) => (
                <div className="rs-lang" key={lang.name}>
                  <span>{lang.name}</span>
                  <span className="rs-lang-bar">
                    <span style={{ width: lang.pct }} />
                  </span>
                </div>
              ))}
            </section>

            <section className="rs-section">
              <h2 className="rs-heading">Highlights</h2>
              <div className="rs-chips">
                <span className="rs-chip">20+ shipped</span>
                <span className="rs-chip">2 countries</span>
                <span className="rs-chip">99 Lighthouse</span>
                <span className="rs-chip">Mentor</span>
              </div>
            </section>
          </aside>

          {/* RIGHT COLUMN */}
          <div className="rs-right">
            {workExp.length > 0 && (
              <section className="rs-section">
                <h2 className="rs-heading">Experience</h2>
                {workExp.map((exp) => {
                  const dateRange = exp.endDate
                    ? `${exp.startDate} — ${exp.endDate}`
                    : `${exp.startDate} — Present`
                  return (
                    <div className="rs-exp" key={exp.id}>
                      <div className="rs-exp-header">
                        <h3 className="rs-exp-role">{exp.role}</h3>
                        <span className="rs-exp-date">{dateRange}</span>
                      </div>
                      <div className="rs-exp-company">{exp.name}</div>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="rs-exp-bullets">
                          {exp.description.map((d, i) => (
                            <li key={i}>{d.point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </section>
            )}

            {projects.length > 0 && (
              <section className="rs-section">
                <h2 className="rs-heading">Selected Projects</h2>
                {projects.map((proj) => (
                  <div className="rs-proj" key={proj.id}>
                    <div className="rs-proj-header">
                      <h3 className="rs-proj-name">{proj.title}</h3>
                      {!proj.isPrivate && (proj.liveUrl || proj.githubUrl) && (
                        <a
                          className="rs-proj-link"
                          href={(proj.liveUrl ?? proj.githubUrl) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {proj.liveUrl ? 'Live ↗' : 'GitHub ↗'}
                        </a>
                      )}
                    </div>
                    <p className="rs-proj-desc">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="rs-proj-stack">
                        {proj.technologies.map((t, i) => (
                          <span className="rs-chip" key={i}>{t.tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </article>

      <div className="resume-footer">
        Last updated April 2026 · References available on request ·{' '}
        <a href="/">Back to portfolio</a>
      </div>
    </div>
  )
}
