'use server'

import type { PropertyImage, PropertyStatus } from '@/types'

export async function createProperty(_formData: FormData, _images: PropertyImage[]) {
  return { success: true, error: undefined as string | undefined, data: { id: 'new-prop-' + Date.now() } }
}

export async function updateProperty(_propertyId: string, _formData: FormData, _images?: PropertyImage[]) {
  return { success: true, error: undefined as string | undefined }
}

export async function updatePropertyStatus(_propertyId: string, _status: PropertyStatus) {
  return { success: true, error: undefined as string | undefined }
}

export async function deleteProperty(_propertyId: string) {
  return { success: true, error: undefined as string | undefined }
}

export async function toggleColegaje(_propertyId: string, _isColegaje: boolean) {
  return { success: true, error: undefined as string | undefined }
}
