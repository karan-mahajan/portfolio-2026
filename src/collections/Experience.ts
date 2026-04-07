import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experiences',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'role', 'type', 'startDate', 'order'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Company or institution name',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title or degree name',
      },
    },
    {
      name: 'startDate',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Feb 2025" or "May 2024"',
      },
    },
    {
      name: 'endDate',
      type: 'text',
      admin: {
        description: 'e.g. "Present" or "Aug 2024". Leave blank if ongoing.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'experience',
      options: [
        { label: 'Experience', value: 'experience' },
        { label: 'Education', value: 'education' },
      ],
    },
    {
      name: 'cardSide',
      type: 'select',
      required: true,
      defaultValue: 'left',
      label: 'Card Position',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Which side of the timeline this card appears on (desktop)',
      },
    },
    {
      name: 'description',
      type: 'array',
      label: 'Description Points',
      admin: {
        description: 'Bullet points describing the role (optional for education)',
      },
      fields: [
        {
          name: 'point',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first (top of timeline)',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
