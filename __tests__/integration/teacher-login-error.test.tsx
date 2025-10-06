/**
 * Integration Test: Invalid Login Credentials (Scenario 2)
 *
 * Tests error handling from quickstart.md Scenario 2:
 * 1. Navigate to login page
 * 2. Fill invalid credentials
 * 3. Click login button
 * 4. Assert remain on /login page
 * 5. Assert error message displayed
 *
 * Expected to FAIL until components and API routes are implemented (TDD Red phase)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Teacher Login Error Handling - Scenario 2', () => {
  const mockPush = jest.fn();
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should display error message with invalid credentials', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    // Mock 401 unauthorized response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Invalid email or password',
        statusCode: 401,
      }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill with invalid credentials
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    // Assert error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid.*email.*password/i)).toBeInTheDocument();
    });

    // Should NOT redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should retain form values after failed login attempt', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Invalid email or password',
        statusCode: 401,
      }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: /login/i });

    const testEmail = 'wrong@example.com';
    const testPassword = 'wrongpassword';

    await user.type(emailInput, testEmail);
    await user.type(passwordInput, testPassword);
    await user.click(loginButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    // Form values should be retained
    expect(emailInput.value).toBe(testEmail);
    expect(passwordInput.value).toBe(testPassword);
  });

  it('should allow retry after failed login', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    // First attempt: fail
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Invalid email or password',
        statusCode: 401,
      }),
    } as Response);

    // Second attempt: succeed
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        teacher: { email: 'teacher1@teacher.com', name: 'Teacher One' },
        expiresAt: {
          accessToken: Date.now() + 1800000,
          refreshToken: Date.now() + 2419200000,
        },
      }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // First attempt with wrong credentials
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    // Clear fields and retry with correct credentials
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'teacher1@teacher.com');
    await user.type(passwordInput, 'Password!');
    await user.click(loginButton);

    // Should redirect on successful retry
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });

  it('should handle network errors gracefully', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'teacher1@teacher.com');
    await user.type(passwordInput, 'Password!');
    await user.click(loginButton);

    // Should display error message
    await waitFor(() => {
      expect(screen.getByText(/error|failed|unable/i)).toBeInTheDocument();
    });

    // Should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should clear error message when user starts typing again', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Invalid email or password',
        statusCode: 401,
      }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Trigger error
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    // Start typing again
    await user.type(emailInput, 'a');

    // Error should be cleared or hidden (implementation-specific)
    // This test validates the UX behavior
    await waitFor(() => {
      const errorElement = screen.queryByText(/invalid.*email.*password/i);
      expect(errorElement).not.toBeInTheDocument();
    });
  });

  it('should not store credentials in browser when login fails', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Invalid email or password',
        statusCode: 401,
      }),
    } as Response);

    // Mock document.cookie
    const cookieMock = jest.fn();
    Object.defineProperty(document, 'cookie', {
      get: cookieMock,
      configurable: true,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });

    // Cookies should not contain session tokens
    const cookies = cookieMock();
    expect(cookies).not.toContain('session_access_token');
    expect(cookies).not.toContain('session_refresh_token');
  });
});
