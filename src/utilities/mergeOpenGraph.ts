import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export const defaultOpenGraphImage = `${getServerSideURL()}/images/karan-mahajan-og.png`

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Full stack developer with 5+ years building fast, scalable web apps. Next.js · React · TypeScript · WordPress. Based in Ontario, Canada.',
  images: [
    {
      url: defaultOpenGraphImage,
      width: 1200,
      height: 630,
      alt: 'Karan Mahajan — Full Stack Developer',
    },
  ],
  siteName: 'Karan Mahajan',
  title: 'Karan Mahajan — Full Stack Developer',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
