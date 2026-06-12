'use server'

export async function submitContactForm(
  _propertyId: string,
  _propertyTitle: string,
  _agentId: string,
  _formData: FormData,
) {
  return { success: true, error: undefined as string | undefined }
}

export async function markLeadAsRead(_leadId: string) {
  return { success: true, error: undefined as string | undefined }
}
