'use server'

export async function createAgent(_fullName: string, _email: string) {
  return { success: true as const }
}

export async function completeOnboarding(_formData: FormData) {
  return { success: true as const, error: undefined as string | undefined }
}

export async function getAgentOnboardingStatus() {
  return { isOnboarded: true }
}
