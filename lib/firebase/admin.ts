import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { cookies } from 'next/headers'

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__session')?.value
    if (!sessionCookie) return null

    const decodedToken = await adminAuth.verifyIdToken(sessionCookie)
    return decodedToken
  } catch {
    return null
  }
}

export async function getAuthUserOrThrow() {
  const user = await getAuthUser()
  if (!user) throw new Error('No autenticado')
  return user
}
