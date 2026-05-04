import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({ slug: 'portfolio-likes' })
  return NextResponse.json({ count: data.count ?? 0 })
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const payload = await getPayload({ config })
  const current = await payload.findGlobal({ slug: 'portfolio-likes' })
  const currentCount = current.count ?? 0

  // Simple in-request IP check is not sufficient on serverless; localStorage
  // on the client is the primary guard. We just increment and rely on that.
  const next = currentCount + 1

  await payload.updateGlobal({
    slug: 'portfolio-likes',
    data: { count: next },
    // bypass access so the public POST can write
    overrideAccess: true,
  })

  // Log so you can monitor in server logs
  payload.logger.info({ ip, count: next }, 'portfolio like received')

  return NextResponse.json({ ok: true })
}
