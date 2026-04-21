import { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      admin: {
        description: 'Leave blank to use default "Let\'s work together."',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      admin: {
        description: 'Short description below the title.',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
      defaultValue: 'karan@karanmahajan.dev',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn URL',
    },
  ],
}
