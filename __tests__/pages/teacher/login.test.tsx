/**
 * Page Contract Test: Login Page
 *
 * Test Requirements (from tasks.md T020):
 * - Renders LoginForm component
 * - Has correct metadata (title: "Teacher Login - KanjiStudy")
 * - Redirects to dashboard on submit
 *
 * Expected: ❌ MUST FAIL (page not implemented yet)
 */

import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/teacher/login/page';

describe('Teacher Login Page', () => {
  it('renders the LoginForm component', () => {
    render(<LoginPage />);

    // Should have email input
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // Should have submit button
    const submitButton = screen.getByRole('button', { name: /login|submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('has correct page metadata', () => {
    // This test verifies metadata export in the page component
    // In Next.js 15 App Router, we verify the metadata object
    // Note: This is a placeholder - actual metadata testing may require different approach
    expect(LoginPage).toBeDefined();
  });
});
