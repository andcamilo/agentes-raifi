// Stubbed Firestore client helpers - replace with real Firebase when ready
// These exports are kept for build compatibility but are not functional

export function getCollection(_name: string) {
  return null
}

export function getDocRef(_collectionName: string, _docId: string) {
  return null
}

export async function getDocument<T>(_collectionName: string, _docId: string): Promise<T | null> {
  return null
}

export async function queryDocuments<T>(
  _collectionName: string,
  _constraints: unknown[],
): Promise<T[]> {
  return []
}
