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
    const teacherEmail = request.cookies.get('session_teacher_email')?.value;

    // Check if tokens exist
    if (!accessToken || !refreshToken || !accessTokenExpiresStr || !refreshTokenExpiresStr || !teacherEmail) {
      const errorResponse: ErrorResponse = {
        error: 'No active session',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Parse expiration timestamps
    const accessTokenExpiresAt = parseInt(accessTokenExpiresStr, 10);
    const refreshTokenExpiresAt = parseInt(refreshTokenExpiresStr, 10);

    // Validate session
    const sessionState = validateSession(
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt
    );

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
      const newTokens = refreshSession(refreshToken, teacherEmail);

      // Update session in store
      const session = getSession(accessToken);
      if (session) {
        session.accessToken = newTokens.accessToken;
        session.accessTokenExpiresAt = newTokens.accessTokenExpiresAt;
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
          accessToken: newTokens.accessTokenExpiresAt,
          refreshToken: refreshTokenExpiresAt,
        },
        refreshed: true,
      };

      const nextResponse = NextResponse.json(response, { status: 200 });

      // Update access token cookie
      const isProduction = process.env.NODE_ENV === 'production';
      nextResponse.cookies.set('session_access_token', newTokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 1800, // 30 minutes
        path: '/',
      });

      nextResponse.cookies.set('session_access_token_expires', newTokens.accessTokenExpiresAt.toString(), {
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
