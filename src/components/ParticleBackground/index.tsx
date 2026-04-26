'use client'

import type { BufferAttribute, PointsMaterial } from 'three'
import { useEffect, useRef } from 'react'

export function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 960) return

    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let isDestroyed = false

    const init = async () => {
      const THREE = await import('three')
      if (isDestroyed || !mount) return

      // ── Scene ──────────────────────────────────────────────────────────
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      // ── Theme color ────────────────────────────────────────────────────
      const getColor = () => {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark'
        // dark = cold blue; light = warm amber-brown
        return dark ? 0x8cb4ff : 0xc88040
      }

      // ── Particle layer factory ─────────────────────────────────────────
      const createLayer = (count: number, spread: number, zBase: number) => {
        const positions = new Float32Array(count * 3)
        const origZ = new Float32Array(count)

        for (let i = 0; i < count; i++) {
          positions[i * 3 + 0] = (Math.random() - 0.5) * spread
          positions[i * 3 + 1] = (Math.random() - 0.5) * spread
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4 + zBase
          origZ[i] = positions[i * 3 + 2]
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        const mat = new THREE.PointsMaterial({
          size: 0.025,
          color: getColor(),
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
        })

        const pts = new THREE.Points(geo, mat)
        ;(pts as any)._origZ = origZ
        ;(pts as any)._count = count
        return pts
      }

      // ── Three layers: 2200 (z:0), 900 (z:-3), 400 (z:2) ──────────────
      const layer1 = createLayer(2200, 18, 0)
      const layer2 = createLayer(900, 12, -3)
      const layer3 = createLayer(400, 8, 2)
      scene.add(layer1, layer2, layer3)
      const layers = [layer1, layer2, layer3]

      // ── Scroll ────────────────────────────────────────────────────────
      let scrollProgress = 0
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        scrollProgress = max > 0 ? window.scrollY / max : 0
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      // ── Resize ────────────────────────────────────────────────────────
      const onResize = () => {
        if (window.innerWidth < 960) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      // ── Theme observer — sync renderer clear + particle colors ────────
      const themeObs = new MutationObserver(() => {
        const col = getColor()
        layers.forEach((l) => {
          ;(l.material as PointsMaterial).color.setHex(col)
        })
      })
      themeObs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })

      // ── Animation loop ────────────────────────────────────────────────
      let time = 0
      const tick = () => {
        if (isDestroyed) return
        animId = requestAnimationFrame(tick)
        time += 0.005

        // Camera drift on scroll (sin wave x, z reduces with progress)
        camera.position.x = Math.sin(time * 0.3) * 0.5
        camera.position.z = 5 - scrollProgress * 1.5

        // Layer rotation driven by scroll progress
        layer1.rotation.y = scrollProgress * Math.PI * 0.5
        layer2.rotation.y = -scrollProgress * Math.PI * 0.3
        layer3.rotation.y = scrollProgress * Math.PI * 0.4

        // Idle breathing — layer1 z-oscillation (per particle, Math.sin)
        const posAttr1 = layer1.geometry.attributes.position as BufferAttribute
        const oz1 = (layer1 as any)._origZ as Float32Array
        const cnt1 = (layer1 as any)._count as number
        for (let i = 0; i < cnt1; i++) {
          posAttr1.setZ(i, oz1[i] + Math.sin(time + i * 0.01) * 0.08)
        }
        posAttr1.needsUpdate = true

        renderer.render(scene, camera)
      }
      tick()

      // ── Store cleanup ──────────────────────────────────────────────────
      ;(mount as any).__cleanup = () => {
        isDestroyed = true
        cancelAnimationFrame(animId)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        themeObs.disconnect()
        layers.forEach((l) => {
          l.geometry.dispose()
          ;(l.material as PointsMaterial).dispose()
        })
        renderer.dispose()
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
      }
    }

    init()

    return () => {
      isDestroyed = true
      const cleanup = (mount as any).__cleanup
      if (cleanup) cleanup()
    }
  }, [])

  return <div ref={mountRef} className="km-particle-bg" aria-hidden="true" />
}
