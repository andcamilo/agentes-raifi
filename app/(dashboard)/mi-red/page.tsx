import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectionActions } from '@/components/colegaje/connection-actions'
import { formatWhatsAppUrl, formatRelativeDate } from '@/lib/formatters'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_CONNECTIONS } from '@/lib/mock-data'

const CURRENT_UID = 'agent-1'

export default function MyNetworkPage() {
  const sent = MOCK_CONNECTIONS.filter((c) => c.requesterId === CURRENT_UID)
  const received = MOCK_CONNECTIONS.filter((c) => c.receiverId === CURRENT_UID)

  const accepted = [...sent, ...received].filter((c) => c.status === 'accepted')
  const pendingReceived = received.filter((c) => c.status === 'pending')
  const pendingSent = sent.filter((c) => c.status === 'pending')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi Red</h1>

      {pendingReceived.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Solicitudes Recibidas ({pendingReceived.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReceived.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{conn.requesterName}</p>
                  {conn.message && <p className="text-sm text-muted-foreground">{conn.message}</p>}
                  <p className="text-xs text-muted-foreground">{formatRelativeDate(conn.createdAt)}</p>
                </div>
                <ConnectionActions connectionId={conn.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conexiones Activas ({accepted.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {accepted.length === 0 ? (
            <p className="text-muted-foreground">Aun no tienes conexiones</p>
          ) : (
            <div className="space-y-3">
              {accepted.map((conn) => {
                const partnerName = conn.requesterId === CURRENT_UID ? conn.receiverName : conn.requesterName
                return (
                  <div key={conn.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{partnerName}</p>
                      <p className="text-xs text-muted-foreground">Conectados {formatRelativeDate(conn.createdAt)}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={formatWhatsAppUrl('', `Hola ${partnerName}, te contacto desde RAIFI.`)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {pendingSent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Solicitudes Enviadas ({pendingSent.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingSent.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{conn.receiverName}</p>
                  <p className="text-xs text-muted-foreground">Pendiente - {formatRelativeDate(conn.createdAt)}</p>
                </div>
                <span className="text-sm text-muted-foreground">Pendiente</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
