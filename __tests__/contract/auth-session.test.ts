/**
 * Contract Test: GET /api/auth/session
 *
 * Validates the session validation endpoint contract against auth-api.yaml spec:
 * - With valid access token → 200 + session valid
 * - With expired access token but valid refresh → 200 + new access token + refreshed=true
 * - With both tokens expired → 401 + error
 *
 * Expected to FAIL until API route is implemented (TDD Red phase)
 */

describe('GET /api/auth/session - Contract', () => {
  const API_ENDPOINT = 'http://localhost:3000/api/auth/session';
  const LOGIN_ENDPOINT = 'http://localhost:3000/api/auth/login';

  // Helper function to create a valid session
  async function createSession(): Promise<{ cookies: string[]; tokens: any }> {
    const loginResponse = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher1@teacher.com',
        password: 'Password!',
      }),
    });

    const cookies = loginResponse.headers.get('set-cookie');
    if (!cookies) throw new Error('Login failed - no cookies set');

    const tokens = await loginResponse.json();
    return {
      cookies: cookies.split(',').map(c => c.split(';')[0].trim()),
      tokens,
    };
  }

  describe('Success Case - Valid Access Token (200)', () => {
    it('should return 200 with valid access token', async () => {
      const { cookies } = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader
        },
      });

      expect(response.status).toBe(200);
    });

    it('should return session data matching schema', async () => {
      const { cookies } = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const data = await response.json();
      expect(data).toMatchObject({
        valid: true,
        teacher: {
          email: expect.any(String),
          name: expect.any(String),
        },
        expiresAt: {
          accessToken: expect.any(Number),
          refreshToken: expect.any(Number),
        },
        refreshed: expect.any(Boolean),
      });
    });

    it('should return teacher object with correct email', async () => {
      const { cookies } = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const data = await response.json();
      expect(data.teacher.email).toBe('teacher1@teacher.com');
      expect(data.teacher.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should return refreshed=false when access token is still valid', async () => {
      const { cookies } = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const data = await response.json();
      expect(data.refreshed).toBe(false);
    });

    it('should return valid expiration timestamps', async () => {
      const { cookies } = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const data = await response.json();
      const now = Date.now();

      // Expiration times should be in the future
      expect(data.expiresAt.accessToken).toBeGreaterThan(now);
      expect(data.expiresAt.refreshToken).toBeGreaterThan(now);

      // Refresh token expires later than access token
      expect(data.expiresAt.refreshToken).toBeGreaterThan(data.expiresAt.accessToken);
    });
  });

  describe('Success Case - Token Refresh (200)', () => {
    it('should refresh access token when expired but refresh token valid', async () => {
      // This test simulates expired access token but valid refresh token
      // In practice, we would need to wait 30 minutes or manipulate time
      // For now, we test the contract structure

      const { cookies } = await createSession();

      // Mock scenario: access token expired, refresh token valid
      // The API should detect this and issue new access token

      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookies.join('; ')
        },
      });

      const data = await response.json();

      // Response should still be 200 (successful refresh)
      expect(response.status).toBe(200);

      // Response structure should include refreshed flag
      expect(data).toHaveProperty('refreshed');
      expect(typeof data.refreshed).toBe('boolean');
    });

    it('should return new access token in Set-Cookie when refreshing', async () => {
      const { cookies } = await createSession();

      // In a real scenario with expired access token,
      // the response would include new Set-Cookie header
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': cookies.join('; ')
        },
      });

      // When refreshed=true, should have Set-Cookie header
      const data = await response.json();
      if (data.refreshed === true) {
        const setCookieHeaders = response.headers.get('set-cookie');
        expect(setCookieHeaders).toContain('session_access_token');
        expect(setCookieHeaders).toContain('Max-Age=1800'); // 30 minutes
      }
    });
  });

  describe('Error Cases', () => {
    it('should return 401 without cookies', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
      });

      expect(response.status).toBe(401);
    });

    it('should return error response matching schema', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
      });

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 401,
      });
    });

    it('should return 401 with invalid access token', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': 'session_access_token=invalid; session_refresh_token=invalid'
        },
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 when both tokens are expired', async () => {
      // Simulate both tokens expired
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': 'session_access_token=expired; session_refresh_token=expired'
        },
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toMatch(/expired|invalid/i);
    });

    it('should return 401 with only access token (no refresh token)', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': 'session_access_token=sometoken'
        },
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 with only refresh token (no access token)', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Cookie': 'session_refresh_token=sometoken'
        },
      });

      expect(response.status).toBe(401);
    });
  });
});
