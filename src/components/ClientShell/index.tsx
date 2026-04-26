'use client'

import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground').then((m) => ({ default: m.ParticleBackground })),
  { ssr: false },
)

const CinematicNav = dynamic(
  () => import('@/components/CinematicNav').then((m) => ({ default: m.CinematicNav })),
  { ssr: false },
)

const CinematicScroll = dynamic(
  () => import('@/components/CinematicScroll').then((m) => ({ default: m.CinematicScroll })),
  { ssr: false },
)

export function ClientShell() {
  return (
    <>
      <ParticleBackground />
      <CinematicNav />
      <CinematicScroll />
    </>
  )
}
