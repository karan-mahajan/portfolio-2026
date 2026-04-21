'use client'

import { useEffect } from 'react'

export function GlobalInteractions() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Loader ─────────────────────────────────────── */
    const loader = document.getElementById('km-loader')
    const nameEl = document.getElementById('km-loader-name')

    if (nameEl) {
      const text = 'KARAN.MAHAJAN'
      nameEl.innerHTML = [...text]
        .map(
          (c, i) =>
            `<span style="animation-delay:${i * 40}ms">${c === '.' ? '·' : c}</span>`,
        )
        .join('')
    }

    const hideLoader = () => {
      setTimeout(() => loader?.classList.add('done'), 700)
    }

    if (document.readyState === 'complete') {
      hideLoader()
    } else {
      window.addEventListener('load', hideLoader, { once: true })
    }

    /* ── Custom cursor ──────────────────────────────── */
    const dot = document.querySelector<HTMLElement>('.cursor-dot')
    const ring = document.querySelector<HTMLElement>('.cursor-ring')

    let rafId: number | null = null
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }

    const tickRing = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tickRing)
    }

    const addHover = (el: Element) => {
      el.addEventListener('mouseenter', () => ring?.classList.add('hover'))
      el.addEventListener('mouseleave', () => ring?.classList.remove('hover'))
    }

    if (dot && ring && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      rafId = requestAnimationFrame(tickRing)

      document
        .querySelectorAll(
          'a, button, input, textarea, .km-skill-card, .km-stat-card, .km-project-card, .km-timeline-card',
        )
        .forEach(addHover)

      window.addEventListener('mouseleave', () => {
        if (dot) dot.style.opacity = '0'
        if (ring) ring.style.opacity = '0'
      })
      window.addEventListener('mouseenter', () => {
        if (dot) dot.style.opacity = '1'
        if (ring) ring.style.opacity = '1'
      })
    }

    /* ── Nav scroll class ───────────────────────────── */
    const nav = document.querySelector('.km-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── Reveal on scroll (Intersection Observer) ───── */
    const revealEls = document.querySelectorAll('.km-reveal, [data-km-stagger]')
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement
            el.classList.add('in')
            if (el.dataset.kmStagger !== undefined) {
              ;[...el.children].forEach((k, i) => {
                ;(k as HTMLElement).style.transitionDelay = `${i * 70}ms`
              })
            }
            revObs.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    revealEls.forEach((el) => revObs.observe(el))

    /* ── Skill card spotlight ───────────────────────── */
    const onCardMouseMove = (e: Event) => {
      const card = (e.currentTarget as HTMLElement)
      const r = card.getBoundingClientRect()
      const me = e as MouseEvent
      card.style.setProperty('--mx', `${((me.clientX - r.left) / r.width) * 100}%`)
      card.style.setProperty('--my', `${((me.clientY - r.top) / r.height) * 100}%`)
    }

    document.querySelectorAll('.km-skill-card').forEach((card) => {
      card.addEventListener('mousemove', onCardMouseMove)
    })

    /* ── Active nav link highlighting ──────────────── */
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.km-nav-links a')
    const sections = [...navLinks]
      .map((a) => {
        const href = a.getAttribute('href')
        return href ? document.querySelector(href) : null
      })
      .filter(Boolean) as Element[]

    const sectObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'))
            const id = en.target.id
            navLinks.forEach((l) => {
              if (l.getAttribute('href') === `#${id}`) l.classList.add('active')
            })
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )

    sections.forEach((s) => sectObs.observe(s))

    /* ── Cleanup ────────────────────────────────────── */
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
      revObs.disconnect()
      sectObs.disconnect()
    }
  }, [])

  return null
}
