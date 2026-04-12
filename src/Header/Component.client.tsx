'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const navItems = data?.navItems || []

  useEffect(() => {
    setHeaderTheme(null)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      {/* Top bar */}
      <div className="py-4 flex justify-between items-center">
        <Link href="/" aria-label="Home">
          <Logo className="text-secondary" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className="text-sm font-medium text-gray-300 hover:text-secondary transition-colors duration-200 tracking-wide"
            />
          ))}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.25 w-8 h-8 text-white cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block h-0.5 w-full bg-current origin-center transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.75' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current origin-center transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.75' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {isMenuOpen && (
        <nav
          className="md:hidden border-t border-white/10 py-5 flex flex-col gap-5"
          aria-label="Mobile navigation"
        >
          {navItems.map(({ link }, i) => (
            <div key={i} onClick={() => setIsMenuOpen(false)}>
              <CMSLink
                {...link}
                appearance="inline"
                className="block text-base font-medium text-gray-300 hover:text-secondary transition-colors duration-200"
              />
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
