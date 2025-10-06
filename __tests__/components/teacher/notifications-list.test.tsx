/**
 * Contract Test: NotificationsList Component
 *
 * This test verifies the NotificationsList component contract:
 * - Renders notifications with correct type icons
 * - Shows empty state
 * - Calls onNotificationClick
 * - Formats dates
 * - Distinguishes read/unread
 *
 * TDD Phase: RED - These tests MUST FAIL (component not implemented yet)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsList } from '@/components/teacher/notifications-list';
import { generateMockNotifications } from '@/lib/mock-data';

describe('NotificationsList Component Contract', () => {
  describe('Data Rendering', () => {
    it('renders all notifications', () => {
      const notifications = generateMockNotifications(5);

      render(<NotificationsList notifications={notifications} />);

      notifications.forEach((notif) => {
        expect(screen.getByText(notif.title)).toBeInTheDocument();
        expect(screen.getByText(notif.message)).toBeInTheDocument();
      });
    });

    it('displays notification types with correct icons', () => {
      const notifications = generateMockNotifications(4);

      const { container } = render(<NotificationsList notifications={notifications} />);

      // Each notification should have an icon (svg, img, or icon element)
      const icons = container.querySelectorAll('svg, img, [class*="icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('formats dates in human-readable format', () => {
      const now = new Date();
      const notifications = [
        {
          id: 'notif-1',
          type: 'system' as const,
          title: 'Test Notification',
          message: 'Test message',
          date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
        },
      ];

      render(<NotificationsList notifications={notifications} />);

      // Should show relative time or formatted date
      const dateText = screen.getByText(/hours ago|時間前|2025|Oct|10月/i);
      expect(dateText).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no notifications', () => {
      render(
        <NotificationsList
          notifications={[]}
          emptyMessage="No new notifications"
        />
      );

      expect(screen.getByText('No new notifications')).toBeInTheDocument();
    });

    it('uses default empty message when not provided', () => {
      render(<NotificationsList notifications={[]} />);

      expect(
        screen.getByText(/no.*notifications|通知がありません/i)
      ).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onNotificationClick when notification is clicked', () => {
      const notifications = generateMockNotifications(2);
      const onNotificationClick = jest.fn();

      render(
        <NotificationsList
          notifications={notifications}
          onNotificationClick={onNotificationClick}
        />
      );

      // Click first notification
      const firstNotification = screen.getByText(notifications[0].title);
      fireEvent.click(firstNotification.closest('[role="button"], button, a, [class*="cursor-pointer"]')!);

      expect(onNotificationClick).toHaveBeenCalledWith(notifications[0].id);
    });

    it('does not crash when onNotificationClick is not provided', () => {
      const notifications = generateMockNotifications(2);

      render(<NotificationsList notifications={notifications} />);

      // Should render without errors
      expect(screen.getByText(notifications[0].title)).toBeInTheDocument();
    });
  });

  describe('Read/Unread State', () => {
    it('visually distinguishes read and unread notifications', () => {
      const notifications = [
        {
          id: 'notif-1',
          type: 'system' as const,
          title: 'Unread Notification',
          message: 'This is unread',
          date: new Date(),
          read: false,
        },
        {
          id: 'notif-2',
          type: 'assignment-completion' as const,
          title: 'Read Notification',
          message: 'This is read',
          date: new Date(),
          read: true,
        },
      ];

      const { container } = render(<NotificationsList notifications={notifications} />);

      // Find notification containers
      const unreadNotif = screen.getByText('Unread Notification').closest('div, li, [role="listitem"]');
      const readNotif = screen.getByText('Read Notification').closest('div, li, [role="listitem"]');

      // They should have different classes or styles
      expect(unreadNotif?.className).not.toBe(readNotif?.className);
    });
  });

  describe('Notification Types', () => {
    it('renders assignment-completion notifications', () => {
      const notifications = [
        {
          id: 'notif-1',
          type: 'assignment-completion' as const,
          title: 'Assignment Completed',
          message: 'Student completed all kanji',
          date: new Date(),
          read: false,
          relatedStudentId: 'student-001',
        },
      ];

      render(<NotificationsList notifications={notifications} />);

      expect(screen.getByText('Assignment Completed')).toBeInTheDocument();
    });

    it('renders system notifications', () => {
      const notifications = [
        {
          id: 'notif-1',
          type: 'system' as const,
          title: 'System Update',
          message: 'New student registered',
          date: new Date(),
          read: false,
        },
      ];

      render(<NotificationsList notifications={notifications} />);

      expect(screen.getByText('System Update')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper list structure', () => {
      const notifications = generateMockNotifications(3);

      const { container } = render(<NotificationsList notifications={notifications} />);

      // Should have list or list-like structure
      const hasList = container.querySelector('ul, ol, [role="list"]');
      expect(hasList).toBeTruthy();
    });
  });
});
