import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { SPECIALTIES } from '@/lib/constants'
import { formatWhatsAppUrl } from '@/lib/formatters'
import { getInitials } from '@/lib/utils'
import { getMockAgent, getMockPropertiesByAgent } from '@/lib/mock-data'
import { CheckCircle, MapPin, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const agent = getMockAgent(slug)
  if (!agent) return { title: 'Agente no encontrado' }
  return {
    title: `${agent.fullName} - Agente Inmobiliario`,
    description: agent.bio || `Perfil profesional de ${agent.fullName} en RAIFI.`,
  }
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params
  const agent = getMockAgent(slug)
  if (!agent) notFound()

  const properties = getMockPropertiesByAgent(agent.uid)

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          {getInitials(agent.fullName)}
        </div>
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
            {agent.specialties.map((spec) => (
              <Badge key={spec} variant="secondary">
                {SPECIALTIES.find((s) => s.value === spec)?.label || spec}
              </Badge>
            ))}
          </div>
          {agent.bio && <p className="mt-4 text-muted-foreground">{agent.bio}</p>}

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
              <p className="text-2xl font-bold">{agent.dealsClosed}</p>
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

      <div className="mt-12">
        <h2 className="text-2xl font-bold">Portafolio</h2>
        {properties.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Este agente aun no tiene inmuebles publicados.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
