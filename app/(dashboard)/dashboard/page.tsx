import { adminDb, getAuthUser } from '@/lib/firebase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, Handshake, MessageSquare, Plus } from 'lucide-react'

async function getDashboardStats(uid: string) {
  const [propertiesSnap, connectionsSnap, leadsSnap] = await Promise.all([
    adminDb.collection('properties').where('agentId', '==', uid).where('status', '==', 'active').count().get(),
    adminDb.collection('connections')
      .where('receiverId', '==', uid)
      .where('status', '==', 'pending')
      .count().get(),
    adminDb.collection('leads').where('agentId', '==', uid).where('isRead', '==', false).count().get(),
  ])

  return {
    activeProperties: propertiesSnap.data().count,
    pendingConnections: connectionsSnap.data().count,
    unreadLeads: leadsSnap.data().count,
  }
}

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) return null

  const stats = await getDashboardStats(user.uid)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/mis-inmuebles/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Publicar Inmueble
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inmuebles Activos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conexiones Pendientes</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingConnections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads Sin Leer</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rapidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/mis-inmuebles/nuevo">Publicar Inmueble</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/colegaje">Buscar Colegaje</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/perfil">Editar Perfil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/mi-red">Ver Mi Red</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
