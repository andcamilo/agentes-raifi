import { NextResponse } from 'next/server'
import { getMockAgent, getMockPropertiesByAgent } from '@/lib/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const agent = getMockAgent(slug)

  if (!agent) {
    return NextResponse.json({ error: 'Agente no encontrado' }, { status: 404 })
  }

  const properties = getMockPropertiesByAgent(agent.uid)

  return NextResponse.json({ agent, properties })
}
