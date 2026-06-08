import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, Users, Handshake } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container py-20 text-center md:py-32">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          La plataforma para{' '}
          <span className="text-primary">agentes inmobiliarios</span>{' '}
          independientes
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Publica inmuebles, construye tu perfil profesional y colabora con otros agentes.
          Sin cuotas mensuales. Tu te quedas con el 90% de la comision.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/registro">Comenzar Gratis</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/inmuebles">Ver Inmuebles</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Los 3 Pilares de RAIFI</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-6 text-center">
              <Building2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Inmueble</h3>
              <p className="mt-2 text-muted-foreground">
                Publica hasta 15 fotos, comparte fichas profesionales por WhatsApp y gestiona tus propiedades.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Agente</h3>
              <p className="mt-2 text-muted-foreground">
                Construye tu perfil profesional verificado con portafolio, especialidades y estadisticas.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <Handshake className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Colegaje</h3>
              <p className="mt-2 text-muted-foreground">
                Conecta con otros agentes para compartir inmuebles y cerrar negocios juntos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <h2 className="text-3xl font-bold">Unete a la red de agentes RAIFI</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Sin cuotas mensuales. Solo pagas el 10% de comision cuando cierras un negocio.
        </p>
        <Button size="lg" className="mt-6" asChild>
          <Link href="/registro">Crear Mi Cuenta</Link>
        </Button>
      </section>
    </>
  )
}
