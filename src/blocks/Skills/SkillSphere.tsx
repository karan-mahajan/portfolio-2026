'use client'

import { useEffect, useRef } from 'react'

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export default function SkillSphere({ skills }: { skills: string[] }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const pauseRef = useRef(false)
  const hoveredRef = useRef<HTMLElement | null>(null)
  const ryRef = useRef(0)

  useEffect(() => {
    const inner = innerRef.current
    if (!inner || !skills.length) return

    const items = [...inner.querySelectorAll<HTMLElement>('[data-sphere-item]')]
    const n = items.length
    const R = 160

    // Fibonacci sphere — maximally uniform distribution
    const positions: [number, number, number][] = items.map((_, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      return [
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.sin(phi) * Math.sin(theta),
        R * Math.cos(phi),
      ]
    })

    items.forEach((el, i) => {
      const [x, y, z] = positions[i]
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`
    })

    const RX = 0.35
    let raf: number

    const tick = () => {
      if (!pauseRef.current) ryRef.current += 0.0028

      const ry = ryRef.current
      inner.style.transform = `rotateX(${RX}rad) rotateY(${ry}rad)`

      const cosX = Math.cos(RX)
      const sinX = Math.sin(RX)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)

      items.forEach((el, i) => {
        if (el === hoveredRef.current) return
        const [px, py, pz] = positions[i]
        // Rotate point by RX then ry to get screen-space Z
        const y1 = py * cosX - pz * sinX
        const z1 = py * sinX + pz * cosX
        const z2 = -px * sinY + z1 * cosY
        const depth = (z2 + R) / (2 * R) // 0..1
        const opacity = 0.18 + depth * 0.82
        el.style.opacity = opacity.toFixed(2)
        el.style.fontSize = `${10 + depth * 3.5}px`
        el.style.zIndex = String(Math.round(depth * 100))
        el.style.color = depth > 0.65 ? 'var(--text)' : 'var(--text-mute)'
        el.style.fontWeight = depth > 0.7 ? '500' : '400'
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    const wrap = inner.parentElement!

    const onEnter = () => { pauseRef.current = true }
    const onLeave = () => { pauseRef.current = false; hoveredRef.current = null }

    const onTagEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      hoveredRef.current = el
      el.style.opacity = '1'
      el.style.color = 'var(--accent)'
      el.style.fontWeight = '600'
      el.style.zIndex = '200'
    }

    const onTagLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      if (hoveredRef.current === el) hoveredRef.current = null
    }

    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    items.forEach((el) => {
      el.addEventListener('mouseenter', onTagEnter)
      el.addEventListener('mouseleave', onTagLeave)
    })

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
      items.forEach((el) => {
        el.removeEventListener('mouseenter', onTagEnter)
        el.removeEventListener('mouseleave', onTagLeave)
      })
    }
  }, [skills])

  return (
    <div className="km-skill-sphere-wrap">
      <div ref={innerRef} className="km-sphere-inner">
        {skills.map((s, i) => (
          <span key={i} data-sphere-item="" className="km-sphere-tag">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
