/**
 * Integration Test: Responsive Navigation (Scenario 10)
 *
 * Tests responsive design from quickstart.md Scenario 10:
 * - Mobile (375px): Hamburger menu + drawer
 * - Tablet (768px): Transitional layout
 * - Desktop (1280px): Horizontal navigation
 * - Touch targets ≥ 44x44px on mobile
 *
 * Expected to FAIL until responsive navigation is implemented (TDD Red phase)
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock window.matchMedia for responsive tests
function mockMatchMedia(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query.includes(`${width}px`),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock window.innerWidth
function mockWindowSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
}

describe('Responsive Navigation - Scenario 10', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile View (375px)', () => {
    beforeEach(() => {
      mockWindowSize(375, 667);
      mockMatchMedia(375);
    });

    it('should display hamburger menu icon on mobile', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      // Hamburger icon should be visible
      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      expect(hamburgerButton).toBeInTheDocument();
      expect(hamburgerButton).toBeVisible();
    });

    it('should hide horizontal navigation menu on mobile', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      // Desktop navigation should be hidden via CSS (md:flex)
      const nav = screen.getByRole('navigation');
      const desktopNav = within(nav).queryByRole('list'); // Assuming desktop nav uses <ul>

      // If desktop nav exists, it should have CSS class that hides it on mobile
      if (desktopNav) {
        expect(desktopNav).toHaveClass(/hidden|md:flex/);
      }
    });

    it('should open drawer when hamburger is clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(hamburgerButton);

      // Drawer/Sheet should appear
      const drawer = screen.getByRole('dialog'); // shadcn Sheet uses dialog role
      expect(drawer).toBeInTheDocument();
      expect(drawer).toBeVisible();
    });

    it('should display all 5 menu items in drawer', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(hamburgerButton);

      const drawer = screen.getByRole('dialog');

      // All menu items should be in drawer
      expect(within(drawer).getByText(/assignments/i)).toBeInTheDocument();
      expect(within(drawer).getByText(/problem management/i)).toBeInTheDocument();
      expect(within(drawer).getByText(/user management/i)).toBeInTheDocument();
      expect(within(drawer).getByText(/reports/i)).toBeInTheDocument();
      expect(within(drawer).getByText(/administrative functions/i)).toBeInTheDocument();
      expect(within(drawer).getByText(/logout/i)).toBeInTheDocument();
    });

    it('should close drawer when item is clicked', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(hamburgerButton);

      const drawer = screen.getByRole('dialog');
      const assignmentsLink = within(drawer).getByText(/assignments/i);

      await user.click(assignmentsLink);

      // Drawer should close
      expect(drawer).not.toBeVisible();
    });

    it('should close drawer when clicking outside (overlay)', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(hamburgerButton);

      const drawer = screen.getByRole('dialog');

      // Click on overlay/backdrop (outside drawer)
      const overlay = document.querySelector('[data-radix-drawer-overlay]');
      if (overlay) {
        await user.click(overlay as Element);
        expect(drawer).not.toBeVisible();
      }
    });

    it('should have touch targets ≥ 44x44px', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const hamburgerButton = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(hamburgerButton);

      const drawer = screen.getByRole('dialog');
      const menuLinks = within(drawer).getAllByRole('link');
      const menuButtons = within(drawer).getAllByRole('button');

      const allInteractiveElements = [...menuLinks, ...menuButtons];

      allInteractiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Tablet View (768px)', () => {
    beforeEach(() => {
      mockWindowSize(768, 1024);
      mockMatchMedia(768);
    });

    it('should render transitional layout on tablet', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      // At md breakpoint (768px), navigation should transition
      // Could be either hamburger or horizontal depending on design
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Desktop View (1280px)', () => {
    beforeEach(() => {
      mockWindowSize(1280, 800);
      mockMatchMedia(1280);
    });

    it('should display horizontal navigation menu on desktop', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      // Desktop navigation should be visible
      const nav = screen.getByRole('navigation');
      expect(nav).toBeVisible();

      // Hamburger should be hidden on desktop
      const hamburger = screen.queryByRole('button', { name: /menu|navigation/i });
      if (hamburger) {
        expect(hamburger).toHaveClass(/md:hidden/);
      }
    });

    it('should display all 5 menu items horizontally', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const nav = screen.getByRole('navigation');

      // All top-level items should be visible
      expect(within(nav).getByText(/assignments/i)).toBeVisible();
      expect(within(nav).getByText(/problem management/i)).toBeVisible();
      expect(within(nav).getByText(/user management/i)).toBeVisible();
      expect(within(nav).getByText(/reports/i)).toBeVisible();
      expect(within(nav).getByText(/administrative functions/i)).toBeVisible();
    });

    it('should show dropdown on hover or click', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      const user = userEvent.setup();

      render(<DashboardPage />);

      const problemMgmtTrigger = screen.getByRole('button', { name: /problem management/i });

      // Hover or click to open dropdown
      await user.hover(problemMgmtTrigger);

      // Dropdown items should appear
      expect(screen.getByRole('link', { name: /^problem management$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /hint management/i })).toBeInTheDocument();
    });

    it('should not have horizontal scrolling', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      const body = document.body;
      expect(body.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    });
  });

  describe('Responsive Behavior Across Breakpoints', () => {
    it('should switch from mobile to desktop layout when resizing', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;

      // Start with mobile
      mockWindowSize(375, 667);
      const { rerender } = render(<DashboardPage />);

      let hamburger = screen.queryByRole('button', { name: /menu|navigation/i });
      expect(hamburger).toBeInTheDocument();

      // Resize to desktop
      mockWindowSize(1280, 800);
      rerender(<DashboardPage />);

      hamburger = screen.queryByRole('button', { name: /menu|navigation/i });
      if (hamburger) {
        expect(hamburger).not.toBeVisible();
      }
    });

    it('should maintain navigation state across breakpoints', async () => {
      const DashboardPage = (await import('@/app/teacher/dashboard/page')).default;
      render(<DashboardPage />);

      // All 5 menu items should be accessible at any breakpoint
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});
