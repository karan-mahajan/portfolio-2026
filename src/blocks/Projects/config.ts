import { Block } from 'payload'

export const ProjectsBlock: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlock',
  labels: {
    singular: 'Projects Stack Section',
    plural: 'Projects Stack Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Projects',
      admin: {
        description: 'Section heading shown above the card stack',
      },
    },
  ],
}
