import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { SPECIALTIES } from '@/lib/constants'
import { CheckCircle, MapPin } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { AgentSerialized } from '@/types'

interface AgentCardProps {
  agent: AgentSerialized
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agentes/${agent.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          {agent.avatarUrl ? (
            <Image
              src={agent.avatarUrl}
              alt={agent.fullName}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
              {getInitials(agent.fullName)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">{agent.fullName}</h3>
              {agent.isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
            </div>
            {agent.city && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {agent.city}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{agent.yearsExperience} anos de experiencia</p>
          </div>
        </div>

        {agent.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {agent.specialties.map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {SPECIALTIES.find((s) => s.value === spec)?.label || spec}
              </Badge>
            ))}
          </div>
        )}

        {agent.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{agent.bio}</p>
        )}
      </div>
    </Link>
  )
}
