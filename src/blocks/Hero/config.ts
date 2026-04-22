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
    {
      name: 'status',
      type: 'text',
      label: 'Status Bar Text',
      defaultValue: 'Based in Ontario · Open to new projects',
      admin: {
        description: 'Text shown in the status pill at the top of the hero',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title / Role Line',
      defaultValue: 'Developer.',
      admin: {
        description: 'Second line of the h1 (shown with gradient), e.g. "Developer."',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      defaultValue: 'I build fast, scalable web applications — and I use AI to do it better.',
      admin: {
        description: 'One-liner paragraph below the typewriter',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
      admin: {
        description: 'Your profile photo shown on the right side of the hero',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      defaultValue: 'Windsor, ON',
      admin: {
        description: 'Shown on the floating card below the photo',
      },
    },
    {
      name: 'statusCardText',
      type: 'text',
      label: 'Status Card Text',
      defaultValue: 'online · coding',
      admin: {
        description: 'Text on the floating card above the photo',
      },
    },
    {
      name: 'metaItems',
      type: 'array',
      label: 'Meta Stats',
      defaultValue: [
        { label: '5+ years' },
        { label: '20+ shipped' },
        { label: 'Full stack' },
      ],
      admin: {
        description: 'Up to 3 stat badges shown below the tagline (icons auto-assigned by position)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
