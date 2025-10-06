/**
 * Contract Test: POST /api/auth/logout
 *
 * Validates the logout endpoint contract against auth-api.yaml spec:
 * - With valid session → 200 + cookies cleared
 * - Without session → 401 + error message
 *
 * Expected to FAIL until API route is implemented (TDD Red phase)
 */

describe('POST /api/auth/logout - Contract', () => {
  const API_ENDPOINT = 'http://localhost:3000/api/auth/logout';
  const LOGIN_ENDPOINT = 'http://localhost:3000/api/auth/login';

  // Helper function to create a valid session
  async function createSession(): Promise<string[]> {
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

    // Extract individual cookies from Set-Cookie header
    return cookies.split(',').map(c => c.split(';')[0].trim());
  }

  describe('Success Case (200)', () => {
    it('should return 200 with valid session', async () => {
      const cookies = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader
        },
      });

      expect(response.status).toBe(200);
    });

    it('should return success response matching schema', async () => {
      const cookies = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const data = await response.json();
      expect(data).toMatchObject({
        success: true,
      });
    });

    it('should clear session cookies with Max-Age=0', async () => {
      const cookies = await createSession();
      const cookieHeader = cookies.join('; ');

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader
        },
      });

      const setCookieHeaders = response.headers.get('set-cookie');
      expect(setCookieHeaders).toBeTruthy();

      // Both cookies should be cleared
      expect(setCookieHeaders).toContain('session_access_token=');
      expect(setCookieHeaders).toContain('session_refresh_token=');

      // Check for Max-Age=0 (immediate expiration)
      expect(setCookieHeaders).toContain('Max-Age=0');
    });

    it('should invalidate session immediately', async () => {
      const cookies = await createSession();
      const cookieHeader = cookies.join('; ');

      // First logout
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Cookie': cookieHeader },
      });

      // Try to use same cookies again (should fail)
      const secondLogoutResponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Cookie': cookieHeader },
      });

      expect(secondLogoutResponse.status).toBe(401);
    });
  });

  describe('Error Cases', () => {
    it('should return 401 without session cookies', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
      });

      expect(response.status).toBe(401);
    });

    it('should return error response matching schema', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
      });

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 401,
      });
      expect(data.error).toMatch(/session/i); // Error mentions session
    });

    it('should return 401 with invalid cookies', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Cookie': 'session_access_token=invalid; session_refresh_token=invalid'
        },
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 with expired cookies', async () => {
      // Simulate expired cookies by using empty values
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Cookie': 'session_access_token=; session_refresh_token='
        },
      });

      expect(response.status).toBe(401);
    });
  });
});
