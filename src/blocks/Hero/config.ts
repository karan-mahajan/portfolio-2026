import { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Karan Mahajan',
    },
    {
      name: 'nameColor',
      type: 'text',
      label: 'Name Color',
      defaultValue: '#16f2b3',
      admin: {
        description: 'Hex color for the name highlight, e.g. #16f2b3',
      },
    },
    {
      name: 'typewriterStrings',
      type: 'array',
      label: 'Typewriter Strings',
      required: true,
      defaultValue: [
        { text: 'Software Engineer' },
        { text: 'Software Developer' },
        { text: 'Frontend Developer' },
        { text: 'Full Stack Developer' },
        { text: 'Web Developer' },
      ],
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'accentColor',
      type: 'text',
      label: 'Accent Color',
      defaultValue: '#ec4899',
      admin: {
        description: 'Hex color used for typewriter text and social icons, e.g. #ec4899 (pink)',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      fields: [
        {
          name: 'github',
          type: 'text',
          label: 'GitHub URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'steam',
          type: 'text',
          label: 'Steam URL',
        },
      ],
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      label: 'Resume PDF',
      admin: {
        description: 'Upload your resume PDF file',
      },
    },
    {
      name: 'contactHref',
      type: 'text',
      label: 'Contact Button Link',
      defaultValue: '#contact',
      admin: {
        description: 'Anchor or URL the Contact Me button points to',
      },
    },
    {
      name: 'gradientColors',
      type: 'array',
      label: 'Background Gradient Colors',
      defaultValue: [
        { color: '#13FFAA' },
        { color: '#1E67C6' },
        { color: '#CE84CF' },
        { color: '#DD335C' },
        { color: '#CCE6F4' },
        { color: '#95C623' },
      ],
      admin: {
        description: 'Colors that cycle in the animated radial background gradient',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
          admin: {
            description: 'Hex color code, e.g. #13FFAA',
          },
        },
      ],
    },
  ],
}
