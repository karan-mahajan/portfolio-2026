'use client'

import React, { useCallback, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProjectData {
  id: number
  title: string
  order: number
  year: number
  category: string
  role: string
  description: string
  technologies: Array<{ tech: string }>
  thumbnail: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  accentColor: string
  liveUrl: string | null
  githubUrl: string | null
  isPrivate: boolean
}

// ─── Fake browser preview ────────────────────────────────────────────────────

const ProjectPreview: React.FC<{ project: ProjectData; index: number }> = ({ project, index }) => {
  const accent = project.accentColor || '#4f8ef7'

  const layouts = [
    // Layout 0 — two-pane editor
    <div
      key="0"
      style={{
        position: 'absolute',
        inset: 16,
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: 12,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {[60, 80, 50, 70, 40].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 8 : 6,
              width: `${w}%`,
              background: i === 0 ? accent : 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              opacity: i === 0 ? 0.8 : 1,
            }}
          />
        ))}
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.15)', borderRadius: 4 }} />
        {[95, 88, 92, 70].map((w, i) => (
          <div key={i} style={{ height: 6, width: `${w}%`, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }} />
        ))}
        <div
          style={{
            marginTop: 8,
            height: 40,
            background: `rgba(${accent === '#4f8ef7' ? '79,142,247' : '122,108,255'},0.08)`,
            border: `1px dashed ${accent}44`,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: accent,
          }}
        >
          ▍ AI-powered workflow…
        </div>
      </div>
    </div>,

    // Layout 1 — product grid
    <div
      key="1"
      style={{ position: 'absolute', inset: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            aspectRatio: '3/4',
            position: 'relative',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
            <div style={{ height: 8, width: '70%', background: 'rgba(255,255,255,0.6)', borderRadius: 3, marginBottom: 6 }} />
            <div style={{ height: 6, width: '40%', background: accent, borderRadius: 3, opacity: 0.8 }} />
          </div>
        </div>
      ))}
    </div>,

    // Layout 2 — dashboard stats
    <div
      key="2"
      style={{ position: 'absolute', inset: 16, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 12 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          { label: 'TOTAL', val: '1,284', color: 'var(--text)' },
          { label: 'ON TIME', val: '94%', color: '#47d78a' },
          { label: 'REVENUE', val: '$2.4M', color: 'var(--text)' },
          { label: 'ALERTS', val: '3', color: '#ff8a68' },
        ].map(({ label, val, color }, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-mute)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color }}>{val}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id={`g${index}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={accent} stopOpacity="0.4" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L30,65 L60,72 L90,45 L120,55 L150,25 L180,35 L210,18 L240,30 L270,8 L300,20 L300,100 L0,100 Z"
            fill={`url(#g${index})`}
          />
          <path
            d="M0,80 L30,65 L60,72 L90,45 L120,55 L150,25 L180,35 L210,18 L240,30 L270,8 L300,20"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>,

    // Layout 3 — editorial / CMS
    <div
      key="3"
      style={{ position: 'absolute', inset: 16, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 12 }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ height: 10, width: 90, background: 'rgba(255,255,255,0.6)', borderRadius: 3 }} />
        <div style={{ flex: 1 }} />
        <div style={{ height: 6, width: 40, background: accent, borderRadius: 3 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 8,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ height: 14, width: '80%', background: 'rgba(255,255,255,0.8)', borderRadius: 3 }} />
          <div style={{ height: 8, width: '50%', background: accent, opacity: 0.7, borderRadius: 3 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 10 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ height: 8, width: '75%', background: 'rgba(255,255,255,0.6)', borderRadius: 3, marginBottom: 6 }} />
              <div style={{ height: 6, width: '40%', background: accent, opacity: 0.7, borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </div>
    </div>,
  ]

  const layoutIndex = index % layouts.length

  return (
    <div className="km-project-preview">
      <div className="km-preview-chrome">
        <span className="km-pdot" />
        <span className="km-pdot" />
        <span className="km-pdot" />
        <span className="km-preview-url">
          {project.liveUrl
            ? project.liveUrl.replace(/^https?:\/\//, '')
            : `${project.title.toLowerCase().replace(/\s+/g, '-')}.dev`}
        </span>
      </div>
      <div
        className="km-preview-body"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${accent}22, transparent 55%), linear-gradient(135deg, var(--preview-bg), var(--bg-2))`,
        }}
      >
        {project.thumbnail?.url ? (
          <img
            src={project.thumbnail.url}
            alt={project.thumbnail.alt}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          layouts[layoutIndex]
        )}
      </div>
    </div>
  )
}

// ─── 3D Tilt Card Wrapper ────────────────────────────────────────────────────

const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotY = (x - 0.5) * 18
    const rotX = -(y - 0.5) * 12
    el.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.10) 0%, transparent 65%)`
      glareRef.current.style.opacity = '1'
    }
  }, [])

  const onMouseEnter = useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    el.style.transition = 'transform 0.08s ease'
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    el.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)'
    el.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
    transitionTimer.current = setTimeout(() => {
      if (el) el.style.transition = ''
    }, 650)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="km-card-tilt"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <div ref={glareRef} className="km-card-glare" aria-hidden="true" />
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

