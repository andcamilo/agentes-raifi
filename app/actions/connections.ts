'use server'

import { adminDb, getAuthUserOrThrow } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { connectionRequestSchema } from '@/lib/validators'

export async function sendConnectionRequest(formData: FormData) {
  const user = await getAuthUserOrThrow()

  const raw = {
    receiverId: formData.get('receiverId'),
    message: formData.get('message'),
  }

  const parsed = connectionRequestSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Datos invalidos' }
  }

  if (parsed.data.receiverId === user.uid) {
    return { success: false, error: 'No puedes conectarte contigo mismo' }
  }

  // Check if connection already exists
  const existing = await adminDb
    .collection('connections')
    .where('requesterId', 'in', [user.uid, parsed.data.receiverId])
    .get()

  const duplicate = existing.docs.find((doc) => {
    const data = doc.data()
    return (
      (data.requesterId === user.uid && data.receiverId === parsed.data.receiverId) ||
      (data.requesterId === parsed.data.receiverId && data.receiverId === user.uid)
    )
  })

  if (duplicate) {
    return { success: false, error: 'Ya existe una conexion con este agente' }
  }

  const [requesterDoc, receiverDoc] = await Promise.all([
    adminDb.collection('agents').doc(user.uid).get(),
    adminDb.collection('agents').doc(parsed.data.receiverId).get(),
  ])

  await adminDb.collection('connections').add({
    requesterId: user.uid,
    receiverId: parsed.data.receiverId,
    requesterName: requesterDoc.data()?.fullName || '',
    receiverName: receiverDoc.data()?.fullName || '',
    status: 'pending',
    message: parsed.data.message || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true }
}

export async function respondToConnection(connectionId: string, accept: boolean) {
  const user = await getAuthUserOrThrow()

  const connectionDoc = await adminDb.collection('connections').doc(connectionId).get()
  if (!connectionDoc.exists || connectionDoc.data()?.receiverId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  await adminDb.collection('connections').doc(connectionId).update({
    status: accept ? 'accepted' : 'declined',
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true }
}
