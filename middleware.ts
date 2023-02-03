import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const loginPath = '/admin/login';
const inventoryPath = '/admin/inventario';

export async function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('isauth')?.value;
  
  if (request.nextUrl.pathname === loginPath) {
    if (isAuth)
      return NextResponse.redirect(new URL(inventoryPath, request.url));
  }
  if (request.nextUrl.pathname === inventoryPath) {
    if (!isAuth)
      return NextResponse.redirect(new URL(loginPath, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/login', '/admin/inventario'],
};
