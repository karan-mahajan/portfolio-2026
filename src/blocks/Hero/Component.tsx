'use client'

import type { HeroBlock as HeroBlockProps, Media } from '@/payload-types'
import { Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { BsGithub, BsLinkedin } from 'react-icons/bs'
import { FaFacebook, FaSteam } from 'react-icons/fa'
import { MdDownload } from 'react-icons/md'
import { RiContactsFill } from 'react-icons/ri'
import Typewriter from 'typewriter-effect'

// ─── Spotlight Button ────────────────────────────────────────────────────────

type SpotlightButtonProps = {
  title: string
  href: string
  type: 'contact' | 'resume'
  border: ReturnType<typeof useMotionTemplate>
  boxShadow: ReturnType<typeof useMotionTemplate>
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  title,
  href,
  type,
  border,
  boxShadow,
}) => {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    const span = spanRef.current
    if (!btn || !span) return

    const handleMouseMove = (e: MouseEvent) => {
      const { width } = btn.getBoundingClientRect()
      const left = `${(e.offsetX / width) * 100}%`
      span.animate({ left }, { duration: 250, fill: 'forwards' })
    }

    const handleMouseLeave = () => {
      span.animate({ left: '50%' }, { duration: 100, fill: 'forwards' })
    }

    btn.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.a
      whileTap={{ scale: 0.985 }}
      ref={btnRef}
      href={href}
      target={type === 'resume' ? '_blank' : undefined}
      rel={type === 'resume' ? 'noopener noreferrer' : undefined}
      style={{ border, boxShadow }}
      className="font-sans relative inline-flex items-center gap-2 overflow-hidden bg-slate-950 px-8 py-2 rounded-full text-base font-medium text-white"
    >
      <span className="pointer-events-none relative z-10 mix-blend-difference flex items-center gap-2">
        {title}
        {type === 'resume' ? <MdDownload /> : <RiContactsFill />}
      </span>
      <span
        ref={spanRef}
        className="hidden sm:block pointer-events-none absolute left-[50%] top-[50%] h-28 w-28 -translate-x-[50%] -translate-y-[50%] rounded-full bg-slate-100"
      />
    </motion.a>
  )
}

// ─── Hero Block ──────────────────────────────────────────────────────────────

const FALLBACK_COLORS = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C', '#CCE6F4', '#95C623']

export const HeroBlockComponent: React.FC<HeroBlockProps> = ({
  name,
  nameColor,
  typewriterStrings,
  accentColor,
  socialLinks,
  resume,
  contactHref,
  gradientColors,
}) => {
  const colors =
    gradientColors && gradientColors.length > 0
      ? gradientColors.map((g) => g.color).filter((c): c is string => !!c)
      : FALLBACK_COLORS

  const color = useMotionValue(colors[0])
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`
  const border = useMotionTemplate`1px solid ${color}`
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`

  useEffect(() => {
    animate(color, colors, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [particlesReady, setParticlesReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setParticlesReady(true))
  }, [])

  const strings = (typewriterStrings ?? []).map((s) => s.text).filter((t): t is string => !!t)

  const resumeMedia = resume && typeof resume === 'object' ? (resume as Media) : null
  const resumeUrl = resumeMedia?.url ?? null
  const accent = accentColor ?? '#ec4899'

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative bg-gray-950 text-gray-200 overflow-hidden"
    >
      {/* Stars */}
      {particlesReady && (
        <Particles
          className="absolute inset-0 z-0"
          options={{
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
              color: { value: '#ffffff' },
              number: { value: 250, density: { enable: true } },
              opacity: { value: { min: 0.1, max: 0.5 } },
              size: { value: { min: 0.5, max: 1.5 } },
              move: {
                enable: true,
                speed: 0.3,
                direction: 'none',
                random: true,
                straight: false,
              },
              links: { enable: false },
            },
            detectRetina: true,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full md:px-6 py-4">
        <div className="container px-3 md:px-5">
          <div className="flex flex-col items-start justify-center md:p-2 pb-6 md:pb-10 lg:pt-10">
            {/* Heading */}
            <h1 className="font-display text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-14">
              Hello, <br />
              I&apos;m <span style={{ color: nameColor ?? '#16f2b3' }}>{name}</span>
              {`, I'm a`}
              <span style={{ color: accent }}>
                <Typewriter
                  options={{
                    strings: strings.length > 0 ? strings : ['Developer'],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                  }}
                />
              </span>
            </h1>

            {/* Social Icons */}
            <div className="my-4 md:mb-8 md:mt-8 flex items-center gap-5">
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accent }}
                  className="transition-transform hover:scale-125 duration-300"
                >
                  <BsGithub size={30} />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accent }}
                  className="transition-transform hover:scale-125 duration-300"
                >
                  <BsLinkedin size={30} />
                </a>
              )}
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accent }}
                  className="transition-transform hover:scale-125 duration-300"
                >
                  <FaFacebook size={30} />
                </a>
              )}
              {socialLinks?.steam && (
                <a
                  href={socialLinks.steam}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accent }}
                  className="transition-transform hover:scale-125 duration-300"
                >
                  <FaSteam size={30} />
                </a>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <SpotlightButton
                border={border}
                boxShadow={boxShadow}
                title="Contact Me"
                href={contactHref ?? '#contact'}
                type="contact"
              />
              {resumeUrl && (
                <SpotlightButton
                  border={border}
                  boxShadow={boxShadow}
                  title="Resume"
                  href={resumeUrl}
                  type="resume"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  )
}
