import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type UserRole =
  | 'super_admin'
  | 'SUPER_ADMIN'
  | 'admin'
  | 'ORGANIZATION_ADMIN'
  | 'dispatcher'
  | 'DISPATCHER'
  | 'field_agent'
  | 'FIELD_AGENT'
  | 'client_admin'
  | 'CLIENT_B2B';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, api routes, and _next files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // PUBLIC ROUTES: Landing page ('/') and Login page ('/login') are ALWAYS publicly accessible
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Retrieve user role from cookie or header (if explicit role set)
  const roleCookie = request.cookies.get('user_role')?.value as UserRole | undefined;
  const userRole = roleCookie || (request.headers.get('x-user-role') as UserRole);

  // If no role cookie set, allow browsing public or demo pages
  if (!userRole) {
    return NextResponse.next();
  }

  // Route protection boundaries when explicit role cookie IS present
  const isMasterAdminRoute = pathname.startsWith('/master-admin');
  const isClientPortalRoute = pathname.startsWith('/client-portal');
  const isDispatcherDashboardRoute =
    pathname.startsWith('/overview') ||
    pathname.startsWith('/dispatch') ||
    pathname.startsWith('/pod') ||
    pathname.startsWith('/finance') ||
    pathname.startsWith('/agents') ||
    pathname.startsWith('/cod') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/settings');

  // 1. Client B2B Access Boundaries
  if (userRole === 'client_admin' || userRole === 'CLIENT_B2B') {
    if (isMasterAdminRoute || isDispatcherDashboardRoute) {
      return NextResponse.redirect(new URL('/client-portal/overview', request.url));
    }
  }

  // 2. Dispatcher / Org Admin Access Boundaries
  if (
    userRole === 'dispatcher' ||
    userRole === 'DISPATCHER' ||
    userRole === 'admin' ||
    userRole === 'ORGANIZATION_ADMIN'
  ) {
    if (isMasterAdminRoute) {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  }

  // 3. Super Admin has unrestricted access to all portals
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
