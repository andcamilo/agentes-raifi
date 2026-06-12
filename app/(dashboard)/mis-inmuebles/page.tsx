import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCompactCOP } from '@/lib/formatters'
import { PROPERTY_STATUSES, PROPERTY_TYPES } from '@/lib/constants'
import { Plus, Edit, Eye } from 'lucide-react'
import { PropertyStatusActions } from '@/components/properties/property-status-actions'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export default function MyPropertiesPage() {
  const properties = MOCK_PROPERTIES.filter((p) => p.agentId === 'agent-1')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Inmuebles</h1>
        <Button asChild>
          <Link href="/mis-inmuebles/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Publicar Inmueble
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border p-12 text-center">
          <p className="text-lg text-muted-foreground">Aun no tienes inmuebles publicados</p>
          <Button className="mt-4" asChild>
            <Link href="/mis-inmuebles/nuevo">Publicar mi primer inmueble</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => {
            const statusConfig = PROPERTY_STATUSES.find((s) => s.value === property.status)
            const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.type)?.label
            const coverImage = property.images?.find((img) => img.isCover) || property.images?.[0]

            return (
              <div
                key={property.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {coverImage ? (
                    <img src={coverImage.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-medium">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {typeLabel} - {property.city}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formatCompactCOP(property.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusConfig?.color}>{statusConfig?.label}</Badge>
                  {property.isColegaje && <Badge variant="outline">Colegaje</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/inmuebles/${property.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/mis-inmuebles/${property.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <PropertyStatusActions propertyId={property.id} currentStatus={property.status} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
