import { Block } from 'payload'

export const ExperienceBlock: Block = {
  slug: 'experience',
  interfaceName: 'ExperienceBlock',
  labels: {
    singular: 'Experience & Education Section',
    plural: 'Experience & Education Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Experience & Education',
      admin: {
        description: 'Section heading',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Five years across two countries — agency, in-house, and independent.',
      admin: {
        description: 'Short paragraph shown below the section heading',
      },
    },
  ],
}
