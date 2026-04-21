import type { Metadata } from 'next'
import { JetBrains_Mono, Outfit } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { GlobalInteractions } from '@/components/GlobalInteractions'
import { Header } from '@/Header/Component'
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <InitTheme />
      </head>
      <body>
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
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
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
    creator: '@payloadcms',
  },
}
