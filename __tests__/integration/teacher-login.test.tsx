/**
 * Integration Test: Teacher Login Flow (Scenario 1)
 *
 * Tests the complete user journey from quickstart.md Scenario 1:
 * 1. Navigate to login page
 * 2. Fill email and password
 * 3. Click login button
 * 4. Assert redirect to /teacher/dashboard
 * 5. Assert cookies are set
 *
 * Expected to FAIL until components and API routes are implemented (TDD Red phase)
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Teacher Login Flow - Scenario 1', () => {
  const mockPush = jest.fn();
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render login page with email and password fields', async () => {
    // Import the login page component
    const LoginPage = (await import('@/app/(auth)/login/page')).default;

    render(<LoginPage />);

    // Check for email input
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    // Check for password input
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Check for login button
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('should successfully login with valid credentials and redirect to dashboard', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    // Mock successful login API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        teacher: {
          email: 'teacher1@teacher.com',
          name: 'Teacher One',
        },
        expiresAt: {
          accessToken: Date.now() + 30 * 60 * 1000,
          refreshToken: Date.now() + 28 * 24 * 60 * 60 * 1000,
        },
      }),
      headers: new Headers({
        'set-cookie': 'session_access_token=xxx; HttpOnly; Secure; SameSite=Strict; Max-Age=1800, session_refresh_token=yyy; HttpOnly; Secure; SameSite=Strict; Max-Age=2419200',
      }),
    } as Response);

    render(<LoginPage />);

    // Fill in form fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'teacher1@teacher.com');
    await user.type(passwordInput, 'Password!');

    // Submit form
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    // Assert API was called with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'teacher1@teacher.com',
            password: 'Password!',
          }),
        })
      );
    });

    // Assert redirect to dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/teacher/dashboard');
    });
  });

  it('should validate email field is required', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill only password, leave email empty
    await user.type(passwordInput, 'Password!');
    await user.click(loginButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should validate password field is required', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill only email, leave password empty
    await user.type(emailInput, 'teacher1@teacher.com');
    await user.click(loginButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill with invalid email format
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'Password!');
    await user.click(loginButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should validate password minimum length (8 characters)', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Fill with short password
    await user.type(emailInput, 'teacher1@teacher.com');
    await user.type(passwordInput, 'Pass1!');
    await user.click(loginButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/password.*8.*characters/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should show loading state during login', async () => {
    const LoginPage = (await import('@/app/(auth)/login/page')).default;
    const user = userEvent.setup();

    // Mock delayed API response
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                status: 200,
                json: async () => ({
                  success: true,
                  teacher: { email: 'teacher1@teacher.com', name: 'Teacher One' },
                  expiresAt: { accessToken: Date.now() + 1800000, refreshToken: Date.now() + 2419200000 },
                }),
              } as Response),
            100
          )
        )
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'teacher1@teacher.com');
    await user.type(passwordInput, 'Password!');
    await user.click(loginButton);

    // Button should be disabled during loading
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
  });
});
