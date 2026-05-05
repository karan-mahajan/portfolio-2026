import type { Metadata } from 'next'
import { DM_Mono, JetBrains_Mono, Outfit, Syne } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { ClientShell } from '@/components/ClientShell'
import { GlobalInteractions } from '@/components/GlobalInteractions'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import Footer from '@/components/Footer'
import { getServerSideURL } from '@/utilities/getURL'
import './styles.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne-var',
  weight: ['400', '700', '800'],
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono-var',
  weight: ['300'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable} ${syne.variable} ${dmMono.variable}`}
    >
      <head>
        <InitTheme />
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MC74PWVQ');`}
        </Script>
      </head>
      <body>
        <a href="#main-content" className="km-skip-link">
          Skip to main content
        </a>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MC74PWVQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          {/* Custom cursor */}
          <div className="cursor-dot" aria-hidden="true" />
          <div className="cursor-ring" aria-hidden="true" />

          {/* Page loader */}
          <div className="km-loader" id="km-loader" aria-hidden="true">
            <div className="km-loader-name" id="km-loader-name">
              KARAN.MAHAJAN
            </div>
          </div>

          <GlobalInteractions />
          <ClientShell />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Karan Mahajan — Full Stack Developer',
    template: '%s | Karan Mahajan',
  },
  description:
    'Full stack developer with 5+ years building fast, scalable web apps. Next.js · React · TypeScript · WordPress. Based in Ontario, Canada.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
