/**
 * NotificationsList Component
 *
 * Displays teacher notifications with type icons, title, message, and date.
 * - Shows different icons for assignment-completion vs system notifications
 * - Distinguishes read/unread notifications visually
 * - Displays dates in human-readable format
 *
 * Phase 3.5 - Component Implementation (TDD Green Phase)
 */

import type { NotificationsListProps, Notification } from '@/types/teacher';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Format date to human-readable format
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return '1時間前';
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays === 1) {
    return '1日前';
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    // Format as date
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

/**
 * Get icon for notification type
 */
function NotificationIcon({ type }: { type: Notification['type'] }) {
  if (type === 'assignment-completion') {
    return (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  // System notification
  return (
    <svg
      className="w-5 h-5 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function NotificationsList({
  notifications,
  onNotificationClick,
  emptyMessage = '通知がありません',
}: NotificationsListProps) {
  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3" role="list">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <Card
            className={`transition-colors cursor-pointer hover:bg-accent ${
              notification.read ? 'opacity-70' : 'border-l-4 border-l-primary'
            }`}
            onClick={() => onNotificationClick?.(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {notification.title}
                    </h4>
                    <Badge variant={notification.type === 'assignment-completion' ? 'default' : 'secondary'}>
                      {notification.type === 'assignment-completion' ? '課題完了' : 'システム'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(notification.date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
