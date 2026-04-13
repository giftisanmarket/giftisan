import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // If maintenance mode is not on, proceed as normal
  if (!isMaintenanceMode) {
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
