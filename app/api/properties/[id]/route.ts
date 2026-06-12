import { NextResponse } from 'next/server'
import { getMockProperty } from '@/lib/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const property = getMockProperty(id)

  if (!property) {
    return NextResponse.json({ error: 'Inmueble no encontrado' }, { status: 404 })
  }

  return NextResponse.json(property)
}
