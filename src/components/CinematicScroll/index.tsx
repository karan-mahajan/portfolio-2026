'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'experience', 'contact']

export function CinematicScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const triggers: any[] = []
    let rafId: number | null = null

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      SECTION_IDS.forEach((id, i) => {
        const section = document.getElementById(id)
        if (!section) return

        if (i === 0) {
          // Hero: visible by default, fade slightly on exit
          gsap.set(section, { opacity: 1 })
          const t = ScrollTrigger.create({
            trigger: section,
            start: 'bottom 50%',
            end: 'bottom top',
            onLeave: () => gsap.to(section, { opacity: 0.25, duration: 0.5, ease: 'power1.in' }),
            onEnterBack: () => gsap.to(section, { opacity: 1, duration: 0.5, ease: 'power1.out' }),
          })
          triggers.push(t)
        } else {
          // All other sections: fade+slide in, fade+slide out
          gsap.set(section, { opacity: 0, y: 55 })
          const t = ScrollTrigger.create({
            trigger: section,
            start: 'top 82%',
            end: 'bottom 18%',
            onEnter: () =>
              gsap.to(section, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }),
            onLeave: () =>
              gsap.to(section, { opacity: 0, y: -35, duration: 0.55, ease: 'power2.in' }),
            onEnterBack: () =>
              gsap.to(section, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }),
            onLeaveBack: () =>
              gsap.to(section, { opacity: 0, y: 55, duration: 0.55, ease: 'power2.in' }),
          })
          triggers.push(t)
        }
      })

      // Scroll hint: fade after 5% scroll
      const onScrollHint = () => {
        const hint = document.querySelector<HTMLElement>('.km-hero-scroll')
        if (!hint) return
        const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
        hint.classList.toggle('faded', progress > 0.05)
      }
      window.addEventListener('scroll', onScrollHint, { passive: true })
      ;(triggers as any).__scrollHint = onScrollHint
    }

    // Wait one tick so sections are in the DOM
    rafId = requestAnimationFrame(() => {
      rafId = null
      init()
    })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      triggers.forEach((t) => {
        if (t && typeof t.kill === 'function') t.kill()
      })
      const hintFn = (triggers as any).__scrollHint
      if (hintFn) window.removeEventListener('scroll', hintFn)
    }
  }, [pathname])

  return null
}
