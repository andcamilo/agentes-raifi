// Firebase Admin SDK - disabled until Firebase project is configured
// When ready, uncomment and set env vars

import { cookies } from 'next/headers'

// Stub exports for build compatibility
export const adminAuth = null
export const adminDb = null
export const adminStorage = null

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__session')?.value
    if (!sessionCookie) return null
    // When Firebase is configured, verify token here
    return { uid: 'agent-1', email: 'sofia@raifi.co' }
  } catch {
    return null
  }
}

export async function getAuthUserOrThrow() {
  const user = await getAuthUser()
  if (!user) throw new Error('No autenticado')
  return user
}
