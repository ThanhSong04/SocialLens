import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/',  // Homepage/feed
    '/explore',
    '/post',  // View post detail
    '/profile',  // View profile
    '/story',  // View story
    '/api/posts',  // Get posts API
    '/api/users',  // Get user info API
  ]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Protected routes that require authentication
  const protectedRoutes = ['/create']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login page with valid session, redirect to home
  if (pathname === '/login' && session) {
    try {
      const sessionData = JSON.parse(session.value)
      if (sessionData.expiresAt > Date.now()) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      // Invalid session, allow access to login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
