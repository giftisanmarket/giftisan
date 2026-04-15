import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // Check for developer bypass (cookie or ?dev=true)
  const isDevBypass = request.cookies.get('dev_bypass')?.value === 'active' || searchParams.get('dev') === 'true';

  // If developer bypass is active, and they used the query param, set the cookie
  if (searchParams.get('dev') === 'true') {
    const response = NextResponse.next();
    response.cookies.set('dev_bypass', 'active', { 
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  // If maintenance mode is not on, or developer bypass is active, proceed as normal
  if (!isMaintenanceMode || isDevBypass) {
    return NextResponse.next();
  }

  // Allow access to coming-soon page, admin, and static assets
  if (
    pathname === '/coming-soon' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // for favicon, icon.png, etc.
  ) {
    return NextResponse.next();
  }

  // Redirect everything else to coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
