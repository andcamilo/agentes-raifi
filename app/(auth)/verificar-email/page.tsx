'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sent, setSent] = useState(false)

  const resendEmail = async () => {
    // Stubbed - no-op in mock mode
    setSent(true)
  }

  const checkVerification = async () => {
    // In mock mode, just redirect to onboarding
    router.push('/onboarding')
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="mt-4">Verifica tu email</CardTitle>
        <CardDescription>
          Enviamos un enlace de verificacion a <strong>{user?.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkVerification} className="w-full">
          Ya verifique mi email
        </Button>
        <Button variant="outline" onClick={resendEmail} className="w-full" disabled={sent}>
          {sent ? 'Email reenviado' : 'Reenviar email'}
        </Button>
      </CardContent>
    </Card>
  )
}