interface Props {
  projects: ProjectData[]
  title?: string | null
}

export const ProjectsStackClient: React.FC<Props> = ({ projects, title }) => {
  const pinsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = pinsRef.current
    if (!container) return

    const pins = [...container.querySelectorAll<HTMLElement>('.km-project-pin')]
    if (!pins.length) return

    let rafId: number | null = null

    const update = () => {
      const vh = window.innerHeight
      pins.forEach((pin, i) => {
        const card = pin.querySelector<HTMLElement>('.km-project-card')
        if (!card) return
        const next = pins[i + 1]
        if (!next) {
          card.style.transform = ''
          card.style.opacity = ''
          card.style.filter = ''
          return
        }
        const nextRect = next.getBoundingClientRect()
        let p = 1 - Math.min(1, Math.max(0, nextRect.top / vh))
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
        const scale = 1 - e * 0.08
        const ty = -e * 24
        const op = 1 - e * 0.35
        card.style.transform = `translateY(${ty}px) scale(${scale})`
        card.style.opacity = String(op)
        card.style.filter = `blur(${e * 1.2}px)`
      })
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        update()
        rafId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [projects])

  if (!projects.length) return null

  return (
    <section id="projects" className="km-cinematic">
      <div className="km-container">
        <div className="km-section-num km-reveal">02 / work</div>
        <h2 className="km-section-title km-reveal">{title ?? 'Selected work.'}</h2>
        <p className="km-section-sub km-reveal">
          Scroll to flip through the deck — each card pins until the next one takes over.
        </p>
      </div>

      <div className="km-projects-deck" ref={pinsRef}>
        {projects.map((project, i) => (
          <div className="km-project-pin" key={project.id}>
            <TiltCard>
            <div className="km-project-card">
              {/* Left — copy */}
              <div className="km-project-copy">
                <div className="km-project-index">
                  Project {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </div>
                <h3 className="km-project-name">{project.title}</h3>
                <p className="km-project-desc">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-9">
                  {project.technologies.map(({ tech }, ti) => (
                    <span key={ti} className="km-project-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3.5 flex-wrap">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="km-project-link"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M10 14 21 3M21 14v7h-7M3 10V3h7" />
                      </svg>
                      Live demo
                    </a>
                  )}
                  {project.githubUrl && !project.isPrivate && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="km-project-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.55v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.7.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.3-5.23-1.28-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.47.11-3.07 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.75 0c2.2-1.5 3.16-1.18 3.16-1.18.62 1.6.23 2.77.11 3.07.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.37-5.25 5.66.42.36.78 1.05.78 2.12v3.14c0 .3.21.66.78.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.isPrivate && (
                    <span className="km-project-link opacity-50 cursor-default">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Private repo
                    </span>
                  )}
                </div>
              </div>

              {/* Right — fake browser */}
              <ProjectPreview project={project} index={i} />
            </div>
            </TiltCard>
          </div>
        ))}
      </div>

      <div className="km-container">
        <p className="km-project-footer-note">
          More work available on request — <a href="#contact">let&apos;s talk</a>.
        </p>
      </div>
    </section>
  )
}
