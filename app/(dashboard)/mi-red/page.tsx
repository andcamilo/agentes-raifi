import { adminDb, getAuthUser } from '@/lib/firebase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectionActions } from '@/components/colegaje/connection-actions'
import { formatWhatsAppUrl, formatRelativeDate } from '@/lib/formatters'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function MyNetworkPage() {
  const user = await getAuthUser()
  if (!user) return null

  const [sentSnap, receivedSnap] = await Promise.all([
    adminDb.collection('connections').where('requesterId', '==', user.uid).orderBy('createdAt', 'desc').get(),
    adminDb.collection('connections').where('receiverId', '==', user.uid).orderBy('createdAt', 'desc').get(),
  ])

  const serialize = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = doc.data()
    return {
      id: doc.id,
      requesterId: data.requesterId as string,
      receiverId: data.receiverId as string,
      requesterName: data.requesterName as string,
      receiverName: data.receiverName as string,
      status: data.status as string,
      message: data.message as string | null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    }
  }

  const sent = sentSnap.docs.map(serialize)
  const received = receivedSnap.docs.map(serialize)

  const accepted = [...sent, ...received].filter((c) => c.status === 'accepted')
  const pendingReceived = received.filter((c) => c.status === 'pending')
  const pendingSent = sent.filter((c) => c.status === 'pending')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi Red</h1>

      {/* Pending received */}
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

      {/* Active connections */}
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
                const partnerName = conn.requesterId === user.uid ? conn.receiverName : conn.requesterName
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

      {/* Pending sent */}
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
