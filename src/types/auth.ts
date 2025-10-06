// Type definitions for Teacher Dashboard Authentication

/**
 * Represents an authenticated teacher user
 */
export interface Teacher {
  email: string;
  password: string;
  name?: string;
}

/**
 * Represents an active authenticated session
 */
export interface Session {
  accessToken: string;
  refreshToken: string;
  teacherEmail: string;
  issuedAt: number;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

/**
 * Session state enumeration
 */
export enum SessionState {
  Active = 'Active',
  Refreshable = 'Refreshable',
  Expired = 'Expired',
  Invalidated = 'Invalidated',
}

/**
 * Represents a navigation menu item
 */
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
  order: number;
}

/**
 * Represents route protection configuration
 */
export interface RouteProtection {
  pattern: string;
  requiresAuth: boolean;
  redirectOnFail: string;
}

/**
 * Token verification result
 */
export interface TokenVerification {
  valid: boolean;
  expired: boolean;
  payload?: {
    teacherEmail: string;
    issuedAt: number;
  };
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response body
 */
export interface LoginResponse {
  success: boolean;
  teacher: {
    email: string;
    name: string;
  };
  expiresAt: {
    accessToken: number;
    refreshToken: number;
  };
}

/**
 * Session validation response
 */
export interface SessionValidationResponse {
  valid: boolean;
  teacher: {
    email: string;
    name: string;
  };
  expiresAt: {
    accessToken: number;
    refreshToken: number;
  };
  refreshed?: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
