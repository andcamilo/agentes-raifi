import { NextResponse } from 'next/server'
import { adminDb, getAuthUser } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const type = searchParams.get('type')
  const operation = searchParams.get('operation')

  let query = adminDb
    .collection('properties')
    .where('status', '==', 'active')
    .where('isColegaje', '==', true)
    .orderBy('createdAt', 'desc')

  if (city) query = query.where('city', '==', city)
  if (type) query = query.where('type', '==', type)
  if (operation) query = query.where('operation', '==', operation)

  const snapshot = await query.limit(50).get()

  const properties = snapshot.docs
    .filter((doc) => doc.data().agentId !== user.uid)
    .map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
      }
    })

  return NextResponse.json({ properties })
}
