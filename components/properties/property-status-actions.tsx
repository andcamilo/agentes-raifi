'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePropertyStatus, deleteProperty } from '@/app/actions/properties'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { MoreVertical, Play, Pause, CheckCircle, Trash2 } from 'lucide-react'
import type { PropertyStatus } from '@/types'

interface PropertyStatusActionsProps {
  propertyId: string
  currentStatus: PropertyStatus
}

export function PropertyStatusActions({ propertyId, currentStatus }: PropertyStatusActionsProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (status: PropertyStatus) => {
    setLoading(true)
    const result = await updatePropertyStatus(propertyId, status)
    if (result.success) {
      toast({ title: 'Estado actualizado' })
      router.refresh()
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setLoading(false)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!confirm('Estas seguro de eliminar este inmueble? Esta accion no se puede deshacer.')) return
    setLoading(true)
    const result = await deleteProperty(propertyId)
    if (result.success) {
      toast({ title: 'Inmueble eliminado' })
      router.refresh()
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setLoading(false)
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        disabled={loading}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border bg-background py-1 shadow-lg">
            {currentStatus === 'draft' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <Play className="h-4 w-4" /> Activar
              </button>
            )}
            {currentStatus === 'active' && (
              <>
                <button
                  onClick={() => handleStatusChange('paused')}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <Pause className="h-4 w-4" /> Pausar
                </button>
                <button
                  onClick={() => handleStatusChange('sold')}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <CheckCircle className="h-4 w-4" /> Marcar Vendido
                </button>
                <button
                  onClick={() => handleStatusChange('rented')}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <CheckCircle className="h-4 w-4" /> Marcar Arrendado
                </button>
              </>
            )}
            {currentStatus === 'paused' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <Play className="h-4 w-4" /> Reactivar
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
            >
              <Trash2 className="h-4 w-4" /> Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
