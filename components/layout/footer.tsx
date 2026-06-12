import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image src="/images/logo-full.png" alt="RAIFI" width={120} height={40} className="h-8 w-auto" />
            <p className="mt-2 text-sm text-muted-foreground">
              Plataforma inmobiliaria colaborativa para agentes independientes en Colombia.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Plataforma</h4>
            <nav className="mt-2 flex flex-col gap-1">
              <Link href="/inmuebles" className="text-sm text-muted-foreground hover:text-foreground">
                Inmuebles
              </Link>
              <Link href="/agentes" className="text-sm text-muted-foreground hover:text-foreground">
                Agentes
              </Link>
              <Link href="/registro" className="text-sm text-muted-foreground hover:text-foreground">
                Registrarse
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold">Contacto</h4>
            <p className="mt-2 text-sm text-muted-foreground">info@raifi.co</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RAIFI. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
