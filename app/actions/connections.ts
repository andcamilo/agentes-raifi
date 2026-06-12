'use server'

export async function sendConnectionRequest(_formData: FormData) {
  return { success: true, error: undefined as string | undefined }
}

export async function respondToConnection(_connectionId: string, _accept: boolean) {
  return { success: true, error: undefined as string | undefined }
}
