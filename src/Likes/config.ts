import type { GlobalConfig } from 'payload'

export const Likes: GlobalConfig = {
  slug: 'portfolio-likes',
  label: 'Portfolio Likes',
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  admin: {
    description: 'Total number of likes the portfolio has received.',
    group: 'Content',
  },
  fields: [
    {
      name: 'count',
      label: 'Like Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of times visitors have liked the portfolio.',
        readOnly: true,
      },
    },
  ],
}
