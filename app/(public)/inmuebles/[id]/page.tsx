import { adminDb } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ContactForm } from '@/components/properties/contact-form'
import { ShareButtons } from '@/components/properties/share-buttons'
import { formatCOP, formatArea } from '@/lib/formatters'
import { PROPERTY_TYPES, OPERATION_TYPES } from '@/lib/constants'
import { Bed, Bath, Maximize, Car, MapPin, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const doc = await adminDb.collection('properties').doc(id).get()
  if (!doc.exists) return { title: 'Inmueble no encontrado' }

  const data = doc.data()!
  const cover = data.images?.find((img: { isCover: boolean }) => img.isCover) || data.images?.[0]

  return {
    title: data.title,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      images: cover?.url ? [cover.url] : [],
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const doc = await adminDb.collection('properties').doc(id).get()

  if (!doc.exists) notFound()

  const data = doc.data()!
  const property = {
    id: doc.id,
    title: data.title as string,
    description: data.description as string,
    operation: data.operation as string,
    type: data.type as string,
    status: data.status as string,
    price: data.price as number,
    bedrooms: data.bedrooms as number,
    bathrooms: data.bathrooms as number,
    areaM2: data.areaM2 as number,
    garageSpaces: data.garageSpaces as number,
    city: data.city as string,
    department: data.department as string,
    neighborhood: data.neighborhood as string,
    address: data.address as string,
    images: (data.images || []) as { id: string; url: string; isCover: boolean }[],
    isColegaje: data.isColegaje as boolean,
    colegajeCommissionSplit: data.colegajeCommissionSplit as number,
    agentId: data.agentId as string,
  }
  const operationLabel = OPERATION_TYPES.find((o) => o.value === property.operation)?.label
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.type)?.label

  // Get agent info
  const agentDoc = await adminDb.collection('agents').doc(property.agentId).get()
  const agentRaw = agentDoc.exists ? agentDoc.data()! : null
  const agent = agentRaw ? {
    uid: agentDoc.id,
    fullName: agentRaw.fullName as string,
    slug: agentRaw.slug as string,
    avatarUrl: agentRaw.avatarUrl as string | null,
    city: agentRaw.city as string | null,
    isVerified: agentRaw.isVerified as boolean,
    whatsappNumber: agentRaw.whatsappNumber as string | null,
  } : null

  return (
    <div className="container py-8">
      {/* Gallery */}
      <div className="grid gap-2 md:grid-cols-2">
        {property.images?.slice(0, 4).map((img: { id: string; url: string }, index: number) => (
          <div
            key={img.id}
            className={`relative overflow-hidden rounded-lg bg-muted ${
              index === 0 ? 'md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/3]'
            }`}
          >
            <Image src={img.url} alt={property.title} fill className="object-cover" sizes="50vw" />
          </div>
        ))}
        {(!property.images || property.images.length === 0) && (
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted text-muted-foreground md:col-span-2">
            Sin fotos
          </div>
        )}
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

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold">Descripcion</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{property.description}</p>
          </div>

          {/* Share */}
          <div>
            <h3 className="mb-2 font-medium">Compartir</h3>
            <ShareButtons propertyId={id} propertyTitle={property.title} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Agent card */}
          {agent && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                {agent.avatarUrl ? (
                  <Image
                    src={agent.avatarUrl}
                    alt={agent.fullName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {agent.fullName?.charAt(0)}
                  </div>
                )}
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

          {/* Contact form */}
          <ContactForm propertyId={id} propertyTitle={property.title} agentId={property.agentId} />
        </div>
      </div>
    </div>
  )
}
