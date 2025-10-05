import { Metadata } from 'next';
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';

export const metadata: Metadata = {
  title: 'Student Management - Teacher Dashboard - KanjiStudy',
  description: 'Manage student accounts and information',
};

export default function StudentsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
    { label: 'Student Management', href: '/teacher/students', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BreadcrumbNav items={breadcrumbs} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">
            Manage student accounts and information
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-500 text-center">
            Student management interface - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
