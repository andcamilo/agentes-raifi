import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'

export function getCollection(name: string) {
  return collection(db, name)
}

export function getDocRef(collectionName: string, docId: string) {
  return doc(db, collectionName, docId)
}

export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  const docRef = doc(db, collectionName, docId)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as T
}

export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<T[]> {
  const ref = collection(db, collectionName)
  const q = query(ref, ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
}

export { where, orderBy, limit, startAfter, query, collection, doc }
export type { QueryDocumentSnapshot, DocumentData }
