'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/providers/Theme'

const SECTIONS = [
  { id: 'hero', label: 'home' },
  { id: 'about', label: '01 / about' },
  { id: 'projects', label: '02 / work' },
  { id: 'skills', label: '03 / stack' },
  { id: 'contact', label: '04 / contact' },
]

export function CinematicNav() {
  const [fillPct, setFillPct] = useState(0)
  const [activeId, setActiveId] = useState('hero')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      setFillPct(pct)

      const mid = window.innerHeight * 0.5
      let found = 'hero'
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= mid) found = s.id
      }
      setActiveId(found)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleDotClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? ''

  return (
    <>
      {/* Vertical progress nav — fixed right */}
      <nav className="km-vertical-nav" aria-label="Section navigation">
        <div className="km-vertical-nav-track">
          <div className="km-vertical-nav-line" />
          <div className="km-vertical-nav-fill" style={{ height: `${fillPct}%` }} />
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`km-vertical-nav-dot${activeId === s.id ? ' active' : ''}`}
              onClick={() => handleDotClick(s.id)}
              aria-label={`Go to ${s.label}`}
              title={s.label}
            />
          ))}
        </div>
      </nav>

      {/* Current section label — bottom left */}
      <div className="km-current-section-label" aria-live="polite">
        {activeLabel}
      </div>

      {/* Floating theme toggle — bottom right */}
      <button
        className="km-float-theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={theme === 'dark' ? 'Switch to warm mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Warm mode' : 'Dark mode'}
      >
        {theme === 'dark' ? (
          /* Sun icon */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          /* Moon icon */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
        )}
      </button>
    </>
  )
}
