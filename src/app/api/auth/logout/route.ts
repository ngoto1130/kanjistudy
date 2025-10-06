import { NextRequest, NextResponse } from 'next/server';
import { removeSession } from '@/lib/session';
import type { ErrorResponse } from '@/types/auth';

/**
 * POST /api/auth/logout
 * Terminates teacher session and clears cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('session_access_token')?.value;

    // Check if session exists
    if (!accessToken) {
      const errorResponse: ErrorResponse = {
        error: 'No active session',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Remove session from store
    removeSession(accessToken);

    // Prepare success response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Clear all session cookies by setting Max-Age to 0
    response.cookies.set('session_access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('session_refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('session_access_token_expires', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('session_refresh_token_expires', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('session_teacher_email', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
