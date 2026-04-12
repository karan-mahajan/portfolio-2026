import config from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { ProjectData } from './ProjectsStackClient'
import { ProjectsStackClient } from './ProjectsStackClient'

// Local interface until `pnpm payload generate:types` is run
interface ProjectsBlockProps {
  title?: string | null
  blockType: 'projects'
  blockName?: string | null
  id?: string | null
}

async function getProjects(): Promise<ProjectData[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'projects',
    sort: 'order',
    limit: 100,
  })

  return result.docs.map((p) => {
    const thumb =
      p.thumbnail && typeof p.thumbnail === 'object'
        ? {
            url: (p.thumbnail as any).url ?? '',
            alt: (p.thumbnail as any).alt ?? p.title,
            width: (p.thumbnail as any).width ?? 480,
            height: (p.thumbnail as any).height ?? 320,
          }
        : null

    return {
      id: p.id,
      title: p.title,
      order: p.order,
      year: p.year,
      category: p.category,
      role: p.role,
      description: p.description ?? '',
      technologies: (p.technologies ?? []).map((t: any) => ({ tech: t.tech ?? '' })),
      thumbnail: thumb,
      accentColor: p.accentColor ?? '#7c3aed',
      liveUrl: p.liveUrl ?? null,
      githubUrl: p.githubUrl ?? null,
      isPrivate: p.isPrivate ?? false,
    }
  })
}

export const ProjectsBlockComponent: React.FC<ProjectsBlockProps> = async ({ title }) => {
  const projects = await getProjects()

  return <ProjectsStackClient projects={projects} title={title} />
}
