import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatCompactCOP, formatArea } from '@/lib/formatters'
import { PROPERTY_TYPES, OPERATION_TYPES } from '@/lib/constants'
import { Bed, Bath, Maximize, Car } from 'lucide-react'
import type { PropertySerialized } from '@/types'

interface PropertyCardProps {
  property: PropertySerialized
  showColegaje?: boolean
}

export function PropertyCard({ property, showColegaje }: PropertyCardProps) {
  const coverImage = property.images.find((img) => img.isCover) || property.images[0]
  const operationLabel = OPERATION_TYPES.find((o) => o.value === property.operation)?.label
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.type)?.label

  return (
    <Link href={`/inmuebles/${property.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Sin foto
            </div>
          )}
          <div className="absolute left-2 top-2 flex gap-1">
            <Badge variant="secondary" className="bg-white/90 text-xs">
              {operationLabel}
            </Badge>
            {property.isColegaje && showColegaje && (
              <Badge className="text-xs">Colegaje {property.colegajeCommissionSplit}%</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-lg font-bold text-primary">
            {formatCompactCOP(property.price)}
            {property.operation === 'arriendo' && <span className="text-sm font-normal">/mes</span>}
          </p>
          <h3 className="mt-1 line-clamp-1 font-medium">{property.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {property.neighborhood}, {property.city}
          </p>

          {/* Specs */}
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" /> {formatArea(property.areaM2)}
            </span>
            {property.garageSpaces > 0 && (
              <span className="flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> {property.garageSpaces}
              </span>
            )}
          </div>

          {/* Type badge */}
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">{typeLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
