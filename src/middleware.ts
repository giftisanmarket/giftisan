import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Define paths that should NOT be redirected
  const isPublicFile = pathname.match(/\.(.*)$/);
  const isNextInternal = pathname.startsWith('/_next');
  const isApi = pathname.startsWith('/api');
  const isComingSoonPage = pathname === '/coming-soon';
  const isIcon = pathname === '/icon.png' || pathname === '/favicon.ico';

  // 2. Escape Hatch: Allow viewing the site with a secret query param or cookie
  const hasPreviewQuery = searchParams.get('preview') === 'true';
  const hasPreviewCookie = request.cookies.get('giftisan_preview')?.value === 'true';

  if (hasPreviewQuery) {
    const response = NextResponse.next();
    response.cookies.set('giftisan_preview', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
    return response;
  }

  if (hasPreviewCookie) {
    return NextResponse.next();
  }

  // 3. Redirect all other requests to /coming-soon
  if (!isComingSoonPage && !isPublicFile && !isNextInternal && !isApi && !isIcon) {
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
