'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function FloatingPageLink() {
  const pathname = usePathname()
  const isResume = pathname === '/resume'

  return (
    <nav aria-label="Page shortcuts">
    <Link
      href={isResume ? '/' : '/resume'}
      className="km-float-page-link"
      aria-label={isResume ? 'Back to portfolio' : 'View resume'}
      title={isResume ? 'Back to portfolio' : 'View resume'}
      id="portfolio-resume-page-link"
    >
      {isResume ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )}
    </Link>
    </nav>
  )
}
