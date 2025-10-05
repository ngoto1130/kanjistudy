import { Metadata } from 'next';
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';

export const metadata: Metadata = {
  title: 'Learning Status Report - Teacher Dashboard - KanjiStudy',
  description: 'View detailed learning analytics and reports',
};

export default function ReportsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
    { label: 'Learning Status Report', href: '/teacher/reports', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BreadcrumbNav items={breadcrumbs} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Status Report</h1>
          <p className="mt-2 text-gray-600">
            View detailed learning analytics and reports
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-500 text-center">
            Learning status report interface - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
