import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/mis-inmuebles',
  '/colegaje',
  '/mi-red',
  '/perfil',
  '/leads',
]

const authPaths = ['/login', '/registro']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('__session')?.value

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mis-inmuebles/:path*',
    '/colegaje/:path*',
    '/mi-red/:path*',
    '/perfil/:path*',
    '/leads/:path*',
    '/login',
    '/registro',
  ],
}
