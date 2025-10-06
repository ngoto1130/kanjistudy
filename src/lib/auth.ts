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
 * Token metadata store (in-memory for prototype)
 * Maps token string to its metadata (email, expiration, type)
 */
interface TokenMetadata {
  email: string;
  expiresAt: number;
  type: 'access' | 'refresh';
}

const tokenStore: Map<string, TokenMetadata> = new Map();

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
  const now = Date.now(); // Unix timestamp in milliseconds

  // Calculate expiration times
  const accessTokenExpiresAt = now + 30 * 60 * 1000; // 30 minutes in milliseconds
  const refreshTokenExpiresAt = now + 28 * 24 * 60 * 60 * 1000; // 28 days in milliseconds

  // Generate secure random tokens (pure hex for security)
  const accessToken = randomBytes(32).toString('hex');
  const refreshToken = randomBytes(32).toString('hex');

  // Store token metadata
  tokenStore.set(accessToken, {
    email: teacherEmail,
    expiresAt: accessTokenExpiresAt,
    type: 'access',
  });

  tokenStore.set(refreshToken, {
    email: teacherEmail,
    expiresAt: refreshTokenExpiresAt,
    type: 'refresh',
  });

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
 * @returns Verification result with valid status, expiration status, and payload
 */
export function verifyToken(token: string): TokenVerification {
  // Check if token exists and is non-empty
  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      expired: false,
    };
  }

  // Check token format (should be 64 hex characters)
  const hexPattern = /^[a-f0-9]{64}$/;
  if (!hexPattern.test(token)) {
    return {
      valid: false,
      expired: false,
    };
  }

  // Retrieve metadata from store
  const metadata = tokenStore.get(token);
  if (!metadata) {
    return {
      valid: false,
      expired: false,
    };
  }

  // Check expiration
  const now = Date.now();
  const expired = now >= metadata.expiresAt;

  return {
    valid: !expired,
    expired,
    payload: {
      email: metadata.email,
      type: metadata.type,
    },
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
