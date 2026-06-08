import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const snapshot = await adminDb
    .collection('agents')
    .where('slug', '==', slug)
    .where('isActive', '==', true)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return NextResponse.json({ error: 'Agente no encontrado' }, { status: 404 })
  }

  const doc = snapshot.docs[0]
  const data = doc.data()

  // Get agent's active properties
  const propertiesSnap = await adminDb
    .collection('properties')
    .where('agentId', '==', doc.id)
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get()

  const properties = propertiesSnap.docs.map((pDoc) => {
    const pData = pDoc.data()
    return {
      id: pDoc.id,
      ...pData,
      createdAt: pData.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: pData.updatedAt?.toDate?.()?.toISOString() || '',
    }
  })

  return NextResponse.json({
    agent: {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    },
    properties,
  })
}
