import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const doc = await adminDb.collection('properties').doc(id).get()

  if (!doc.exists) {
    return NextResponse.json({ error: 'Inmueble no encontrado' }, { status: 404 })
  }

  const data = doc.data()!
  return NextResponse.json({
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
  })
}
