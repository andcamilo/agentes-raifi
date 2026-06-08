import { NextResponse } from 'next/server'
import { COLOMBIAN_CITIES } from '@/lib/constants'

export async function GET() {
  const cities = COLOMBIAN_CITIES.map((c, i) => ({
    id: String(i),
    name: c.name,
    department: c.department,
    isActive: true,
  }))
  return NextResponse.json({ cities })
}
