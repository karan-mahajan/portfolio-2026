import { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'aboutBlock',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Profile Image',
    },
    {
      name: 'sectionLabel',
      type: 'text',
      label: 'Side Label',
      defaultValue: 'ABOUT ME',
      admin: {
        description: 'The rotated label shown on the left side (desktop only)',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Who am I?',
    },
    {
      name: 'headingColor',
      type: 'text',
      label: 'Heading Color',
      defaultValue: '#16f2b3',
      admin: {
        description: 'Hex color for the heading text, e.g. #16f2b3',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
  ],
}
