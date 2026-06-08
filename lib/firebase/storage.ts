import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

export async function uploadFile(
  path: string,
  file: File,
): Promise<{ url: string; storagePath: string }> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, storagePath: path }
}

export async function uploadPropertyImage(
  agentId: string,
  file: File,
  imageId: string,
): Promise<{ url: string; storagePath: string }> {
  const path = `property-images/${agentId}/${imageId}`
  return uploadFile(path, file)
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string; storagePath: string }> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `avatars/${userId}/avatar.${ext}`
  return uploadFile(path, file)
}

export async function deleteFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath)
  await deleteObject(storageRef)
}
