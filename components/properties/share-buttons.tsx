'use client'

import { Button } from '@/components/ui/button'
import { formatShareUrl, formatWhatsAppUrl } from '@/lib/formatters'
import { Share2, Copy, MessageCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ShareButtonsProps {
  propertyId: string
  propertyTitle: string
}

export function ShareButtons({ propertyId, propertyTitle }: ShareButtonsProps) {
  const shareUrl = formatShareUrl(propertyId)

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast({ title: 'Enlace copiado' })
  }

  const shareWhatsApp = () => {
    const message = `Mira este inmueble: ${propertyTitle}\n${shareUrl}`
    window.open(formatWhatsAppUrl('', message).replace('https://wa.me/', 'https://wa.me/?'), '_blank')
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Copy className="mr-2 h-4 w-4" />
        Copiar Enlace
      </Button>
      <Button variant="outline" size="sm" onClick={shareWhatsApp}>
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  )
}
