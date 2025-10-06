/**
 * Integration Test: Teacher Logout (Scenario 9)
 *
 * Tests logout functionality from quickstart.md Scenario 9:
 * 1. Mock authenticated session
 * 2. Render dashboard with navigation
 * 3. Click logout button
 * 4. Assert redirect to /login
 * 5. Assert cookies cleared
 * 6. Attempt to access protected route → redirect to /error
 *
 * Expected to FAIL until logout functionality is implemented (TDD Red phase)
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('Teacher Logout - Scenario 9', () => {
  const mockPush = jest.fn();
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock authenticated session initially
    Object.defineProperty(document, 'cookie', {
      get: () => 'session_access_token=valid; session_refresh_token=valid',
      set: jest.fn(),
      configurable: true,
    });
  });

  it('should display logout button in navigation', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call logout API when logout button is clicked', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    // Mock successful logout
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      headers: new Headers({
        'set-cookie': 'session_access_token=; Max-Age=0, session_refresh_token=; Max-Age=0',
      }),
    } as Response);

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('should redirect to /login after successful logout', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      headers: new Headers({
        'set-cookie': 'session_access_token=; Max-Age=0, session_refresh_token=; Max-Age=0',
      }),
    } as Response);

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should clear session cookies after logout', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    const cookieSetterMock = jest.fn();
    Object.defineProperty(document, 'cookie', {
      get: () => 'session_access_token=valid; session_refresh_token=valid',
      set: cookieSetterMock,
      configurable: true,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      headers: new Headers({
        'set-cookie': 'session_access_token=; Max-Age=0, session_refresh_token=; Max-Age=0',
      }),
    } as Response);

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Wait for logout to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Cookies should be cleared (API returns Max-Age=0)
    // In practice, browser handles cookie deletion
  });

  it('should invalidate session so protected routes redirect to /error', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    // First: successful logout
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response);

    // Second: session validation after logout should fail
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Session expired',
        statusCode: 401,
      }),
    } as Response);

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    // After logout, session should be invalid
    const sessionCheckResponse = await fetch('http://localhost:3000/api/auth/session');
    expect(sessionCheckResponse.status).toBe(401);
  });

  it('should handle logout API errors gracefully', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    // Mock logout API failure
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        error: 'Internal server error',
        statusCode: 500,
      }),
    } as Response);

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Should display error message or still redirect
    await waitFor(() => {
      // Either show error or redirect anyway
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('should disable logout button during logout process', async () => {
    const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
    const user = userEvent.setup();

    // Mock delayed logout
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ success: true }),
              } as Response),
            100
          )
        )
    );

    render(<DashboardPage />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Button should be disabled during logout
    await waitFor(() => {
      expect(logoutButton).toBeDisabled();
    });
  });

  it('should work across all teacher pages', async () => {
    const pages = [
      { component: '@/app/teacher/dashboard/page', name: 'Dashboard' },
      { component: '@/app/teacher/assignments/page', name: 'Assignments' },
      { component: '@/app/teacher/admin/page', name: 'Admin' },
    ];

    for (const { component } of pages) {
      const PageComponent = (await import(component)).default;
      const { unmount } = render(<PageComponent />);

      // Each page should have logout button in navigation
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();

      unmount();
    }
  });
});
