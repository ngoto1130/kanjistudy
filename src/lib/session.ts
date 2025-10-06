import type { Teacher, Session } from '@/types/auth';
import { SessionState } from '@/types/auth';
import { createTokens, verifyToken } from './auth';

// Re-export SessionState for tests
export { SessionState };

/**
 * Creates a new session for an authenticated teacher
 * @param teacher - Authenticated teacher object
 * @returns Session object with tokens and expiration times
 */
export function createSession(teacher: Teacher): Session {
  const now = Date.now(); // Unix timestamp in milliseconds

  const tokens = createTokens(teacher.email);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    teacherEmail: teacher.email,
    issuedAt: now,
    accessTokenExpiresAt: tokens.expiresAt.accessToken,
    refreshTokenExpiresAt: tokens.expiresAt.refreshToken,
  };
}

/**
 * Validates a session based on access and refresh tokens
 * @param accessToken - Current access token
 * @param refreshToken - Current refresh token
 * @returns Session state (Active, Refreshable, Expired, or Invalidated)
 */
export function validateSession(
  accessToken: string,
  refreshToken: string
): SessionState {
  // Verify access token
  const accessTokenVerification = verifyToken(accessToken);

  // If access token is valid, session is Active
  if (accessTokenVerification.valid) {
    return SessionState.Active;
  }

  // Access token expired, check refresh token
  const refreshTokenVerification = verifyToken(refreshToken);

  // If refresh token is valid, session is Refreshable
  if (refreshTokenVerification.valid) {
    return SessionState.Refreshable;
  }

  // Both tokens expired
  if (
    accessTokenVerification.expired &&
    refreshTokenVerification.expired
  ) {
    return SessionState.Expired;
  }

  // Invalid tokens
  return SessionState.Invalidated;
}

/**
 * Refreshes a session by issuing a new access token
 * @param refreshToken - Valid refresh token
 * @returns New access token string
 */
export function refreshSession(refreshToken: string): string {
  // Verify refresh token is valid
  const verification = verifyToken(refreshToken);
  if (!verification.valid || !verification.payload) {
    throw new Error('Invalid refresh token');
  }

  // Extract teacher email from refresh token payload
  const teacherEmail = verification.payload.email;

  // Generate new access token
  const tokens = createTokens(teacherEmail);

  return tokens.accessToken;
}

/**
 * Session storage interface for managing session data
 * Note: This is a simple in-memory store for prototype.
 * In production, use Redis or database.
 */
interface SessionStore {
  [key: string]: Session;
}

// In-memory session store (prototype only)
const sessionStore: SessionStore = {};

/**
 * Stores a session in memory
 * @param session - Session to store
 */
export function storeSession(session: Session): void {
  sessionStore[session.accessToken] = session;
}

/**
 * Retrieves a session from memory by access token
 * @param accessToken - Access token to look up
 * @returns Session if found, undefined otherwise
 */
export function getSession(accessToken: string): Session | undefined {
  return sessionStore[accessToken];
}

/**
 * Removes a session from memory
 * @param accessToken - Access token of session to remove
 */
export function removeSession(accessToken: string): void {
  delete sessionStore[accessToken];
}

/**
 * Gets session by refresh token (for token refresh flow)
 * @param refreshToken - Refresh token to look up
 * @returns Session if found, undefined otherwise
 */
export function getSessionByRefreshToken(
  refreshToken: string
): Session | undefined {
  return Object.values(sessionStore).find(
    (session) => session.refreshToken === refreshToken
  );
}
