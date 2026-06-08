'use server'

import { adminDb, getAuthUserOrThrow } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { propertySchema } from '@/lib/validators'
import type { PropertyImage, PropertyStatus } from '@/types'

export async function createProperty(formData: FormData, images: PropertyImage[]) {
  const user = await getAuthUserOrThrow()

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    operation: formData.get('operation'),
    type: formData.get('type'),
    price: formData.get('price'),
    bedrooms: formData.get('bedrooms'),
    bathrooms: formData.get('bathrooms'),
    areaM2: formData.get('areaM2'),
    garageSpaces: formData.get('garageSpaces'),
    city: formData.get('city'),
    department: formData.get('department'),
    neighborhood: formData.get('neighborhood'),
    address: formData.get('address'),
    isColegaje: formData.get('isColegaje') === 'true',
    colegajeCommissionSplit: formData.get('colegajeCommissionSplit'),
  }

  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Datos invalidos', errors: parsed.error.flatten().fieldErrors }
  }

  const agentDoc = await adminDb.collection('agents').doc(user.uid).get()
  const agentData = agentDoc.data()

  const status = formData.get('status') === 'draft' ? 'draft' : 'active'

  const docRef = await adminDb.collection('properties').add({
    ...parsed.data,
    agentId: user.uid,
    agentName: agentData?.fullName || '',
    agentAvatarUrl: agentData?.avatarUrl || null,
    status,
    images,
    latitude: null,
    longitude: null,
    isFeatured: false,
    viewsCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { success: true, data: { id: docRef.id } }
}

export async function updateProperty(propertyId: string, formData: FormData, images?: PropertyImage[]) {
  const user = await getAuthUserOrThrow()

  const propertyDoc = await adminDb.collection('properties').doc(propertyId).get()
  if (!propertyDoc.exists || propertyDoc.data()?.agentId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    operation: formData.get('operation'),
    type: formData.get('type'),
    price: formData.get('price'),
    bedrooms: formData.get('bedrooms'),
    bathrooms: formData.get('bathrooms'),
    areaM2: formData.get('areaM2'),
    garageSpaces: formData.get('garageSpaces'),
    city: formData.get('city'),
    department: formData.get('department'),
    neighborhood: formData.get('neighborhood'),
    address: formData.get('address'),
    isColegaje: formData.get('isColegaje') === 'true',
    colegajeCommissionSplit: formData.get('colegajeCommissionSplit'),
  }

  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Datos invalidos' }
  }

  const updateData: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (images) updateData.images = images

  await adminDb.collection('properties').doc(propertyId).update(updateData)
  return { success: true }
}

export async function updatePropertyStatus(propertyId: string, status: PropertyStatus) {
  const user = await getAuthUserOrThrow()

  const propertyDoc = await adminDb.collection('properties').doc(propertyId).get()
  if (!propertyDoc.exists || propertyDoc.data()?.agentId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  await adminDb.collection('properties').doc(propertyId).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  })
  return { success: true }
}

export async function deleteProperty(propertyId: string) {
  const user = await getAuthUserOrThrow()

  const propertyDoc = await adminDb.collection('properties').doc(propertyId).get()
  if (!propertyDoc.exists || propertyDoc.data()?.agentId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  await adminDb.collection('properties').doc(propertyId).delete()
  return { success: true }
}

export async function toggleColegaje(propertyId: string, isColegaje: boolean) {
  const user = await getAuthUserOrThrow()

  const propertyDoc = await adminDb.collection('properties').doc(propertyId).get()
  if (!propertyDoc.exists || propertyDoc.data()?.agentId !== user.uid) {
    return { success: false, error: 'No autorizado' }
  }

  await adminDb.collection('properties').doc(propertyId).update({
    isColegaje,
    updatedAt: FieldValue.serverTimestamp(),
  })
  return { success: true }
}
