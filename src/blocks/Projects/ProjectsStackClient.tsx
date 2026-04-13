'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

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

// ─── Constants ───────────────────────────────────────────────────────────────

const DURATION = 0.52
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const MAX_STACK = 3 // how many back cards are visible
const SCALE_STEP = 0.035 // each back card scales down by this amount
const Y_STEP = 30 // px each back card shifts upward (peek from top)
const OPACITY_STEP = 0.18
const PEEK_OFFSET = MAX_STACK * Y_STEP // 60px — top space reserved for peeking cards
const SCROLL_PER_CARD = 1 // scroll distance per card in units of window.innerHeight

// ─── Sub-components ──────────────────────────────────────────────────────────

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5"
  >
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
      clipRule="evenodd"
    />
  </svg>
)

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    {dir === 'left' ? (
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clipRule="evenodd"
      />
    ) : (
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    )}
  </svg>
)

// ─── Decorative pattern for no-thumbnail right panel ─────────────────────────

const DotPattern = ({ color }: { color: string }) => (
  <svg
    className="absolute inset-0 w-full h-full"
    style={{ opacity: 0.15 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill={color === '#ffffff' ? '#000000' : '#ffffff'} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
)

// ─── Single card ─────────────────────────────────────────────────────────────
//
// Cards are positioned with top = PEEK_OFFSET so back cards can shift upward
// into the peek zone (the top PEEK_OFFSET pixels of the stack container).

const ProjectCard = React.forwardRef<HTMLDivElement, { project: ProjectData; index: number }>(
  ({ project, index }, ref) => {
    const hasThumbnail = Boolean(project.thumbnail?.url)

    const linkHref = project.isPrivate ? null : (project.liveUrl ?? project.githubUrl ?? null)
    const linkLabel = project.liveUrl && !project.isPrivate ? 'Live site' : 'GitHub'
    const linkIsGithub = !project.liveUrl || !project.liveUrl.trim()

    return (
      <div
        ref={ref}
        data-card-index={index}
        style={{
          position: 'absolute',
          top: PEEK_OFFSET, // leaves room above for peeking back-cards
          left: 0,
          right: 0,
          bottom: 0,
          willChange: 'transform, opacity',
        }}
      >
        {/* Card shell */}
        <div className="w-full h-full rounded-2xl border border-black/8 bg-white shadow-xl shadow-black/20 overflow-hidden flex flex-col sm:flex-row">
          {/* ── Mobile-only: top image / accent strip ── */}
          <div
            className="relative sm:hidden h-36 shrink-0"
            style={{ backgroundColor: hasThumbnail ? '#f3f4f6' : project.accentColor }}
          >
            {hasThumbnail && project.thumbnail ? (
              <>
                <Image
                  src={project.thumbnail.url}
                  alt={project.thumbnail.alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                  unoptimized
                  loading="lazy"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
                />
              </>
            ) : (
              <>
                <DotPattern color={project.accentColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-black text-white/30 select-none">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ── Text content ── */}
          <div className="flex-1 min-w-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Top row: tech tags */}
            <div className="flex flex-wrap gap-1.5">
              {(project.technologies ?? []).slice(0, 5).map((t) => (
                <span
                  key={t.tech}
                  className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-900 text-gray-100 whitespace-nowrap"
                >
                  {t.tech}
                </span>
              ))}
              {(project.technologies ?? []).length > 5 && (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-700 text-gray-200">
                  +{(project.technologies ?? []).length - 5}
                </span>
              )}
            </div>

            {/* Middle: meta, title, role, description */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 py-3">
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                {project.year} &middot; {project.category}
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                {project.title}
              </h3>
              <p className="text-sm font-semibold" style={{ color: '#6d28d9' }}>
                {project.role}
              </p>
              <p
                className="text-sm text-gray-600 leading-relaxed mt-0.5"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description}
              </p>
            </div>

            {/* Bottom row: link + year */}
            <div className="flex items-center justify-between gap-3">
              <div>
                {project.isPrivate ? (
                  <span className="text-xs text-gray-400 italic">Private client</span>
                ) : linkHref ? (
                  <a
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-colors duration-200"
                  >
                    {linkIsGithub ? <GithubIcon /> : <ExternalLinkIcon />}
                    {linkLabel}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">In progress</span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono shrink-0">{project.year}</span>
            </div>
          </div>

          {/* ── Right: thumbnail or accent block (sm+) ── */}
          <div
            className="relative shrink-0 hidden sm:block"
            style={{
              width: 400,
              backgroundColor: hasThumbnail ? '#f3f4f6' : project.accentColor,
            }}
          >
            {hasThumbnail && project.thumbnail ? (
              <>
                <Image
                  src={project.thumbnail.url}
                  alt={project.thumbnail.alt}
                  fill
                  sizes="400px"
                  className="object-cover object-top"
                  unoptimized
                  loading="lazy"
                />
                <div
                  className="absolute inset-y-0 left-0 w-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
                />
              </>
            ) : (
              <>
                <DotPattern color={project.accentColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl font-black text-white/30 select-none">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  },
)
ProjectCard.displayName = 'ProjectCard'

// ─── Main client component ────────────────────────────────────────────────────

export const ProjectsStackClient: React.FC<{
  projects: ProjectData[]
  title?: string | null
}> = ({ projects, title }) => {
  const N = projects.length
  const [activeIndex, setActiveIndex] = useState(0)

  // Refs — kept outside React state so GSAP callbacks never see stale values
  const activeRef = useRef(0)
  const isAnimating = useRef(false)
  const isWrapping = useRef(false) // suppresses ScrollTrigger during wrap transitions
  const pendingTargetRef = useRef(-1) // queues the last requested index during an animation
  const stRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null)
  const touchStartY = useRef(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** How many steps forward from `active` is card `i` (circular, 0 = active) */
  const forwardDist = (i: number, active: number) => (i - active + N) % N

  const setCardPosition = useCallback((cardEl: HTMLDivElement, diff: number, animate = false) => {
    const visible = diff <= MAX_STACK
    const props = visible
      ? {
          scale: 1 - diff * SCALE_STEP,
          y: -diff * Y_STEP, // negative = shift UP into the peek zone
          opacity: diff === 0 ? 1 : Math.max(0, 1 - diff * OPACITY_STEP),
          zIndex: 10 - diff,
          pointerEvents: diff === 0 ? 'auto' : 'none',
        }
      : { opacity: 0, zIndex: 0, pointerEvents: 'none', y: 0, scale: 1 }

    if (animate) {
      gsap.to(cardEl, { ...props, duration: DURATION, ease: EASE, overwrite: 'auto' })
    } else {
      gsap.set(cardEl, props)
    }
  }, [])

  // ── Initialise card positions on mount ───────────────────────────────────

  useEffect(() => {
    if (N === 0) return
    projects.forEach((_, i) => {
      const card = cardRefs.current[i]
      if (card) setCardPosition(card, forwardDist(i, 0))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N])

  // ── Core transition ───────────────────────────────────────────────────────

  const goTo = useCallback(
    (newRawIndex: number) => {
      if (N === 0) return
      const normalized = ((newRawIndex % N) + N) % N

      // Always store the latest requested target so we can catch up after an animation
      pendingTargetRef.current = normalized

      // If already animating, let the delayedCall below handle it when done
      if (isAnimating.current) return
      if (normalized === activeRef.current) return

      isAnimating.current = true
      const oldActive = activeRef.current
      const cards = cardRefs.current

      // Update UI immediately so dots/counter don't lag behind the animation
      setActiveIndex(normalized)

      // Outgoing active card: fly upward and out of the peek zone
      const outCard = cards[oldActive]
      if (outCard) {
        gsap.to(outCard, {
          scale: 0.94,
          y: -(PEEK_OFFSET + 50), // clear above the container
          opacity: 0,
          zIndex: 11,
          duration: DURATION * 0.55,
          ease: EASE,
          overwrite: 'auto',
        })
      }

      // All other cards animate to their new stack positions
      projects.forEach((_, i) => {
        if (i === oldActive) return
        const card = cards[i]
        if (!card) return
        setCardPosition(card, forwardDist(i, normalized), true)
      })

      // After transition: commit state and handle any pending jump
      gsap.delayedCall(DURATION, () => {
        activeRef.current = normalized

        // Reset the outgoing card to its new circular position instantly
        const newDiffForOld = forwardDist(oldActive, normalized)
        if (outCard) setCardPosition(outCard, newDiffForOld)

        isAnimating.current = false

        // If scroll moved further while we were animating, process the final target
        const pending = pendingTargetRef.current
        if (pending !== normalized) {
          goTo(pending)
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [N, setCardPosition],
  )

  // ── Arrow / dot navigation — syncs the scroll position so ScrollTrigger
  //    stays in agreement. Falls back to direct goTo when trigger isn't ready.
  // ─────────────────────────────────────────────────────────────────────────

  const scrollToCardIndex = useCallback(
    (idx: number) => {
      // Clamp to valid range (arrows don't wrap)
      const clamped = Math.max(0, Math.min(N - 1, idx))
      const st = stRef.current
      if (st) {
        // target scroll = pin-start + card-index × one-screen-height
        const targetScroll = st.start + clamped * SCROLL_PER_CARD * window.innerHeight
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      } else {
        goTo(clamped)
      }
    },
    [N, goTo],
  )

  const goNext = useCallback(() => {
    const next = activeRef.current + 1
    if (next >= N) {
      // Wrap to first: animate directly and silently teleport scroll afterward
      isWrapping.current = true
      goTo(0)
      gsap.delayedCall(DURATION + 0.05, () => {
        const st = stRef.current
        if (st) window.scrollTo({ top: st.start })
        isWrapping.current = false
      })
    } else {
      scrollToCardIndex(next)
    }
  }, [N, goTo, scrollToCardIndex])

  const goPrev = useCallback(() => {
    const prev = activeRef.current - 1
    if (prev < 0) {
      // Wrap to last: animate directly and silently teleport scroll afterward
      isWrapping.current = true
      goTo(N - 1)
      gsap.delayedCall(DURATION + 0.05, () => {
        const st = stRef.current
        if (st) window.scrollTo({ top: st.end })
        isWrapping.current = false
      })
    } else {
      scrollToCardIndex(prev)
    }
  }, [N, goTo, scrollToCardIndex])

  // Dot / number navigation also keeps scroll in sync
  const goToByClick = useCallback((idx: number) => scrollToCardIndex(idx), [scrollToCardIndex])

  // ── GSAP ScrollTrigger ────────────────────────────────────────────────────

  useEffect(() => {
    if (N === 0) return

    gsap.registerPlugin(ScrollTrigger)

    const container = containerRef.current
    if (!container) return

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${(N - 1) * SCROLL_PER_CARD * window.innerHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        if (isWrapping.current) return
        // Derive the target card index from scroll progress
        const newIndex = Math.min(Math.floor(self.progress * N), N - 1)
        goTo(newIndex)
      },
    })

    stRef.current = st

    return () => {
      st.kill()
      stRef.current = null
    }
  }, [N, goTo])

  // ── Touch swipe ───────────────────────────────────────────────────────────

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 40) {
        if (delta > 0) goNext()
        else goPrev()
      }
    }

    stack.addEventListener('touchstart', onTouchStart, { passive: true })
    stack.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      stack.removeEventListener('touchstart', onTouchStart)
      stack.removeEventListener('touchend', onTouchEnd)
    }
  }, [goNext, goPrev])

  // ── Keyboard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // ─────────────────────────────────────────────────────────────────────────

  if (N === 0) {
    return (
      <div className="container py-20 text-center text-white/40 text-sm">
        No projects added yet.
      </div>
    )
  }

  return (
    /* Outer: this is the ScrollTrigger pin target */
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '100vh', overflow: 'hidden', zIndex: 110 }}
      id="projects"
    >
      <div className="container h-full flex flex-col py-8">
        {/* ── Header row ────────────────────────────────────────────────── */}
        <div className="flex items-baseline justify-between mb-4 shrink-0">
          {title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              {title}
            </h2>
          )}
          <span className="text-sm text-white/40 font-mono ml-auto">
            {String(activeIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;
            {String(N).padStart(2, '0')}
          </span>
        </div>

        {/* ── Card stack ────────────────────────────────────────────────── */}
        {/* overflow-hidden clips peek cards at the container boundary      */}
        <div
          ref={stackRef}
          className="relative flex-1 min-h-0 overflow-hidden"
          role="region"
          aria-label="Projects"
          aria-live="polite"
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
            />
          ))}
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="shrink-0 pt-5 flex items-center justify-center gap-4">
          {/* Prev */}
          <button
            onClick={goPrev}
            aria-label="Previous project"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors duration-200"
          >
            <ArrowIcon dir="left" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Project indicators">
            {projects.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to project ${i + 1}`}
                onClick={() => goToByClick(i)}
                style={{
                  transition: `width ${DURATION}s ${EASE}, background-color ${DURATION}s ${EASE}`,
                  width: i === activeIndex ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === activeIndex ? '#7c3aed' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            aria-label="Next project"
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors duration-200"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </div>
  )
}
