'use client'

import emailjs from '@emailjs/browser'
import React, { useRef, useState } from 'react'

interface ContactBlockProps {
  blockType: 'contact'
  blockName?: string | null
  id?: string | null
  email?: string | null
  linkedinUrl?: string | null
  title?: string | null
  subtitle?: string | null
}

export const ContactBlockComponent: React.FC<ContactBlockProps> = ({
  email = 'karan@karanmahajan.dev',
  linkedinUrl,
  title,
  subtitle,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setSubmitting(true)
    try {
      const form = formRef.current
      const data = new FormData(form)
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: data.get('name') as string,
          from_email: data.get('email') as string,
          message: data.get('message') as string,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! },
      )
      setSubmitted(true)
      form.reset()
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      alert('Something went wrong. Please try emailing me directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="km-section km-cinematic">
      <div className="km-container">
        <div className="max-w-195 mx-auto text-center">
          <div className="km-eyebrow km-reveal justify-center">04 / contact</div>

          <h2 className="km-contact-title km-reveal">
            {title ?? (
              <>
                Let&apos;s <span className="km-grad">work together.</span>
              </>
            )}
          </h2>

          <p className="km-contact-sub km-reveal">
            {subtitle ??
              'Got a product to build, a team to augment, or just a sharp idea worth prototyping? I read everything.'}
          </p>

          <div className="flex gap-3.5 justify-center flex-wrap mb-18 km-reveal">
            {email && (
              <a href={`mailto:${email}`} className="km-btn km-btn-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {email}
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="km-btn km-btn-ghost"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
                LinkedIn
              </a>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="km-contact-form km-reveal">
            <div className="km-field">
              <input id="c-name" type="text" placeholder=" " required name="name" />
              <label htmlFor="c-name">Your name</label>
            </div>
            <div className="km-field">
              <input id="c-email" type="email" placeholder=" " required name="email" />
              <label htmlFor="c-email">Email</label>
            </div>
            <div className="km-field full">
              <textarea id="c-msg" placeholder=" " required name="message" />
              <label htmlFor="c-msg">Message</label>
            </div>
            <button
              type="submit"
              className="km-btn km-btn-primary"
              aria-label={
                submitted ? 'Message sent' : submitting ? 'Sending message' : 'Send message'
              }
              disabled={submitting || submitted}
              style={
                submitted ? { background: 'linear-gradient(135deg, #47d78a, #4f8ef7)' } : undefined
              }
            >
              {submitted ? (
                'Message sent ✓'
              ) : submitting ? (
                'Sending…'
              ) : (
                <>
                  Send message
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
