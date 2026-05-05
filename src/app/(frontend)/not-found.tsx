import Link from 'next/link'

export const metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <section className="km-section km-404">
      <p className="km-404__label">404 · Not Found</p>
      <h1 className="km-404__heading">404</h1>
      <p className="km-404__body">This page doesn&apos;t exist or was moved.</p>
      <Link href="/" className="km-404__back">
        ← Back home
      </Link>
    </section>
  )
}
