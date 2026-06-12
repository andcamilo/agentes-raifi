import { NextResponse } from 'next/server'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export async function GET() {
  const properties = MOCK_PROPERTIES.filter(
    (p) => p.status === 'active' && p.isColegaje
  )

  return NextResponse.json({ properties })
}
