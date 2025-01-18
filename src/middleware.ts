import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/services/auth'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // ----- Required for can get full URL from Layouts Server Side -----
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-current-path', request.nextUrl.pathname)
  const nextOptions = { request: { headers: requestHeaders } }
  // ------------------------------
  const { pathname } = request.nextUrl

  const needAuthRoutes = ['/admin', '/vender']
  const neddAuth = needAuthRoutes.findIndex(r => pathname.includes(r))

  if (neddAuth !== -1) {
    const { isAuthenticated } = await getAuth((await cookies()).toString())
    if (isAuthenticated) return NextResponse.next(nextOptions)
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname.startsWith('/login')) {
    const { isAuthenticated } = await getAuth((await cookies()).toString())
    if (!isAuthenticated) return NextResponse.next(nextOptions)
    return NextResponse.redirect(
      new URL('/admin/inventario/productos', request.url)
    )
  }

  return NextResponse.next(nextOptions)
  // return NextResponse.next()
}

export const config = { matcher: ['/:path*', '/not-found'] }
