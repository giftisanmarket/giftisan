import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // Check for developer bypass (cookie or ?dev=true)
  const isDevBypass = request.cookies.get('dev_bypass')?.value === 'active' || searchParams.get('dev') === 'true';

  // If developer bypass is active via query param, set the cookie
  if (searchParams.get('dev') === 'true') {
    const response = NextResponse.next();
    response.cookies.set('dev_bypass', 'active', { 
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return response;
  }

  // If maintenance mode is not on, or developer bypass is active, proceed as normal
  if (!isMaintenanceMode || isDevBypass) {
    return NextResponse.next();
  }

  // Define essential paths that should NOT be redirected to maintenance
  const isEssentialPath = 
    pathname === '/maintenance' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // for favicon, icon.png, etc.
    pathname.startsWith('/fonts');

  if (isEssentialPath) {
    return NextResponse.next();
  }

  // Redirect everything else to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
