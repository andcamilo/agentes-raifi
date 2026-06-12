// Stubbed auth module - replace with real Firebase Auth when ready

export async function signUp(_email: string, _password: string, _fullName: string) {
  // Mock: just return a fake user-like object
  return { uid: 'agent-1', email: _email, displayName: _fullName, getIdToken: async () => 'mock-token' }
}

export async function signIn(_email: string, _password: string) {
  return { uid: 'agent-1', email: _email, displayName: 'Sofia Martinez', getIdToken: async () => 'mock-token' }
}

export async function signOut() {
  await fetch('/api/auth/session', { method: 'DELETE' })
}

export async function resetPassword(_email: string) {
  // no-op in mock mode
}

export async function setSessionCookie(_user: { getIdToken: () => Promise<string> }) {
  const idToken = await _user.getIdToken()
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
}

export function onAuthChange(callback: (user: { uid: string; email: string; displayName: string } | null) => void) {
  // Simulate a logged-in user
  setTimeout(() => {
    callback({ uid: 'agent-1', email: 'sofia@raifi.co', displayName: 'Sofia Martinez' })
  }, 100)
  return () => {} // unsubscribe
}

export async function refreshToken() {
  // no-op in mock mode
}
