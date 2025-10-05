import { Metadata } from 'next';
import { ProgressTable } from '@/components/teacher/progress-table';
import { NotificationsList } from '@/components/teacher/notifications-list';
import { MenuGrid } from '@/components/teacher/menu-grid';
import {
  generateMockStudents,
  generateMockNotifications,
  getTeacherMenuItems,
  applyProgressFilter,
} from '@/lib/mock-data';
import type { ProgressFilter } from '@/types/teacher';

export const metadata: Metadata = {
  title: 'Dashboard - Teacher Dashboard - KanjiStudy',
  description: 'View student progress, notifications, and access teacher tools',
};

export default function DashboardPage() {
  // Generate mock data (Server Component - no client state)
  const students = generateMockStudents(50);
  const notifications = generateMockNotifications(10);
  const menuItems = getTeacherMenuItems();

  // Default filter
  const defaultFilter: ProgressFilter = { period: 'last-month' };
  const studentProgress = applyProgressFilter(students, defaultFilter);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">
            View student progress and manage your teaching tools
          </p>
        </div>

        {/* Student Progress Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Student Progress
          </h2>
          <ProgressTable
            students={studentProgress}
            filter={defaultFilter}
            emptyMessage="No student data available"
          />
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notifications
          </h2>
          <NotificationsList
            notifications={notifications}
            emptyMessage="No new notifications"
          />
        </section>

        {/* Menu Grid Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Access
          </h2>
          <MenuGrid items={menuItems} />
        </section>
      </div>
    </div>
  );
}
