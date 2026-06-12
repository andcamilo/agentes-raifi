import { AgentCard } from '@/components/agents/agent-card'
import { MOCK_AGENTS } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Directorio de Agentes',
  description: 'Encuentra agentes inmobiliarios profesionales verificados en Colombia.',
}

export default function AgentsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Directorio de Agentes</h1>
      <p className="mt-2 text-muted-foreground">
        Agentes inmobiliarios profesionales en Colombia
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_AGENTS.map((agent) => (
          <AgentCard key={agent.uid} agent={agent} />
        ))}
      </div>
    </div>
  )
}
