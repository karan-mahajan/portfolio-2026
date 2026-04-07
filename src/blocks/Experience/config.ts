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
  ],
}
