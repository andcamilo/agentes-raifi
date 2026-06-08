import { adminDb } from '@/lib/firebase/admin'
import { PropertyCard } from '@/components/properties/property-card'
import { PropertyFilters } from '@/components/properties/property-filters'
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
  let query = adminDb
    .collection('properties')
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')

  if (params.operation) query = query.where('operation', '==', params.operation)
  if (params.type) query = query.where('type', '==', params.type)
  if (params.city) query = query.where('city', '==', params.city)
  if (params.bedrooms) query = query.where('bedrooms', '==', parseInt(params.bedrooms))

  const snapshot = await query.limit(24).get()

  const properties = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    }
  })

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
          {properties.map((property: Record<string, unknown>) => (
            <PropertyCard key={property.id as string} property={property as never} />
          ))}
        </div>
      )}
    </div>
  )
}
