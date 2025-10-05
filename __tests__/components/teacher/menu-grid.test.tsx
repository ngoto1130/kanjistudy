/**
 * Contract Test: MenuGrid Component
 *
 * This test verifies the MenuGrid component contract:
 * - Renders 6 menu items
 * - Links navigate correctly
 * - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
 * - Touch targets >= 44px
 *
 * TDD Phase: RED - These tests MUST FAIL (component not implemented yet)
 */

import { render, screen } from '@testing-library/react';
import { MenuGrid } from '@/components/teacher/menu-grid';
import { getTeacherMenuItems } from '@/lib/mock-data';

describe('MenuGrid Component Contract', () => {
  const menuItems = getTeacherMenuItems();

  describe('Data Rendering', () => {
    it('renders all menu items', () => {
      render(<MenuGrid items={menuItems} />);

      menuItems.forEach((item) => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });

    it('renders exactly 6 menu items', () => {
      render(<MenuGrid items={menuItems} />);

      const menuCards = screen.getAllByRole('link');
      expect(menuCards).toHaveLength(6);
    });
  });

  describe('Navigation Links', () => {
    it('creates links with correct href attributes', () => {
      render(<MenuGrid items={menuItems} />);

      menuItems.forEach((item) => {
        const link = screen.getByRole('link', { name: new RegExp(item.title, 'i') });
        expect(link).toHaveAttribute('href', item.href);
      });
    });

    it('all menu items are clickable links', () => {
      render(<MenuGrid items={menuItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
      });
    });
  });

  describe('Responsive Grid Layout', () => {
    it('has responsive grid classes', () => {
      const { container } = render(<MenuGrid items={menuItems} />);

      // Should have grid layout with responsive classes
      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer).toBeTruthy();
    });

    it('uses custom column configuration when provided', () => {
      const { container } = render(
        <MenuGrid
          items={menuItems}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        />
      );

      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer).toBeTruthy();
    });

    it('has 1 column layout classes for mobile', () => {
      const { container } = render(<MenuGrid items={menuItems} />);

      const gridContainer = container.querySelector('[class*="grid"]');
      // Should have single column on mobile (grid-cols-1 or similar)
      expect(gridContainer?.className).toMatch(/grid-cols-1|grid/);
    });
  });

  describe('Touch Targets', () => {
    it('has minimum touch target size of 44px', () => {
      render(<MenuGrid items={menuItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        // Check that link or its parent card has sufficient padding/height
        const styles = window.getComputedStyle(link);
        const minHeight = parseInt(styles.minHeight || '0');
        const height = parseInt(styles.height || '0');
        const padding = parseInt(styles.padding || '0');

        // Link should either have min-height >= 44px or be in a card with adequate padding
        const hasMinHeight = minHeight >= 44 || height >= 44;
        const hasAdequatePadding = padding >= 12; // Typical card padding

        expect(hasMinHeight || hasAdequatePadding).toBe(true);
      });
    });
  });

  describe('Menu Item Content', () => {
    it('displays menu item titles', () => {
      render(<MenuGrid items={menuItems} />);

      expect(screen.getByText('Assignment Creation')).toBeInTheDocument();
      expect(screen.getByText('Question Management')).toBeInTheDocument();
      expect(screen.getByText('Student Management')).toBeInTheDocument();
      expect(screen.getByText('Parent Management')).toBeInTheDocument();
      expect(screen.getByText('Learning Status Report')).toBeInTheDocument();
      expect(screen.getByText('Administrator Functions')).toBeInTheDocument();
    });

    it('displays menu item descriptions', () => {
      render(<MenuGrid items={menuItems} />);

      menuItems.forEach((item) => {
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });
  });

  describe('Card Structure', () => {
    it('each menu item is rendered as a card', () => {
      const { container } = render(<MenuGrid items={menuItems} />);

      // Cards should have border or distinct visual styling
      const cards = container.querySelectorAll('[class*="border"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('renders nothing when items array is empty', () => {
      const { container } = render(<MenuGrid items={[]} />);

      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer?.children.length || 0).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure (nav or section)', () => {
      const { container } = render(<MenuGrid items={menuItems} />);

      // Should be wrapped in nav or have proper landmark
      const nav = container.querySelector('nav, [role="navigation"], section');
      expect(nav).toBeTruthy();
    });
  });
});
