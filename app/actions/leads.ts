'use server'

import { adminDb, getAuthUser } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { contactFormSchema } from '@/lib/validators'

export async function submitContactForm(
  propertyId: string,
  propertyTitle: string,
  agentId: string,
  formData: FormData,
) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  }

  const parsed = contactFormSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Datos invalidos' }
  }

  await adminDb.collection('leads').add({
    propertyId,
    propertyTitle,
    agentId,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone,
    message: parsed.data.message || null,
    source: 'web',
    isRead: false,
    createdAt: FieldValue.serverTimestamp(),
  })

  return { success: true }
}

export async function markLeadAsRead(leadId: string) {
  const user = await getAuthUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const leadDoc = await adminDb.collection('leads').doc(leadId).get()
  if (!leadDoc.exists || leadDoc.data()?.agentId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  await adminDb.collection('leads').doc(leadId).update({ isRead: true })
  return { success: true }
}
