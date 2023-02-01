import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const loginPath = '/admin/login';
const inventoryPath = '/admin/inventario';

export async function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('isauth')?.value;
 
  console.log('--- Middleware getisAuth ---');
  console.log(isAuth);
  
  if (request.nextUrl.pathname === loginPath) {
    if (isAuth)
      return NextResponse.redirect(new URL(inventoryPath, request.url));
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === inventoryPath) {
    console.log('--- Middleware inventario path ---');
    console.log(isAuth);
    if (!isAuth)
      return NextResponse.redirect(new URL(loginPath, request.url));
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/login', '/admin/inventario', '/'],
};
