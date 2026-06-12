'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { signOut } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Handshake,
  Users,
  UserCircle,
  MessageSquare,
  LogOut,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mis-inmuebles', label: 'Mis Inmuebles', icon: Building2 },
  { href: '/colegaje', label: 'Colegaje', icon: Handshake },
  { href: '/mi-red', label: 'Mi Red', icon: Users },
  { href: '/leads', label: 'Leads', icon: MessageSquare },
  { href: '/perfil', label: 'Mi Perfil', icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/">
          <Image src="/images/logo-icon.png" alt="RAIFI" width={32} height={32} className="h-8 w-auto" />
        </Link>
      </div>

      {/* User */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {user?.displayName ? getInitials(user.displayName) : '?'}
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.displayName || 'Agente'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Quick action */}
      <div className="px-4 py-3">
        <Button asChild className="w-full" size="sm">
          <Link href="/mis-inmuebles/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Publicar Inmueble
          </Link>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesion
        </button>
      </div>
    </aside>
  )
}
