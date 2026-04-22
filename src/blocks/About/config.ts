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
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'A developer who ships — and keeps shipping.',
      admin: {
        description: 'Large heading shown below the eyebrow label',
      },
    },
    {
      name: 'openToText',
      type: 'text',
      label: 'Availability Text',
      defaultValue: 'Currently open to senior full-stack and contract roles.',
      admin: {
        description: 'Small line shown at the bottom of the bio with a checkmark icon',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      defaultValue: [
        { value: '5+', label: 'Years Experience' },
        { value: '20+', label: 'Projects Delivered' },
        { value: '10+', label: 'Technologies' },
        { value: '2', label: 'Countries Worked In' },
      ],
      admin: {
        description: 'Stat cards shown on the right side of the about section',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "5+" or "20+"' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Years Experience"' },
        },
      ],
    },
  ],
}
