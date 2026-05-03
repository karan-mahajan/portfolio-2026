import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Plugin } from 'payload';
import { s3Storage } from '@payloadcms/storage-s3'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Portfolio` : 'Portfolio'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  s3Storage({
        collections: {
          media: {
            prefix: 'media',
            generateFileURL: ({ filename, prefix }) => {
              const bucket = process.env.S3_BUCKET!
              const supabaseUrl = process.env.SUPABASE_URL!
              return `${supabaseUrl}/storage/v1/object/public/${bucket}/${prefix}/${filename}`
            },
          }
        },
        bucket: process.env.S3_BUCKET!,
        config: {
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          region: process.env.S3_REGION!,
          endpoint: process.env.S3_ENDPOINT!,
        },
      }),
]
