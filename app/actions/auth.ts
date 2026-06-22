'use server'

import { adminDb, getAuthUser } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { generateSlug } from '@/lib/utils'
import { onboardingSchema } from '@/lib/validators'

export async function createAgent(fullName: string, email: string) {
  const user = await getAuthUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const slug = generateSlug(fullName)

  await adminDb.collection('agents').doc(user.uid).set({
    uid: user.uid,
    fullName,
    email,
    phone: null,
    slug,
    avatarUrl: null,
    bio: null,
    city: null,
    department: null,
    specialties: [],
    yearsExperience: 0,
    dealsClosed: 0,
    isVerified: false,
    isOnboarded: false,
    isActive: true,
    whatsappNumber: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true }
}

export async function completeOnboarding(formData: FormData) {
  const user = await getAuthUser()
  if (!user) return { success: false, error: 'No autenticado' }

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
    return { success: false, error: 'Datos invalidos', errors: parsed.error.flatten().fieldErrors }
  }

  const avatarUrl = formData.get('avatarUrl') as string | null

  await adminDb.collection('agents').doc(user.uid).update({
    ...parsed.data,
    avatarUrl: avatarUrl || null,
    isOnboarded: true,
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true }
}

export async function getAgentOnboardingStatus() {
  const user = await getAuthUser()
  if (!user) return null

  const doc = await adminDb.collection('agents').doc(user.uid).get()
  if (!doc.exists) return null

  return {
    isOnboarded: doc.data()?.isOnboarded ?? false,
  }
}
