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

const LikeButton = dynamic(
  () => import('@/components/LikeButton').then((m) => ({ default: m.LikeButton })),
  { ssr: false },
)

const FloatingPageLink = dynamic(
  () => import('@/components/FloatingPageLink').then((m) => ({ default: m.FloatingPageLink })),
  { ssr: false },
)

const BackToTop = dynamic(
  () => import('@/components/BackToTop').then((m) => ({ default: m.BackToTop })),
  { ssr: false },
)

export function ClientShell() {
  return (
    <>
      <ParticleBackground />
      <CinematicNav />
      <CinematicScroll />
      <LikeButton />
      <FloatingPageLink />
      <BackToTop />
    </>
  )
}
