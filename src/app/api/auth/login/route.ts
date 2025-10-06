import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, validateEmail, validatePassword, HARDCODED_TEACHER } from '@/lib/auth';
import { createSession, storeSession } from '@/lib/session';
import type { LoginRequest, LoginResponse, ErrorResponse } from '@/types/auth';

/**
 * POST /api/auth/login
 * Authenticates teacher and creates session
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();

    // Validate request body
    if (!body.email || !body.password) {
      const errorResponse: ErrorResponse = {
        error: 'Email and password are required',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid email format',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate password format
    if (!validatePassword(body.password)) {
      const errorResponse: ErrorResponse = {
        error: 'Password must be at least 8 characters and contain a special character',
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate credentials
    if (!validateCredentials(body.email, body.password)) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid email or password',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Create session
    const session = createSession(HARDCODED_TEACHER);
    storeSession(session);

    // Prepare response
    const response: LoginResponse = {
      success: true,
      teacher: {
        email: HARDCODED_TEACHER.email,
        name: HARDCODED_TEACHER.name || 'Teacher',
      },
      expiresAt: {
        accessToken: session.accessTokenExpiresAt,
        refreshToken: session.refreshTokenExpiresAt,
      },
    };

    // Create Next.js response with cookies
    const nextResponse = NextResponse.json(response, { status: 200 });

    // Set httpOnly cookies
    const isProduction = process.env.NODE_ENV === 'production';

    nextResponse.cookies.set('session_access_token', session.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 1800, // 30 minutes
      path: '/',
    });

    nextResponse.cookies.set('session_refresh_token', session.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 2419200, // 28 days
      path: '/',
    });

    // Store expiration times in additional cookies for validation
    nextResponse.cookies.set('session_access_token_expires', session.accessTokenExpiresAt.toString(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 1800,
      path: '/',
    });

    nextResponse.cookies.set('session_refresh_token_expires', session.refreshTokenExpiresAt.toString(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 2419200,
      path: '/',
    });

    // Store teacher email for session validation
    nextResponse.cookies.set('session_teacher_email', session.teacherEmail, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 2419200,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
