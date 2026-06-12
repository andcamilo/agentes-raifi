import { NextResponse } from 'next/server'
import { MOCK_AGENTS } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const specialty = searchParams.get('specialty')
  const uid = searchParams.get('uid')

  let agents = MOCK_AGENTS.filter((a) => a.isActive && a.isOnboarded)

  if (uid) agents = agents.filter((a) => a.uid === uid)
  if (city) agents = agents.filter((a) => a.city === city)
  if (specialty) agents = agents.filter((a) => a.specialties.includes(specialty as never))

  return NextResponse.json({ agents })
}
