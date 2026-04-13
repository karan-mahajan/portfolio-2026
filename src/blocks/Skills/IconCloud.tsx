'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Cloud, fetchSimpleIcons, type ICloud, renderSimpleIcon, type SimpleIcon } from 'react-icon-cloud'

const cloudProps: Omit<ICloud, 'children'> = {
  containerProps: {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: 'default',
    tooltip: 'native',
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: '#0000',
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
}

const renderCustomIcon = (icon: SimpleIcon) => {
  return renderSimpleIcon({
    icon,
    bgHex: '#f3f2ef',
    fallbackHex: '#000000',
    minContrastRatio: 1.2,
    size: 62,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
      title: icon.title,
    },
  })
}

// Maps ICON_MAP keys to simple-icons slugs
const SLUG_MAP: Record<string, string> = {
  bootstrap: 'bootstrap',
  c: 'c',
  canva: 'canva',
  css: 'css3',
  drupal: 'drupal',
  django: 'django',
  figma: 'figma',
  firebase: 'firebase',
  git: 'git',
  html: 'html5',
  javascript: 'javascript',
  materialui: 'mui',
  microsoftoffice: 'microsoftoffice',
  mongodb: 'mongodb',
  mysql: 'mysql',
  next: 'nextdotjs',
  postgresql: 'postgresql',
  python: 'python',
  react: 'react',
  tailwind: 'tailwindcss',
  typescript: 'typescript',
  wordpress: 'wordpress',
}

type Props = {
  iconKeys: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

export default function SkillsIconCloud({ iconKeys }: Props) {
  const [data, setData] = useState<IconData | null>(null)
  const [mounted, setMounted] = useState(false)

  const slugs = iconKeys
    .map((key) => SLUG_MAP[key])
    .filter(Boolean)

  useEffect(() => {
    setMounted(true)
    if (slugs.length > 0) {
      fetchSimpleIcons({ slugs }).then(setData)
    }
  }, [slugs.join(',')])

  const renderedIcons: ReactNode[] = useMemo(() => {
    if (!data) return []
    return Object.values(data.simpleIcons).map((icon) => renderCustomIcon(icon))
  }, [data])

  if (!mounted) return null

  return <Cloud {...cloudProps}>{renderedIcons}</Cloud>
}
