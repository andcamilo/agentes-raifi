'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo-full.png" alt="RAIFI" width={120} height={40} className="h-8 w-auto" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/inmuebles" className="text-sm text-muted-foreground hover:text-foreground">
            Inmuebles
          </Link>
          <Link href="/agentes" className="text-sm text-muted-foreground hover:text-foreground">
            Agentes
          </Link>
          {!loading && (
            <>
              {isAuthenticated ? (
                <Button asChild size="sm">
                  <Link href="/dashboard">Mi Dashboard</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Iniciar Sesion</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/inmuebles"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Inmuebles
            </Link>
            <Link
              href="/agentes"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Agentes
            </Link>
            {!loading && (
              <>
                {isAuthenticated ? (
                  <Button asChild size="sm">
                    <Link href="/dashboard">Mi Dashboard</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Iniciar Sesion</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/registro">Registrarse</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
