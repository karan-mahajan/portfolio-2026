'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { useTheme } from '@/providers/Theme'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const navItems = data?.navItems || []

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleMenu = () => {
    const next = !isMenuOpen
    setIsMenuOpen(next)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = next ? 'hidden' : ''
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  return (
    <>
      <header className="km-nav" aria-label="Site navigation">
        <div className="km-nav-inner">
          {/* Logo */}
          <a href="#hero" className="km-nav-logo">
            <span className="km-nav-logo-mark">K</span>
            <span>
              karan<span className="text-accent">.</span>mahajan
            </span>
          </a>

          {/* Desktop nav links — from CMS or fallback anchors */}
          <nav aria-label="Main navigation">
            <ul className="km-nav-links">
              {navItems.length > 0 ? (
                navItems.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} appearance="inline" />
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#about">About</a></li>
                  <li><a href="#skills">Skills</a></li>
                  <li><a href="#projects">Projects</a></li>
                  <li><a href="#experience">Experience</a></li>
                  <li><a href="#contact">Contact</a></li>
                </>
              )}
            </ul>
          </nav>

          {/* Available badge */}
          <a href="#contact" className="km-nav-cta">
            <span className="inline-block size-1.5 rounded-full bg-[#20c070] shadow-[0_0_8px_#20c070]" />
            Available for work
          </a>

          {/* Theme toggle */}
          <button
            className="km-theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
          >
            {/* Sun icon */}
            <svg
              className="icon-sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            {/* Moon icon */}
            <svg
              className="icon-moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          </button>

          {/* Hamburger — mobile only */}
          <button
            ref={hamburgerRef}
            className={`km-nav-hamburger${isMenuOpen ? ' open' : ''}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        ref={mobileMenuRef}
        className={`km-mobile-menu${isMenuOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {navItems.length > 0 ? (
          navItems.map(({ link }, i) => (
            <div key={i} onClick={closeMenu}>
              <CMSLink {...link} appearance="inline" />
            </div>
          ))
        ) : (
          <>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#skills" onClick={closeMenu}>Skills</a>
            <a href="#projects" onClick={closeMenu}>Projects</a>
            <a href="#experience" onClick={closeMenu}>Experience</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </>
        )}
      </div>
    </>
  )
}
