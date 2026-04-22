import { ICON_MAP } from './icons'
import { Block } from 'payload'

export const Skills: Block = {
  slug: 'skills',
  interfaceName: 'SkillsBlock',
  labels: {
    singular: 'Skills Section',
    plural: 'Skills Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Skills',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Tools I use in production every week — grouped by where they live in the stack.',
      admin: {
        description: 'Short paragraph shown below the section heading',
      },
    },
    {
      name: 'showCloud',
      type: 'checkbox',
      label: 'Show Icon Cloud',
      defaultValue: true,
      admin: {
        description: 'Display the animated 3D icon cloud below the skills grid',
      },
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: Object.keys(ICON_MAP).map((key) => ({
            label: key,
            value: key,
          })),
        },
      ],
    },
  ],
}
