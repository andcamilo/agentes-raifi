import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from './config'

export async function signUp(email: string, password: string, fullName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: fullName })
  await sendEmailVerification(credential.user)
  return credential.user
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signOut() {
  await firebaseSignOut(auth)
  await fetch('/api/auth/session', { method: 'DELETE' })
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

export async function setSessionCookie(user: User) {
  const idToken = await user.getIdToken()
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function refreshToken() {
  const user = auth.currentUser
  if (user) {
    const idToken = await user.getIdToken(true)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
  }
}
