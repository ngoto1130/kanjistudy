import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Validates session tokens before allowing access to protected routes
 */
export function middleware(request: NextRequest) {
  // Get access token from cookies
  const accessToken = request.cookies.get('session_access_token')?.value;
  const accessTokenExpiresStr = request.cookies.get('session_access_token_expires')?.value;

  // Check if token exists
  if (!accessToken || !accessTokenExpiresStr) {
    // No token, redirect to error page
    return NextResponse.redirect(new URL('/error', request.url));
  }

  // Check token expiration
  const accessTokenExpiresAt = parseInt(accessTokenExpiresStr, 10);
  const now = Math.floor(Date.now() / 1000);

  if (now >= accessTokenExpiresAt) {
    // Access token expired, check if refresh token is available
    const refreshToken = request.cookies.get('session_refresh_token')?.value;
    const refreshTokenExpiresStr = request.cookies.get('session_refresh_token_expires')?.value;

    if (!refreshToken || !refreshTokenExpiresStr) {
      // No refresh token, redirect to error page
      return NextResponse.redirect(new URL('/error', request.url));
    }

    const refreshTokenExpiresAt = parseInt(refreshTokenExpiresStr, 10);

    if (now >= refreshTokenExpiresAt) {
      // Both tokens expired, redirect to error page
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Refresh token is valid, allow request to continue
    // The session API route will handle token refresh
    return NextResponse.next();
  }

  // Access token is valid, allow request
  return NextResponse.next();
}

/**
 * Matcher configuration
 * Applies middleware only to /teacher/* routes
 */
export const config = {
  matcher: ['/teacher/:path*'],
};
