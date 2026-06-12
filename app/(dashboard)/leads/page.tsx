import { Card, CardContent } from '@/components/ui/card'
import { LeadActions } from '@/components/leads/lead-actions'
import { formatRelativeDate } from '@/lib/formatters'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { MOCK_LEADS } from '@/lib/mock-data'

export default function LeadsPage() {
  const leads = MOCK_LEADS.filter((l) => l.agentId === 'agent-1')
  const unread = leads.filter((l) => !l.isRead).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-muted-foreground">
          {unread > 0 ? `${unread} sin leer` : 'Todos los leads leidos'}
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-lg border p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">Aun no tienes leads</p>
          <p className="text-sm text-muted-foreground">
            Cuando alguien llene un formulario de contacto en tus inmuebles, aparecera aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className={!lead.isRead ? 'border-primary/30 bg-primary/5' : ''}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{lead.name}</p>
                    {!lead.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  {lead.propertyTitle && (
                    <Link href={`/inmuebles/${lead.propertyId}`} className="text-sm text-primary hover:underline">
                      {lead.propertyTitle}
                    </Link>
                  )}
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {lead.email}
                      </span>
                    )}
                  </div>
                  {lead.message && (
                    <p className="mt-2 text-sm text-muted-foreground">{lead.message}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeDate(lead.createdAt)}</p>
                </div>
                {!lead.isRead && <LeadActions leadId={lead.id} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
