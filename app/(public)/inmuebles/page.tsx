import { PropertyCard } from '@/components/properties/property-card'
import { PropertyFilters } from '@/components/properties/property-filters'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inmuebles',
  description: 'Encuentra apartamentos, casas, oficinas y mas inmuebles en Colombia.',
}

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams

  let properties = MOCK_PROPERTIES.filter((p) => p.status === 'active')

  if (params.operation) properties = properties.filter((p) => p.operation === params.operation)
  if (params.type) properties = properties.filter((p) => p.type === params.type)
  if (params.city) properties = properties.filter((p) => p.city === params.city)
  if (params.bedrooms) properties = properties.filter((p) => p.bedrooms >= parseInt(params.bedrooms!))

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Inmuebles</h1>
      <p className="mt-2 text-muted-foreground">
        Encuentra la propiedad ideal en Colombia
      </p>

      <div className="mt-6">
        <PropertyFilters />
      </div>

      {properties.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">No se encontraron inmuebles</p>
          <p className="text-sm text-muted-foreground">Intenta cambiar los filtros</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
