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

    /* ── Cursor + ambient glow ──────────────────────── */
    const dot = document.querySelector<HTMLElement>('.cursor-dot')
    const ring = document.querySelector<HTMLElement>('.cursor-ring')

    let rafId: number | null = null
    let glowRafId: number | null = null
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let gx = mx
    let gy = my
    let glowEl: HTMLDivElement | null = null

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

    const isHoverDevice = window.matchMedia('(hover: hover)').matches

    if (isHoverDevice && !prefersReducedMotion) {
      /* Ambient glow that lazily follows cursor */
      glowEl = document.createElement('div')
      glowEl.className = 'km-cursor-glow'
      document.body.appendChild(glowEl)
      const glowNode = glowEl

      const tickGlow = () => {
        gx += (mx - gx) * 0.04
        gy += (my - gy) * 0.04
        glowNode.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`
        glowRafId = requestAnimationFrame(tickGlow)
      }
      tickGlow()

      window.addEventListener('mousemove', onMouseMove, { passive: true })

      if (dot && ring) {
        rafId = requestAnimationFrame(tickRing)

        const addHover = (el: Element) => {
          el.addEventListener('mouseenter', () => ring?.classList.add('hover'))
          el.addEventListener('mouseleave', () => ring?.classList.remove('hover'))
        }

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

      /* ── Magnetic buttons ─────────────────────────── */
      document.querySelectorAll<HTMLElement>('.km-btn, .km-nav-cta').forEach((el) => {
        el.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent
          const rect = el.getBoundingClientRect()
          const dx = (me.clientX - (rect.left + rect.width / 2)) * 0.3
          const dy = (me.clientY - (rect.top + rect.height / 2)) * 0.3
          el.style.translate = `${dx}px ${dy}px`
        })
        el.addEventListener('mouseleave', () => {
          el.style.translate = '0px 0px'
        })
      })
    }

    /* ── Nav scroll class + timeline draw + pulse dot ── */
    const nav = document.querySelector('.km-nav')
    const timelineProgress = document.querySelector<HTMLElement>('.km-timeline-progress')
    const timelineEl = document.querySelector<HTMLElement>('.km-timeline')
    const pulseDot = document.querySelector<HTMLElement>('.km-pulse-dot')
    const contactSection = document.getElementById('contact')

    const onScroll = () => {
      nav?.classList.toggle('scrolled', window.scrollY > 20)

      /* Timeline draw */
      if (timelineProgress && timelineEl) {
        const rect = timelineEl.getBoundingClientRect()
        const wh = window.innerHeight
        const pct =
          Math.max(0, Math.min(1, (wh * 0.8 - rect.top) / (wh * 0.6 + rect.height))) * 100
        timelineProgress.style.height = `${pct}%`
      }

      /* Pulse dot speeds up near contact section */
      if (pulseDot && contactSection) {
        const rect = contactSection.getBoundingClientRect()
        const isNear = rect.top < window.innerHeight * 1.1 && rect.bottom > 0
        pulseDot.classList.toggle('fast', isNear)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    /* ── Reveal on scroll (IntersectionObserver) ────── */
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

    /* ── Stat counter animation ─────────────────────── */
    let countObs: IntersectionObserver | null = null
    if (!prefersReducedMotion) {
      const countEls = document.querySelectorAll<HTMLElement>('[data-count]')
      if (countEls.length) {
        countObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (!en.isIntersecting) return
              const el = en.target as HTMLElement
              const raw = el.dataset.count ?? ''
              const match = raw.match(/^(\d+\.?\d*)(.*)$/)
              if (!match) return
              const num = parseFloat(match[1])
              const suffix = match[2]
              const duration = 1400
              const start = performance.now()
              const tick = (now: number) => {
                const t = Math.min((now - start) / duration, 1)
                const eased = 1 - Math.pow(1 - t, 3)
                el.textContent = Math.round(num * eased) + suffix
                if (t < 1) requestAnimationFrame(tick)
              }
              requestAnimationFrame(tick)
              countObs!.unobserve(el)
            })
          },
          { threshold: 0.5 },
        )
        countEls.forEach((el) => countObs!.observe(el))
      }
    }

    /* ── Skill card spotlight ───────────────────────── */
    const onCardMouseMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement
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
      if (glowRafId !== null) cancelAnimationFrame(glowRafId)
      glowEl?.remove()
      revObs.disconnect()
      sectObs.disconnect()
      countObs?.disconnect()
    }
  }, [])

  return null
}
