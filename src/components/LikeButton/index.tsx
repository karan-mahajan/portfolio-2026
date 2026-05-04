'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'portfolio_liked'

export function LikeButton() {
  const [liked, setLiked] = useState(false)
  const [visible, setVisible] = useState(false)
  const [popping, setPopping] = useState(false)
  const cleanupRef = useRef<() => void>()

  useEffect(() => {
    setLiked(!!localStorage.getItem(STORAGE_KEY))

    const show = () => {
      if (window.scrollY > window.innerHeight * 0.3) {
        setVisible(true)
        cleanup()
      }
    }

    const timer = setTimeout(() => {
      setVisible(true)
      window.removeEventListener('scroll', show)
    }, 20_000)

    const cleanup = () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', show)
    }

    cleanupRef.current = cleanup
    window.addEventListener('scroll', show, { passive: true })
    show()

    return cleanup
  }, [])

  const handleLike = async () => {
    if (liked || popping) return
    setPopping(true)
    setLiked(true)
    localStorage.setItem(STORAGE_KEY, '1')

    try {
      await fetch('/api/like', { method: 'POST' })
    } catch {
      // best-effort — state is already set in localStorage
    }

    setTimeout(() => setPopping(false), 600)
  }

  if (!visible) return null

  return (
    <button
      className={`km-like-btn${liked ? ' km-like-btn--liked' : ''}${popping ? ' km-like-btn--pop' : ''}`}
      onClick={handleLike}
      aria-label={liked ? 'Thanks for the like!' : 'Like this portfolio'}
      title={liked ? 'Thanks!' : 'Like this portfolio'}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    </button>
  )
}
