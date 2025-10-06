import { Metadata } from 'next';
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';

export const metadata: Metadata = {
  title: 'Question Management - Teacher Dashboard - KanjiStudy',
  description: 'Manage kanji questions and learning content',
};

export default function QuestionsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
    { label: 'Question Management', href: '/teacher/questions', isCurrent: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BreadcrumbNav items={breadcrumbs} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
          <p className="mt-2 text-gray-600">
            Manage kanji questions and learning content
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-500 text-center">
            Question management interface - Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
