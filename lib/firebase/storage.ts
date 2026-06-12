// Stubbed storage module - replace with real Firebase Storage when ready

export async function uploadFile(
  path: string,
  _file: File,
): Promise<{ url: string; storagePath: string }> {
  return { url: 'https://placehold.co/800x600?text=Uploaded', storagePath: path }
}

export async function uploadPropertyImage(
  agentId: string,
  _file: File,
  imageId: string,
): Promise<{ url: string; storagePath: string }> {
  const path = `property-images/${agentId}/${imageId}`
  return { url: 'https://placehold.co/800x600?text=Property', storagePath: path }
}

export async function uploadAvatar(
  userId: string,
  _file: File,
): Promise<{ url: string; storagePath: string }> {
  const path = `avatars/${userId}/avatar.jpg`
  return { url: 'https://placehold.co/200x200?text=Avatar', storagePath: path }
}

export async function deleteFile(_storagePath: string): Promise<void> {
  // no-op in mock mode
}
