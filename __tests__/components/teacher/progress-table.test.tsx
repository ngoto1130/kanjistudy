/**
 * Contract Test: ProgressTable Component
 *
 * This test verifies the ProgressTable component contract:
 * - Renders student progress data
 * - Shows empty state when no students
 * - Applies filter settings
 * - Calls onFilterChange callback
 * - Responsive layout: table (md+), cards (mobile)
 *
 * TDD Phase: RED - These tests MUST FAIL (component not implemented yet)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressTable } from '@/components/teacher/progress-table';
import { generateMockStudents, applyProgressFilter } from '@/lib/mock-data';
import type { ProgressFilter, StudentProgress } from '@/types/teacher';

describe('ProgressTable Component Contract', () => {
  const mockFilter: ProgressFilter = {
    period: 'last-month',
  };

  describe('Data Rendering', () => {
    it('renders student progress data correctly', () => {
      const students = generateMockStudents(5);
      const studentProgress = applyProgressFilter(students, mockFilter);

      render(<ProgressTable students={studentProgress} filter={mockFilter} />);

      // Verify all students are rendered
      studentProgress.forEach(({ student, metrics }) => {
        expect(screen.getByText(student.name)).toBeInTheDocument();
        expect(screen.getByText(metrics.studySessions.toString())).toBeInTheDocument();
        expect(screen.getByText(metrics.clearedQuestions.toString())).toBeInTheDocument();
        expect(screen.getByText(`${metrics.accuracyRate}%`)).toBeInTheDocument();
      });
    });

    it('displays all required column headers', () => {
      const students = generateMockStudents(3);
      const studentProgress = applyProgressFilter(students, mockFilter);

      render(<ProgressTable students={studentProgress} filter={mockFilter} />);

      // Desktop table should have column headers
      expect(screen.getByText(/name|名前/i)).toBeInTheDocument();
      expect(screen.getByText(/study sessions|学習回数/i)).toBeInTheDocument();
      expect(screen.getByText(/cleared|クリア数/i)).toBeInTheDocument();
      expect(screen.getByText(/accuracy|正答率/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no students provided', () => {
      render(
        <ProgressTable
          students={[]}
          filter={mockFilter}
          emptyMessage="No student data available"
        />
      );

      expect(screen.getByText('No student data available')).toBeInTheDocument();
    });

    it('uses default empty message when not provided', () => {
      render(<ProgressTable students={[]} filter={mockFilter} />);

      expect(
        screen.getByText(/no student data|学習データがありません/i)
      ).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('displays current filter period', () => {
      const students = generateMockStudents(3);
      const studentProgress = applyProgressFilter(students, mockFilter);

      render(<ProgressTable students={studentProgress} filter={mockFilter} />);

      // Filter UI should show current period
      expect(screen.getByText(/last month|先月/i)).toBeInTheDocument();
    });

    it('calls onFilterChange when filter is changed', () => {
      const students = generateMockStudents(3);
      const studentProgress = applyProgressFilter(students, mockFilter);
      const onFilterChange = jest.fn();

      render(
        <ProgressTable
          students={studentProgress}
          filter={mockFilter}
          onFilterChange={onFilterChange}
        />
      );

      // Click "Last Week" filter button
      const lastWeekButton = screen.getByRole('button', { name: /last week|先週/i });
      fireEvent.click(lastWeekButton);

      expect(onFilterChange).toHaveBeenCalledWith({
        period: 'last-week',
      });
    });

    it('does not crash when onFilterChange is not provided', () => {
      const students = generateMockStudents(3);
      const studentProgress = applyProgressFilter(students, mockFilter);

      render(<ProgressTable students={studentProgress} filter={mockFilter} />);

      // Filter buttons should still render without callback
      const lastWeekButton = screen.getByRole('button', { name: /last week|先週/i });
      expect(lastWeekButton).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('has responsive classes for mobile card layout', () => {
      const students = generateMockStudents(2);
      const studentProgress = applyProgressFilter(students, mockFilter);

      const { container } = render(
        <ProgressTable students={studentProgress} filter={mockFilter} />
      );

      // Should have elements that hide/show based on screen size
      const mobileView = container.querySelector('[class*="md:hidden"]');
      const desktopView = container.querySelector('[class*="hidden"][class*="md:block"]');

      expect(mobileView || desktopView).toBeTruthy();
    });

    it('renders student data in card format for mobile', () => {
      const students = generateMockStudents(1);
      const studentProgress = applyProgressFilter(students, mockFilter);

      render(<ProgressTable students={studentProgress} filter={mockFilter} />);

      // Mobile cards should have data-testid or specific structure
      const studentName = screen.getByText(studentProgress[0].student.name);
      expect(studentName.closest('[class*="border"]')).toBeInTheDocument(); // Card container
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure (table or list)', () => {
      const students = generateMockStudents(3);
      const studentProgress = applyProgressFilter(students, mockFilter);

      const { container } = render(
        <ProgressTable students={studentProgress} filter={mockFilter} />
      );

      // Should have either table or proper list structure
      const hasTable = container.querySelector('table');
      const hasList = container.querySelector('[role="list"]') || container.querySelector('ul');

      expect(hasTable || hasList).toBeTruthy();
    });
  });
});
