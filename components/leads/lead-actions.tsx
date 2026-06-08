'use client'

import { useRouter } from 'next/navigation'
import { markLeadAsRead } from '@/app/actions/leads'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Check } from 'lucide-react'

interface LeadActionsProps {
  leadId: string
}

export function LeadActions({ leadId }: LeadActionsProps) {
  const router = useRouter()

  const handleMarkRead = async () => {
    const result = await markLeadAsRead(leadId)
    if (result.success) {
      router.refresh()
    } else {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleMarkRead}>
      <Check className="mr-1 h-4 w-4" /> Leido
    </Button>
  )
}
