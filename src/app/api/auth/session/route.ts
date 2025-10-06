import { NextRequest, NextResponse } from 'next/server';
import { validateSession, refreshSession, storeSession, getSession } from '@/lib/session';
import { SessionState } from '@/types/auth';
import type { SessionValidationResponse, ErrorResponse } from '@/types/auth';
import { HARDCODED_TEACHER } from '@/lib/auth';

/**
 * GET /api/auth/session
 * Validates current session and refreshes access token if needed
 */
export async function GET(request: NextRequest) {
  try {
    // Get tokens from cookies
    const accessToken = request.cookies.get('session_access_token')?.value;
    const refreshToken = request.cookies.get('session_refresh_token')?.value;
    const accessTokenExpiresStr = request.cookies.get('session_access_token_expires')?.value;
    const refreshTokenExpiresStr = request.cookies.get('session_refresh_token_expires')?.value;

    // Check if tokens exist
    if (!accessToken || !refreshToken || !accessTokenExpiresStr || !refreshTokenExpiresStr) {
      const errorResponse: ErrorResponse = {
        error: 'No active session',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Parse expiration timestamps
    const accessTokenExpiresAt = parseInt(accessTokenExpiresStr, 10);
    const refreshTokenExpiresAt = parseInt(refreshTokenExpiresStr, 10);

    // Validate session (tokens contain email in payload now)
    const sessionState = validateSession(accessToken, refreshToken);

    // Extract teacher email from access token payload
    const { verifyToken } = await import('@/lib/auth');
    const accessTokenData = verifyToken(accessToken);
    const teacherEmail = accessTokenData.payload?.email || HARDCODED_TEACHER.email;

    // Handle session state
    if (sessionState === SessionState.Active) {
      // Session is active, return current session info
      const response: SessionValidationResponse = {
        valid: true,
        teacher: {
          email: teacherEmail,
          name: HARDCODED_TEACHER.name || 'Teacher',
        },
        expiresAt: {
          accessToken: accessTokenExpiresAt,
          refreshToken: refreshTokenExpiresAt,
        },
        refreshed: false,
      };

      return NextResponse.json(response, { status: 200 });
    }

    if (sessionState === SessionState.Refreshable) {
      // Access token expired, but refresh token valid - issue new access token
      const newAccessToken = refreshSession(refreshToken);

      // Get new expiration time (30 minutes from now)
      const newAccessTokenExpiresAt = Date.now() + 30 * 60 * 1000;

      // Update session in store
      const session = getSession(accessToken);
      if (session) {
        session.accessToken = newAccessToken;
        session.accessTokenExpiresAt = newAccessTokenExpiresAt;
        storeSession(session);
      }

      // Prepare response
      const response: SessionValidationResponse = {
        valid: true,
        teacher: {
          email: teacherEmail,
          name: HARDCODED_TEACHER.name || 'Teacher',
        },
        expiresAt: {
          accessToken: newAccessTokenExpiresAt,
          refreshToken: refreshTokenExpiresAt,
        },
        refreshed: true,
      };

      const nextResponse = NextResponse.json(response, { status: 200 });

      // Update access token cookie
      const isProduction = process.env.NODE_ENV === 'production';
      nextResponse.cookies.set('session_access_token', newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 1800, // 30 minutes
        path: '/',
      });

      nextResponse.cookies.set('session_access_token_expires', newAccessTokenExpiresAt.toString(), {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 1800,
        path: '/',
      });

      return nextResponse;
    }

    // Session expired or invalidated
    const errorResponse: ErrorResponse = {
      error: 'Session expired',
      statusCode: 401,
    };
    return NextResponse.json(errorResponse, { status: 401 });
  } catch (error) {
    console.error('Session validation error:', error);
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
