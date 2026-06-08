'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { respondToConnection } from '@/app/actions/connections'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Check, X } from 'lucide-react'

interface ConnectionActionsProps {
  connectionId: string
}

export function ConnectionActions({ connectionId }: ConnectionActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRespond = async (accept: boolean) => {
    setLoading(true)
    const result = await respondToConnection(connectionId, accept)
    if (result.success) {
      toast({ title: accept ? 'Conexion aceptada' : 'Solicitud rechazada' })
      router.refresh()
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => handleRespond(true)} disabled={loading}>
        <Check className="mr-1 h-4 w-4" /> Aceptar
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleRespond(false)} disabled={loading}>
        <X className="mr-1 h-4 w-4" /> Rechazar
      </Button>
    </div>
  )
}
