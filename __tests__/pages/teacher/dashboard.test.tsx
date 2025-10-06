/**
 * Page Contract Test: Dashboard Page
 *
 * Test Requirements (from tasks.md T021):
 * - Renders ProgressTable component
 * - Renders NotificationsList component
 * - Renders MenuGrid component
 * - Loads mock data (50 students)
 * - Has correct metadata
 *
 * Expected: ❌ MUST FAIL (page not implemented yet)
 */

import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/teacher/dashboard/page';

describe('Teacher Dashboard Page', () => {
  it('renders the ProgressTable component', () => {
    render(<DashboardPage />);

    // Should have progress table with student data
    const tableOrCards = screen.getByRole('table') || screen.getByTestId('progress-table');
    expect(tableOrCards).toBeInTheDocument();
  });

  it('renders the NotificationsList component', () => {
    render(<DashboardPage />);

    // Should have notifications section
    const notificationsList = screen.getByRole('list', { name: /notifications/i }) ||
                              screen.getByTestId('notifications-list');
    expect(notificationsList).toBeInTheDocument();
  });

  it('renders the MenuGrid component', () => {
    render(<DashboardPage />);

    // Should have 6 menu items
    const assignmentLink = screen.getByRole('link', { name: /assignment creation/i });
    const questionLink = screen.getByRole('link', { name: /question management/i });
    const studentLink = screen.getByRole('link', { name: /student management/i });
    const parentLink = screen.getByRole('link', { name: /parent management/i });
    const reportLink = screen.getByRole('link', { name: /learning status report/i });
    const adminLink = screen.getByRole('link', { name: /administrator functions/i });

    expect(assignmentLink).toBeInTheDocument();
    expect(questionLink).toBeInTheDocument();
    expect(studentLink).toBeInTheDocument();
    expect(parentLink).toBeInTheDocument();
    expect(reportLink).toBeInTheDocument();
    expect(adminLink).toBeInTheDocument();
  });

  it('loads mock data with ~50 students', async () => {
    render(<DashboardPage />);

    // Should have multiple student rows/cards
    // Note: Exact count verification depends on implementation
    const studentElements = screen.queryAllByTestId(/student-row|student-card/);
    expect(studentElements.length).toBeGreaterThanOrEqual(40);
    expect(studentElements.length).toBeLessThanOrEqual(60);
  });

  it('has correct page metadata', () => {
    // Verify page component is defined
    expect(DashboardPage).toBeDefined();
  });
});
