import { Metadata } from 'next';
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';

export const metadata: Metadata = {
  title: 'Administrator Functions - Teacher Dashboard - KanjiStudy',
  description: 'Access administrative settings and system configuration',
};

export default function AdminPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
    { label: 'Administrator Functions', href: '/teacher/admin', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BreadcrumbNav items={breadcrumbs} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrator Functions</h1>
          <p className="mt-2 text-gray-600">
            Access administrative settings and system configuration
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-500 text-center">
            Administrator interface - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
