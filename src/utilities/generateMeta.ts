import type { Metadata } from 'next'

import type { Config, Media, Page } from '../payload-types'

import { getServerSideURL } from './getURL'
import { defaultOpenGraphImage, mergeOpenGraph } from './mergeOpenGraph'

const DEFAULT_DESCRIPTION =
  'Full stack developer with 5+ years building fast, scalable web apps. Next.js · React · TypeScript · WordPress. Based in Ontario, Canada.'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | undefined => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return undefined
}

export const generateMeta = async (args: { doc: Partial<Page> | null }): Promise<Metadata> => {
  const { doc } = args
  const serverUrl = getServerSideURL()

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const isHomePage = !slug || slug === 'home'
  const canonical = isHomePage ? serverUrl : `${serverUrl}/${slug}`

  const ogImage = isHomePage ? undefined : getImageURL(doc?.meta?.image)

  // Use an absolute title so the root layout's `%s | Karan Mahajan` template
  // does not double-append the name.
  const title = doc?.meta?.title
    ? `${doc.meta.title} | Karan Mahajan`
    : 'Karan Mahajan — Full Stack Developer'

  const description = doc?.meta?.description || DEFAULT_DESCRIPTION

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: canonical,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage ?? defaultOpenGraphImage],
    },
  }
}
