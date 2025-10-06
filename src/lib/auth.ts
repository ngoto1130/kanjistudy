import { randomBytes } from 'crypto';
import type { Teacher, TokenVerification } from '@/types/auth';

/**
 * Hardcoded teacher credentials for prototype
 */
export const HARDCODED_TEACHER: Teacher = {
  email: 'teacher1@teacher.com',
  password: 'Password!',
  name: 'Teacher One',
};

/**
 * Validates teacher credentials against hardcoded data
 * @param email - Teacher's email address
 * @param password - Teacher's password
 * @returns True if credentials match, false otherwise
 */
export function validateCredentials(email: string, password: string): boolean {
  return (
    email === HARDCODED_TEACHER.email &&
    password === HARDCODED_TEACHER.password
  );
}

/**
 * Creates access and refresh tokens for a teacher session
 * @param teacherEmail - Email of the authenticated teacher
 * @returns Object containing access token, refresh token, and expiration timestamps
 */
export function createTokens(teacherEmail: string): {
  accessToken: string;
  refreshToken: string;
  expiresAt: {
    accessToken: number;
    refreshToken: number;
  };
} {
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  // Generate secure random tokens
  const accessToken = randomBytes(32).toString('hex');
  const refreshToken = randomBytes(32).toString('hex');

  // Calculate expiration times
  const accessTokenExpiresAt = now + 1800; // 30 minutes (1800 seconds)
  const refreshTokenExpiresAt = now + 2419200; // 28 days (2419200 seconds)

  return {
    accessToken,
    refreshToken,
    expiresAt: {
      accessToken: accessTokenExpiresAt,
      refreshToken: refreshTokenExpiresAt,
    },
  };
}

/**
 * Verifies a token's validity and checks expiration
 * Note: This is a simplified implementation for prototype.
 * In production, use JWT with proper signature verification.
 *
 * @param token - Token string to verify
 * @param expiresAt - Unix timestamp when token expires
 * @returns Verification result with valid status, expiration status, and payload
 */
export function verifyToken(
  token: string,
  expiresAt: number
): TokenVerification {
  // Check if token exists and is non-empty
  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      expired: false,
    };
  }

  // Check token format (should be 64 hex characters for our randomBytes(32))
  const hexPattern = /^[a-f0-9]{64}$/;
  if (!hexPattern.test(token)) {
    return {
      valid: false,
      expired: false,
    };
  }

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  const expired = now >= expiresAt;

  return {
    valid: !expired,
    expired,
  };
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validates password requirements
 * @param password - Password string to validate
 * @returns True if password meets requirements (min 8 chars, has special char)
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  // Check for at least one special character
  const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return specialCharPattern.test(password);
}
