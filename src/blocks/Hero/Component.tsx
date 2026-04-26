'use client'

import type { HeroBlock as HeroBlockProps, Media } from '@/payload-types'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

// ─── Particle canvas (kept intact, still renders in non-cinematic fallback) ──

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let animId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }> =
      []

    const COUNT = Math.min(70, Math.floor(window.innerWidth / 20))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.2,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < 140 * 140) {
            const alpha = (1 - Math.sqrt(d2) / 140) * 0.25
            ctx.strokeStyle = `rgba(79,142,247,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      const dotCol =
        getComputedStyle(document.documentElement).getPropertyValue('--particle-dot').trim() ||
        '80,110,200'

      for (const p of particles) {
        ctx.fillStyle = `rgba(${dotCol},${p.a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(tick)
    }

    const init = () => {
      resize()
      spawn()
    }

    init()
    window.addEventListener('resize', init)
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', init)
    }
  }, [])

  return <canvas ref={canvasRef} className="km-hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

// ─── Typewriter ──────────────────────────────────────────────────────────────

const TypewriterWord: React.FC<{ words: string[] }> = ({ words }) => {
  const [text, setText] = useState('')

  useEffect(() => {
    if (words.length === 0) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setText(words[0])
      return
    }

    let wi = 0
    let ci = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      const w = words[wi]
      if (!deleting) {
        ci++
        setText(w.slice(0, ci))
        if (ci === w.length) {
          deleting = true
          timer = setTimeout(step, 1400)
        } else {
          timer = setTimeout(step, 65 + Math.random() * 40)
        }
      } else {
        ci--
        setText(w.slice(0, ci))
        if (ci === 0) {
          deleting = false
          wi = (wi + 1) % words.length
          timer = setTimeout(step, 220)
        } else {
          timer = setTimeout(step, 35)
        }
      }
    }

    timer = setTimeout(step, 400)
    return () => clearTimeout(timer)
  }, [words])

  return (
    <span className="km-typewriter">
      <span className="km-typewriter-prefix">~/building-with</span>
      <span className="km-typewriter-word">{text}</span>
      <span className="km-typewriter-caret" />
    </span>
  )
}

// ─── Hero Block ──────────────────────────────────────────────────────────────

const META_ICONS = [
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </svg>,
  <svg key="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7 9 18l-5-5" />
  </svg>,
  <svg key="layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
  </svg>,
]

export const HeroBlockComponent: React.FC<HeroBlockProps> = ({
  name,
  typewriterStrings,
  socialLinks,
  resume,
  contactHref,
  status,
  title,
  tagline,
  photo,
  location,
  statusCardText,
  metaItems,
}) => {
  const words =
    (typewriterStrings ?? []).map((s) => s.text).filter((t): t is string => !!t)

  const resumeMedia = resume && typeof resume === 'object' ? (resume as Media) : null
  const resumeUrl = resumeMedia?.url ?? null

  const photoMedia = photo && typeof photo === 'object' ? (photo as Media) : null

  const stats = (metaItems ?? []).filter((m): m is { label: string; id?: string | null } => !!m.label)

  // Derive role stack from typewriter strings for the role list
  const roleWords = words.length > 0 ? words : ['Next.js', 'React', 'TypeScript', 'Node.js']

  return (
    <section id="hero" className="km-hero km-cinematic">
      <ParticleCanvas />

      {/* Small circular photo — cinematic top-right */}
      {photoMedia?.url && (
        <div className="km-hero-photo-mini">
          <Image
            src={photoMedia.url}
            alt={photoMedia.alt ?? name ?? 'Profile photo'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="68px"
            priority
          />
        </div>
      )}

      <div className="km-container km-hero-grid">
        {/* Left/bottom column — copy */}
        <div className="km-hero-copy">

          {/* Eyebrow: amber italic uppercase */}
          <div className="km-hero-eyebrow km-reveal">
            {status ?? 'available for work · ontario, canada'}
          </div>

          {/* Massive Syne 800 name */}
          <h1 className="km-reveal">
            {name ?? 'Karan'}
            <br />
            <span className="km-grad">{title ?? 'Mahajan.'}</span>
          </h1>

          {/* Role stack — small DM Mono, 0.5 opacity */}
          <div className="km-hero-role-stack km-reveal">
            {roleWords.slice(0, 4).map((w, i) => (
              <span key={i} className="km-hero-role-item">{w}</span>
            ))}
          </div>

          {/* Typewriter */}
          <div className="km-reveal">
            <TypewriterWord words={roleWords} />
          </div>

          {/* Tagline */}
          <p className="km-hero-one-liner km-reveal">
            {tagline ?? 'I build fast, scalable web applications — and I use AI to do it better.'}
          </p>

          {/* CTA buttons */}
          <div className="km-hero-cta km-reveal">
            <a href="#projects" className="km-btn km-btn-primary">
              View My Work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a href={contactHref ?? '#contact'} className="km-btn km-btn-ghost">
              Get In Touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="km-btn km-btn-ghost">
                Résumé
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
            )}
          </div>

          {/* Meta stats */}
          {stats.length > 0 && (
            <div className="km-hero-meta km-reveal">
              {stats.slice(0, 3).map((item, i) => (
                <div key={item.id ?? i}>
                  {META_ICONS[i] ?? META_ICONS[0]}
                  {item.label}
                </div>
              ))}
            </div>
          )}

          {/* Social links */}
          {(socialLinks?.github || socialLinks?.linkedin) && (
            <div className="km-hero-socials km-reveal" style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{ display: 'inline-flex' }}
                >
                  <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}>
                      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.7.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.3-5.23-1.28-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.47.11-3.07 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.75 0c2.2-1.5 3.16-1.18 3.16-1.18.62 1.6.23 2.77.11 3.07.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.37-5.25 5.66.42.36.78 1.05.78 2.12v3.14c0 .3.21.66.78.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                    </svg>
                  </span>
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ display: 'inline-flex' }}
                >
                  <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}>
                      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Large photo card (hidden via CSS in cinematic mode, kept for non-cinematic) */}
        <div className="km-hero-photo-wrap km-reveal km-reveal-right">
          <div className="km-hero-photo-card tl">
            <span className="km-dot" />
            {statusCardText ?? 'online · coding'}
          </div>
          <div className="km-hero-photo">
            {photoMedia?.url ? (
              <Image
                src={photoMedia.url}
                alt={photoMedia.alt ?? name ?? 'Profile photo'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 240px, 320px"
                priority
              />
            ) : (
              <div className="km-hero-photo-placeholder">
                <div className="km-initials">
                  {name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'KM'}
                </div>
                <div className="km-ph-label">Upload a photo in the CMS</div>
              </div>
            )}
          </div>
          <div className="km-hero-photo-card br">
            <span className="km-dot km-dot-v" />
            {location ?? 'Windsor, ON'}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="km-hero-scroll">
        <span>Scroll</span>
        <span className="km-hero-scroll-line" />
      </div>
    </section>
  )
}
