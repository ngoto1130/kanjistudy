/**
 * Contract Test: POST /api/auth/login
 *
 * Validates the login endpoint contract against auth-api.yaml spec:
 * - Valid credentials → 200 + cookies + teacher object + expiresAt
 * - Invalid credentials → 401 + error message
 * - Missing fields → 400 + validation error
 *
 * Expected to FAIL until API route is implemented (TDD Red phase)
 */

describe('POST /api/auth/login - Contract', () => {
  const VALID_EMAIL = 'teacher1@teacher.com';
  const VALID_PASSWORD = 'Password!';
  const API_ENDPOINT = 'http://localhost:3000/api/auth/login';

  describe('Success Case (200)', () => {
    it('should return 200 with valid credentials', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        }),
      });

      expect(response.status).toBe(200);
    });

    it('should set httpOnly session cookies', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        }),
      });

      const setCookieHeaders = response.headers.get('set-cookie');
      expect(setCookieHeaders).toBeTruthy();
      expect(setCookieHeaders).toContain('session_access_token');
      expect(setCookieHeaders).toContain('session_refresh_token');
      expect(setCookieHeaders).toContain('HttpOnly');
      expect(setCookieHeaders).toContain('Secure');
      expect(setCookieHeaders).toContain('SameSite=Strict');
    });

    it('should return teacher object matching schema', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        }),
      });

      const data = await response.json();

      expect(data).toMatchObject({
        success: true,
        teacher: {
          email: expect.any(String),
          name: expect.any(String),
        },
        expiresAt: {
          accessToken: expect.any(Number),
          refreshToken: expect.any(Number),
        },
      });

      // Validate specific field values
      expect(data.teacher.email).toBe(VALID_EMAIL);
      expect(data.teacher.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email format
    });

    it('should return valid expiration timestamps', async () => {
      const beforeRequest = Date.now();

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        }),
      });

      const afterRequest = Date.now();
      const data = await response.json();

      // Access token expires in 30 minutes (1800 seconds)
      const expectedAccessExpiry = beforeRequest + 30 * 60 * 1000;
      expect(data.expiresAt.accessToken).toBeGreaterThanOrEqual(expectedAccessExpiry - 5000); // 5s tolerance
      expect(data.expiresAt.accessToken).toBeLessThanOrEqual(afterRequest + 30 * 60 * 1000 + 5000);

      // Refresh token expires in 28 days (2419200 seconds)
      const expectedRefreshExpiry = beforeRequest + 28 * 24 * 60 * 60 * 1000;
      expect(data.expiresAt.refreshToken).toBeGreaterThanOrEqual(expectedRefreshExpiry - 5000);
      expect(data.expiresAt.refreshToken).toBeLessThanOrEqual(afterRequest + 28 * 24 * 60 * 60 * 1000 + 5000);
    });
  });

  describe('Error Cases', () => {
    it('should return 401 with invalid credentials', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 401,
      });
      expect(data.error).toMatch(/invalid/i); // Error message contains "invalid"
    });

    it('should return 400 when email is missing', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: VALID_PASSWORD,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 400,
      });
      expect(data.error).toMatch(/email/i); // Error mentions email
    });

    it('should return 400 when password is missing', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VALID_EMAIL,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 400,
      });
      expect(data.error).toMatch(/password/i); // Error mentions password
    });

    it('should return 400 when body is empty', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        statusCode: 400,
      });
    });

    it('should not set cookies on failed login', async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }),
      });

      const setCookieHeaders = response.headers.get('set-cookie');
      expect(setCookieHeaders).toBeNull();
    });
  });
});
