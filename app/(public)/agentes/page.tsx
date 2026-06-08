import { adminDb } from '@/lib/firebase/admin'
import { AgentCard } from '@/components/agents/agent-card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Directorio de Agentes',
  description: 'Encuentra agentes inmobiliarios profesionales verificados en Colombia.',
}

export default async function AgentsPage() {
  const snapshot = await adminDb
    .collection('agents')
    .where('isActive', '==', true)
    .where('isOnboarded', '==', true)
    .get()

  const agents = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
    }
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Directorio de Agentes</h1>
      <p className="mt-2 text-muted-foreground">
        Agentes inmobiliarios profesionales en Colombia
      </p>

      {agents.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">Aun no hay agentes registrados</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent: Record<string, unknown>) => (
            <AgentCard key={agent.uid as string} agent={agent as never} />
          ))}
        </div>
      )}
    </div>
  )
}
