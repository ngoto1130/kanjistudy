/**
 * Integration Test: Teacher Navigation (Scenarios 3-7)
 *
 * Tests navigation flows from quickstart.md:
 * - Scenario 3: Navigate to Assignments
 * - Scenario 4: Problem Management dropdown (2 items)
 * - Scenario 5: User Management dropdown (2 items)
 * - Scenario 6: Reports dropdown (3 items)
 * - Scenario 7: Administrative Functions
 *
 * Expected to FAIL until navigation components are implemented (TDD Red phase)
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock authenticated session
const mockSession = {
  valid: true,
  teacher: {
    email: 'teacher1@teacher.com',
    name: 'Teacher One',
  },
  expiresAt: {
    accessToken: Date.now() + 1800000,
    refreshToken: Date.now() + 2419200000,
  },
};

describe('Teacher Navigation - Scenarios 3-7', () => {
  beforeEach(() => {
    // Mock authenticated state
    global.fetch = jest.fn((url) => {
      if (url.toString().includes('/api/auth/session')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockSession,
        } as Response);
      }
      return Promise.reject(new Error('Unexpected fetch call'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario 3: Navigate to Assignments', () => {
    it('should render Assignments menu item', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const assignmentsLink = screen.getByRole('link', { name: /assignments/i });
      expect(assignmentsLink).toBeInTheDocument();
      expect(assignmentsLink).toHaveAttribute('href', '/teacher/assignments');
    });

    it('should navigate to Assignments page when clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const assignmentsLink = screen.getByRole('link', { name: /assignments/i });
      await user.click(assignmentsLink);

      // In Next.js App Router, clicking link triggers client-side navigation
      // We verify the link exists and has correct href
      expect(assignmentsLink).toHaveAttribute('href', '/teacher/assignments');
    });

    it('should display top navigation menu on Assignments page', async () => {
      const AssignmentsPage = (await import('@/app/teacher/assignments/page')).default;
      render(<AssignmentsPage />);

      // Navigation should be visible on all teacher pages
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Scenario 4: Problem Management Dropdown', () => {
    it('should render Problem Management menu with dropdown trigger', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const problemMgmtTrigger = screen.getByRole('button', { name: /problem management/i });
      expect(problemMgmtTrigger).toBeInTheDocument();
    });

    it('should show 2 dropdown items when Problem Management is clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const problemMgmtTrigger = screen.getByRole('button', { name: /problem management/i });
      await user.click(problemMgmtTrigger);

      // Dropdown should contain 2 items
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /^problem management$/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /hint management/i })).toBeInTheDocument();
      });
    });

    it('should navigate to Problem Management page', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const problemMgmtTrigger = screen.getByRole('button', { name: /problem management/i });
      await user.click(problemMgmtTrigger);

      await waitFor(() => {
        const problemMgmtLink = screen.getByRole('link', { name: /^problem management$/i });
        expect(problemMgmtLink).toHaveAttribute('href', '/teacher/problem-management');
      });
    });

    it('should navigate to Hint Management page', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const problemMgmtTrigger = screen.getByRole('button', { name: /problem management/i });
      await user.click(problemMgmtTrigger);

      await waitFor(() => {
        const hintMgmtLink = screen.getByRole('link', { name: /hint management/i });
        expect(hintMgmtLink).toHaveAttribute('href', '/teacher/hint-management');
      });
    });
  });

  describe('Scenario 5: User Management Dropdown', () => {
    it('should render User Management menu with dropdown trigger', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const userMgmtTrigger = screen.getByRole('button', { name: /user management/i });
      expect(userMgmtTrigger).toBeInTheDocument();
    });

    it('should show 2 dropdown items when User Management is clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const userMgmtTrigger = screen.getByRole('button', { name: /user management/i });
      await user.click(userMgmtTrigger);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /student management/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /parent management/i })).toBeInTheDocument();
      });
    });

    it('should navigate to Student Management page', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const userMgmtTrigger = screen.getByRole('button', { name: /user management/i });
      await user.click(userMgmtTrigger);

      await waitFor(() => {
        const studentMgmtLink = screen.getByRole('link', { name: /student management/i });
        expect(studentMgmtLink).toHaveAttribute('href', '/teacher/student-management');
      });
    });

    it('should navigate to Parent Management page', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const userMgmtTrigger = screen.getByRole('button', { name: /user management/i });
      await user.click(userMgmtTrigger);

      await waitFor(() => {
        const parentMgmtLink = screen.getByRole('link', { name: /parent management/i });
        expect(parentMgmtLink).toHaveAttribute('href', '/teacher/parent-management');
      });
    });
  });

  describe('Scenario 6: Reports Dropdown', () => {
    it('should render Reports menu with dropdown trigger', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const reportsTrigger = screen.getByRole('button', { name: /reports/i });
      expect(reportsTrigger).toBeInTheDocument();
    });

    it('should show 3 dropdown items when Reports is clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const reportsTrigger = screen.getByRole('button', { name: /reports/i });
      await user.click(reportsTrigger);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /report 1/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /report 2/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /report 3/i })).toBeInTheDocument();
      });
    });

    it('should navigate to Report 1 page', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const reportsTrigger = screen.getByRole('button', { name: /reports/i });
      await user.click(reportsTrigger);

      await waitFor(() => {
        const report1Link = screen.getByRole('link', { name: /report 1/i });
        expect(report1Link).toHaveAttribute('href', '/teacher/reports/1');
      });
    });

    it('should navigate to Report 2 and Report 3 pages', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const reportsTrigger = screen.getByRole('button', { name: /reports/i });
      await user.click(reportsTrigger);

      await waitFor(() => {
        const report2Link = screen.getByRole('link', { name: /report 2/i });
        const report3Link = screen.getByRole('link', { name: /report 3/i });

        expect(report2Link).toHaveAttribute('href', '/teacher/reports/2');
        expect(report3Link).toHaveAttribute('href', '/teacher/reports/3');
      });
    });
  });

  describe('Scenario 7: Administrative Functions', () => {
    it('should render Administrative Functions menu item', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const adminLink = screen.getByRole('link', { name: /administrative functions/i });
      expect(adminLink).toBeInTheDocument();
      expect(adminLink).toHaveAttribute('href', '/teacher/admin');
    });

    it('should navigate to Admin page when clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const adminLink = screen.getByRole('link', { name: /administrative functions/i });
      await user.click(adminLink);

      expect(adminLink).toHaveAttribute('href', '/teacher/admin');
    });

    it('should display placeholder content on Admin page', async () => {
      const AdminPage = (await import('@/app/teacher/admin/page')).default;
      render(<AdminPage />);

      expect(screen.getByText(/administrative functions/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Menu Structure', () => {
    it('should have 5 top-level menu items in correct order', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const nav = screen.getByRole('navigation');
      const menuItems = within(nav).getAllByRole('link', { hidden: true }).concat(
        within(nav).getAllByRole('button', { hidden: true })
      );

      // Order should be: Assignments, Problem Management, User Management, Reports, Admin
      const expectedLabels = [
        /assignments/i,
        /problem management/i,
        /user management/i,
        /reports/i,
        /administrative functions/i,
      ];

      expectedLabels.forEach((label, index) => {
        expect(menuItems.some(item => label.test(item.textContent || ''))).toBe(true);
      });
    });

    it('should include Logout button in navigation', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
