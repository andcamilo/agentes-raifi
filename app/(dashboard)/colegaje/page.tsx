'use client'

import { useEffect, useState } from 'react'
import { PropertyCard } from '@/components/properties/property-card'
import { PropertyFilters } from '@/components/properties/property-filters'
import { Button } from '@/components/ui/button'
import { sendConnectionRequest } from '@/app/actions/connections'
import { toast } from '@/hooks/use-toast'
import type { PropertySerialized } from '@/types'

export default function ColegajePage() {
  const [properties, setProperties] = useState<PropertySerialized[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchColegaje() {
      const res = await fetch('/api/colegaje')
      if (res.ok) {
        const data = await res.json()
        setProperties(data.properties)
      }
      setLoading(false)
    }
    fetchColegaje()
  }, [])

  const handleConnect = async (agentId: string) => {
    const formData = new FormData()
    formData.set('receiverId', agentId)
    formData.set('message', 'Me interesa colaborar en colegaje.')

    const result = await sendConnectionRequest(formData)
    if (result.success) {
      toast({ title: 'Solicitud enviada' })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Colegaje</h1>
        <p className="text-muted-foreground">
          Inmuebles disponibles para colaboracion entre agentes
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No hay inmuebles disponibles para colegaje en este momento
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id}>
              <PropertyCard property={property} showColegaje />
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => handleConnect(property.agentId)}
              >
                Solicitar Conexion
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
