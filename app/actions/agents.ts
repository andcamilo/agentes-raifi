'use server'

import { adminDb, getAuthUserOrThrow } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { onboardingSchema } from '@/lib/validators'

export async function updateProfile(formData: FormData) {
  const user = await getAuthUserOrThrow()

  const raw = {
    phone: formData.get('phone'),
    whatsappNumber: formData.get('whatsappNumber'),
    city: formData.get('city'),
    department: formData.get('department'),
    bio: formData.get('bio'),
    specialties: formData.getAll('specialties'),
    yearsExperience: formData.get('yearsExperience'),
  }

  const parsed = onboardingSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Datos invalidos' }
  }

  const avatarUrl = formData.get('avatarUrl') as string | null

  const updateData: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (avatarUrl) updateData.avatarUrl = avatarUrl

  await adminDb.collection('agents').doc(user.uid).update(updateData)
  return { success: true }
}
