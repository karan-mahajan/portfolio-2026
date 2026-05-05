import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const base = getServerSideURL()

  const results = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: { _status: { equals: 'published' } },
    select: { slug: true, updatedAt: true },
  })

  const cmsPages = (results.docs ?? [])
    .filter((page) => Boolean(page?.slug))
    .map((page) => ({
      url: page.slug === 'home' ? `${base}/` : `${base}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: (page.slug === 'home' ? 'weekly' : 'monthly') as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: page.slug === 'home' ? 1.0 : 0.8,
    }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  return [...cmsPages, ...staticPages]
}
