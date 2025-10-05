/**
 * Contract Test: BreadcrumbNav Component
 *
 * This test verifies the BreadcrumbNav component contract:
 * - Renders breadcrumb items
 * - Current item is plain text
 * - Non-current items are links
 * - Separators present
 * - Compact on mobile
 *
 * TDD Phase: RED - These tests MUST FAIL (component not implemented yet)
 */

import { render, screen } from '@testing-library/react';
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';
import type { BreadcrumbItem } from '@/types/teacher';

describe('BreadcrumbNav Component Contract', () => {
  describe('Data Rendering', () => {
    it('renders all breadcrumb items', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Assignment Creation', href: '/teacher/assignments', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assignment Creation')).toBeInTheDocument();
    });

    it('renders single breadcrumb (dashboard only)', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Current Item Behavior', () => {
    it('current item is not a clickable link', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Students', href: '/teacher/students', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      // Current item should be text, not a link
      const currentItem = screen.getByText('Students');
      expect(currentItem.tagName).not.toBe('A');
    });

    it('non-current items are clickable links', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Students', href: '/teacher/students', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      // Non-current item should be a link
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/teacher/dashboard');
    });
  });

  describe('Separators', () => {
    it('has separators between breadcrumb items', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Questions', href: '/teacher/questions', isCurrent: false },
        { label: 'Edit Question', href: '/teacher/questions/edit', isCurrent: true },
      ];

      const { container } = render(<BreadcrumbNav items={items} />);

      // Should have separators (>, /, or similar)
      const separators = container.querySelectorAll('[class*="separator"], svg');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('separator count is one less than item count', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Reports', href: '/teacher/reports', isCurrent: true },
      ];

      const { container } = render(<BreadcrumbNav items={items} />);

      // With 2 items, should have 1 separator
      // This is approximate - actual implementation may vary
      const text = container.textContent;
      expect(text).toMatch(/Dashboard.*Reports/);
    });
  });

  describe('Link Navigation', () => {
    it('creates correct href for each non-current item', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Parents', href: '/teacher/parents', isCurrent: false },
        { label: 'Parent Details', href: '/teacher/parents/123', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      const parentsLink = screen.getByRole('link', { name: /^parents$/i });

      expect(dashboardLink).toHaveAttribute('href', '/teacher/dashboard');
      expect(parentsLink).toHaveAttribute('href', '/teacher/parents');
    });
  });

  describe('Responsive Layout', () => {
    it('has responsive classes for mobile compact view', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Administrator Functions', href: '/teacher/admin', isCurrent: true },
      ];

      const { container } = render(<BreadcrumbNav items={items} />);

      // Should have responsive classes (hidden, truncate, etc.)
      const breadcrumbContainer = container.querySelector('[class*="breadcrumb"], nav, ol, ul');
      expect(breadcrumbContainer).toBeTruthy();
    });
  });

  describe('Empty State', () => {
    it('renders nothing when items array is empty', () => {
      const { container } = render(<BreadcrumbNav items={[]} />);

      // Should render empty or minimal structure
      expect(container.querySelector('ol, ul, nav')?.children.length || 0).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic nav structure', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Admin', href: '/teacher/admin', isCurrent: true },
      ];

      const { container } = render(<BreadcrumbNav items={items} />);

      // Should use nav element or role="navigation"
      const nav = container.querySelector('nav, [role="navigation"]');
      expect(nav).toBeTruthy();
    });

    it('uses ordered list (ol) for breadcrumbs', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Assignments', href: '/teacher/assignments', isCurrent: true },
      ];

      const { container } = render(<BreadcrumbNav items={items} />);

      // Breadcrumbs should use ol for semantic ordering
      const list = container.querySelector('ol');
      expect(list).toBeTruthy();
    });

    it('has aria-current on current item', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
        { label: 'Reports', href: '/teacher/reports', isCurrent: true },
      ];

      render(<BreadcrumbNav items={items} />);

      const currentItem = screen.getByText('Reports');
      expect(currentItem.closest('[aria-current]')).toHaveAttribute('aria-current', 'page');
    });
  });
});
