import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jirel_admin_session')?.value;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname === '/admin' || pathname === '/login';

  // 1. Protection du tableau de bord
  if (isDashboard) {
    if (!token) {
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { valid } = await verifySessionToken(token);
    if (!valid) {
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('jirel_admin_session');
      return res;
    }

    return NextResponse.next();
  }

  // 2. Si déjà authentifié et sur la page de connexion, renvoyer sur le dashboard
  if (isAdmin && token) {
    const { valid } = await verifySessionToken(token);
    if (valid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin', '/login'],
};
