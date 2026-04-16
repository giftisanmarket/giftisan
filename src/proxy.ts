import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 1. Skip proxy for essential paths (manual matcher)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const isDevBypass = request.cookies.get('dev_bypass')?.value === 'active' || searchParams.get('dev') === 'true';

  // 2. Handle Developer Bypass
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

  // 3. Normal Mode or Bypass
  if (!isMaintenanceMode || isDevBypass) {
    return NextResponse.next();
  }

  // 4. Maintenance Mode Logic
  const isAllowedInMaintenance = 
    pathname === '/maintenance' ||
    pathname.startsWith('/admin');

  if (isAllowedInMaintenance) {
    return NextResponse.next();
  }

  // 5. Redirect everything else to maintenance
  return NextResponse.redirect(new URL('/maintenance', request.url));
}

export const config = {
  // Catch everything except static assets
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
