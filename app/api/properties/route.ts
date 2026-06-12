import { NextResponse } from 'next/server'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const operation = searchParams.get('operation')
  const type = searchParams.get('type')
  const city = searchParams.get('city')
  const bedrooms = searchParams.get('bedrooms')

  let properties = MOCK_PROPERTIES.filter((p) => p.status === 'active')

  if (operation) properties = properties.filter((p) => p.operation === operation)
  if (type) properties = properties.filter((p) => p.type === type)
  if (city) properties = properties.filter((p) => p.city === city)
  if (bedrooms) properties = properties.filter((p) => p.bedrooms >= parseInt(bedrooms))

  return NextResponse.json({ properties, nextCursor: null, hasMore: false })
}
