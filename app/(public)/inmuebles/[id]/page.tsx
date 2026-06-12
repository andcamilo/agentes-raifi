import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ContactForm } from '@/components/properties/contact-form'
import { ShareButtons } from '@/components/properties/share-buttons'
import { formatCOP, formatArea } from '@/lib/formatters'
import { PROPERTY_TYPES, OPERATION_TYPES } from '@/lib/constants'
import { getMockProperty, getMockAgent } from '@/lib/mock-data'
import { Bed, Bath, Maximize, Car, MapPin, CheckCircle } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = getMockProperty(id)
  if (!property) return { title: 'Inmueble no encontrado' }

  const cover = property.images.find((img) => img.isCover) || property.images[0]
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: cover?.url ? [cover.url] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const property = getMockProperty(id)
  if (!property) notFound()

  const operationLabel = OPERATION_TYPES.find((o) => o.value === property.operation)?.label
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.type)?.label
  const agent = getMockAgent(property.agentId)

  return (
    <div className="container py-8">
      {/* Gallery */}
      <div className="grid gap-2 md:grid-cols-2">
        {property.images.slice(0, 4).map((img, index) => (
          <div
            key={img.id}
            className={`relative overflow-hidden rounded-lg bg-muted ${
              index === 0 ? 'md:row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[400px]' : 'aspect-[4/3]'
            }`}
          >
            <Image src={img.url} alt={property.title} fill className="object-cover" sizes="50vw" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{operationLabel}</Badge>
              <Badge variant="outline">{typeLabel}</Badge>
              {property.isColegaje && <Badge>Colegaje</Badge>}
            </div>
            <h1 className="mt-3 text-3xl font-bold">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {property.neighborhood}, {property.city}, {property.department}
            </p>
          </div>

          <div className="text-3xl font-bold text-primary">
            {formatCOP(property.price)}
            {property.operation === 'arriendo' && (
              <span className="text-lg font-normal text-muted-foreground">/mes</span>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4">
            <div className="text-center">
              <Bed className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">{property.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Habitaciones</p>
            </div>
            <div className="text-center">
              <Bath className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">{property.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Banos</p>
            </div>
            <div className="text-center">
              <Maximize className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">{formatArea(property.areaM2)}</p>
              <p className="text-xs text-muted-foreground">Area</p>
            </div>
            <div className="text-center">
              <Car className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">{property.garageSpaces}</p>
              <p className="text-xs text-muted-foreground">Parqueaderos</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Descripcion</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{property.description}</p>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Compartir</h3>
            <ShareButtons propertyId={id} propertyTitle={property.title} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {agent && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {getInitials(agent.fullName)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{agent.fullName}</p>
                    {agent.isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.city}</p>
                </div>
              </div>
              <Link
                href={`/agentes/${agent.slug}`}
                className="mt-3 block text-sm text-primary hover:underline"
              >
                Ver perfil del agente
              </Link>
            </div>
          )}
          <ContactForm propertyId={id} propertyTitle={property.title} agentId={property.agentId} />
        </div>
      </div>
    </div>
  )
}
