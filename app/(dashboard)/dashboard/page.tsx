import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, Handshake, MessageSquare, Plus } from 'lucide-react'
import { MOCK_PROPERTIES, MOCK_LEADS, MOCK_CONNECTIONS } from '@/lib/mock-data'

export default function DashboardPage() {
  const activeProperties = MOCK_PROPERTIES.filter((p) => p.agentId === 'agent-1' && p.status === 'active').length
  const pendingConnections = MOCK_CONNECTIONS.filter((c) => c.receiverId === 'agent-1' && c.status === 'pending').length
  const unreadLeads = MOCK_LEADS.filter((l) => l.agentId === 'agent-1' && !l.isRead).length

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inmuebles Activos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conexiones Pendientes</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingConnections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads Sin Leer</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadLeads}</div>
          </CardContent>
        </Card>
      </div>

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
