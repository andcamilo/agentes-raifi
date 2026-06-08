import { adminDb } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { SPECIALTIES } from '@/lib/constants'
import { formatWhatsAppUrl } from '@/lib/formatters'
import { getInitials } from '@/lib/utils'
import { CheckCircle, MapPin, MessageCircle, Building2, Award } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const snapshot = await adminDb.collection('agents').where('slug', '==', slug).limit(1).get()
  if (snapshot.empty) return { title: 'Agente no encontrado' }
  const agent = snapshot.docs[0].data()
  return {
    title: `${agent.fullName} - Agente Inmobiliario`,
    description: agent.bio || `Perfil profesional de ${agent.fullName} en RAIFI.`,
  }
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params
  const snapshot = await adminDb.collection('agents').where('slug', '==', slug).where('isActive', '==', true).limit(1).get()
  if (snapshot.empty) notFound()

  const agentDoc = snapshot.docs[0]
  const agentData = agentDoc.data()
  const agent = {
    uid: agentDoc.id,
    fullName: agentData.fullName as string,
    slug: agentData.slug as string,
    avatarUrl: agentData.avatarUrl as string | null,
    bio: agentData.bio as string | null,
    city: agentData.city as string | null,
    department: agentData.department as string | null,
    specialties: (agentData.specialties || []) as string[],
    yearsExperience: agentData.yearsExperience as number,
    dealsClosed: agentData.dealsClosed as number,
    isVerified: agentData.isVerified as boolean,
    whatsappNumber: agentData.whatsappNumber as string | null,
  }

  const propertiesSnap = await adminDb
    .collection('properties')
    .where('agentId', '==', agentDoc.id)
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get()

  const properties = propertiesSnap.docs.map((doc) => {
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
      {/* Profile header */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {agent.avatarUrl ? (
          <Image
            src={agent.avatarUrl}
            alt={agent.fullName}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {getInitials(agent.fullName)}
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <h1 className="text-3xl font-bold">{agent.fullName}</h1>
            {agent.isVerified && <CheckCircle className="h-6 w-6 text-primary" />}
          </div>
          {agent.city && (
            <p className="mt-1 flex items-center justify-center gap-1 text-muted-foreground md:justify-start">
              <MapPin className="h-4 w-4" />
              {agent.city}, {agent.department}
            </p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
            {agent.specialties?.map((spec: string) => (
              <Badge key={spec} variant="secondary">
                {SPECIALTIES.find((s) => s.value === spec)?.label || spec}
              </Badge>
            ))}
          </div>
          {agent.bio && <p className="mt-4 text-muted-foreground">{agent.bio}</p>}

          {/* Stats */}
          <div className="mt-4 flex justify-center gap-6 md:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold">{agent.yearsExperience}</p>
              <p className="text-xs text-muted-foreground">Anos Exp.</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{properties.length}</p>
              <p className="text-xs text-muted-foreground">Inmuebles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{agent.dealsClosed || 0}</p>
              <p className="text-xs text-muted-foreground">Negocios</p>
            </div>
          </div>

          {agent.whatsappNumber && (
            <Button className="mt-4" asChild>
              <a href={formatWhatsAppUrl(agent.whatsappNumber, 'Hola, te contacto desde RAIFI.')} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Properties */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Portafolio</h2>
        {properties.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Este agente aun no tiene inmuebles publicados.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property: Record<string, unknown>) => (
              <PropertyCard key={property.id as string} property={property as never} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
