import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { revalidateProjects, revalidateProjectsOnDelete } from './Projects/hooks/revalidateProjects'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'year', 'order'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Year the project was completed or started',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Web App", "Mobile", "Open Source"',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Your role on the project, e.g. "Full Stack Developer"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short project description (shown in the card)',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      label: 'Technologies',
      fields: [
        {
          name: 'tech',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Project thumbnail image (right side of card)',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#7c3aed',
      admin: {
        description: 'Hex colour used as background when no thumbnail (e.g. #7c3aed)',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Live site URL — leave blank if not deployed',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        description: 'GitHub repository URL',
      },
    },
    {
      name: 'isPrivate',
      type: 'checkbox',
      defaultValue: false,
      label: 'Private / NDA',
      admin: {
        description: 'Mark as private — disables live/GitHub links and shows "Private client" label',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in the stack',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [revalidateProjects],
    afterDelete: [revalidateProjectsOnDelete],
  },
}
