import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const specialty = searchParams.get('specialty')

  let query = adminDb
    .collection('agents')
    .where('isActive', '==', true)
    .where('isOnboarded', '==', true)

  if (city) query = query.where('city', '==', city)

  const snapshot = await query.get()

  let agents: Record<string, unknown>[] = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    }
  })

  if (specialty) {
    agents = agents.filter((a) => (a.specialties as string[] | undefined)?.includes(specialty))
  }

  return NextResponse.json({ agents })
}
