import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const operation = searchParams.get('operation')
  const type = searchParams.get('type')
  const city = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const bedrooms = searchParams.get('bedrooms')
  const pageSize = parseInt(searchParams.get('pageSize') || '12')
  const cursor = searchParams.get('cursor')

  let query = adminDb
    .collection('properties')
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')

  if (operation) query = query.where('operation', '==', operation)
  if (type) query = query.where('type', '==', type)
  if (city) query = query.where('city', '==', city)
  if (bedrooms) query = query.where('bedrooms', '==', parseInt(bedrooms))

  if (cursor) {
    const cursorDoc = await adminDb.collection('properties').doc(cursor).get()
    if (cursorDoc.exists) query = query.startAfter(cursorDoc)
  }

  query = query.limit(pageSize + 1)

  const snapshot = await query.get()
  const docs = snapshot.docs.slice(0, pageSize)
  const hasMore = snapshot.docs.length > pageSize
  const nextCursor = hasMore ? docs[docs.length - 1].id : null

  let properties: Record<string, unknown>[] = docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    }
  })

  // Client-side price filter (Firestore can't combine range with inequality on different fields)
  if (minPrice) properties = properties.filter((p) => (p.price as number) >= parseInt(minPrice))
  if (maxPrice) properties = properties.filter((p) => (p.price as number) <= parseInt(maxPrice))

  return NextResponse.json({ properties, nextCursor, hasMore })
}
