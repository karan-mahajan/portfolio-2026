import type { Media } from '@/payload-types'

export type HeroProps = {
  type: 'highImpact' | 'mediumImpact' | 'lowImpact' | 'none'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richText?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links?: { link: any }[] | null
  media?: number | Media | null
}
