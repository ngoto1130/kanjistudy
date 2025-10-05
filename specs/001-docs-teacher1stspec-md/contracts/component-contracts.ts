/**
 * Component Contracts: Teacher Dashboard Mockup
 *
 * These TypeScript interfaces define the contracts (prop types) for all
 * teacher dashboard components. Contract tests will verify that components
 * accept and render data according to these contracts.
 *
 * Status: Phase 1 - Design (Tests not yet written)
 */

// ============================================================================
// Core Entity Types
// ============================================================================

export type TimePeriod = 'last-week' | 'last-month' | 'custom';
export type NotificationType = 'assignment-completion' | 'system';
export type AssignmentStatus = 'active' | 'completed';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  assignedSessions: string[];
}

export interface Student {
  id: string;
  name: string;
  grade?: string;
  studySessions: number;
  clearedQuestions: number;
  accuracyRate: number;
  lastStudyDate?: Date;
}

export interface ProgressFilter {
  period: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface StudentProgress {
  student: Student;
  metrics: {
    studySessions: number;
    clearedQuestions: number;
    accuracyRate: number;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  relatedStudentId?: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  teacherId: string;
  kanjiList: string[];
  createdDate: Date;
  status: AssignmentStatus;
  completedDate?: Date;
}

export interface Question {
  id: string;
  kanji: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  meaning: string;
  assignedTo?: string;
  consecutiveCorrect?: number;
  lastAnsweredDate?: Date;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentIds: string[];
}

// ============================================================================
// Component Prop Contracts
// ============================================================================

/**
 * CONTRACT: ProgressTable Component
 *
 * Displays student progress data in a responsive table/card layout.
 * Desktop: Full table with columns
 * Mobile: Card layout with labeled fields
 *
 * Test Requirements:
 * - Renders all student data from props
 * - Shows empty state when students array is empty
 * - Applies correct filter settings
 * - Calls onFilterChange when filter is changed
 * - Responsive layout: table (md+), cards (mobile)
 */
export interface ProgressTableProps {
  students: StudentProgress[];
  filter: ProgressFilter;
  onFilterChange?: (filter: ProgressFilter) => void;
  emptyMessage?: string; // Default: "No student data available"
}

/**
 * CONTRACT: NotificationsList Component
 *
 * Displays teacher notifications with type icons, title, message preview, and date.
 *
 * Test Requirements:
 * - Renders all notifications from props
 * - Shows correct icon for each notification type
 * - Shows empty state when notifications array is empty
 * - Calls onNotificationClick when notification is clicked
 * - Displays dates in human-readable format
 * - Distinguishes read/unread notifications visually
 */
export interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
  emptyMessage?: string; // Default: "No new notifications"
}

/**
 * CONTRACT: MenuGrid Component
 *
 * Displays 6 teacher menu items in a responsive grid layout.
 * Mobile: 1 column
 * Tablet: 2 columns
 * Desktop: 3 columns
 *
 * Test Requirements:
 * - Renders all menu items from props
 * - Links navigate to correct paths
 * - Responsive grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
 * - Touch targets >= 44px on mobile
 */
export interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export interface MenuGridProps {
  items: MenuItem[];
  columns?: {
    mobile: number;   // Default: 1
    tablet: number;   // Default: 2
    desktop: number;  // Default: 3
  };
}

/**
 * CONTRACT: BreadcrumbNav Component
 *
 * Displays breadcrumb navigation trail (Dashboard > Current Page).
 * All items except current are clickable links.
 *
 * Test Requirements:
 * - Renders all breadcrumb items from props
 * - Current item is not a link (plain text)
 * - Non-current items are clickable links
 * - Separators between items
 * - Compact on mobile (may abbreviate labels)
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

/**
 * CONTRACT: LoginForm Component
 *
 * Mock login form for teachers. Accepts email only (no password).
 * Mockup: Always "succeeds" on submit.
 *
 * Test Requirements:
 * - Renders email input field
 * - Calls onSubmit with email value on form submission
 * - Pre-fills email if defaultEmail provided
 * - Shows loading state if isLoading is true
 * - Validates email format before submit
 */
export interface LoginFormProps {
  onSubmit?: (email: string) => void;
  defaultEmail?: string;
  isLoading?: boolean; // Always false in mockup
}

// ============================================================================
// Page Metadata Contracts
// ============================================================================

/**
 * CONTRACT: Page Metadata
 *
 * Next.js metadata for each teacher page.
 *
 * Test Requirements:
 * - Each page exports correct metadata
 * - Titles follow pattern: "[Page Name] - Teacher Dashboard - KanjiStudy"
 * - Descriptions are SEO-friendly
 */
export interface PageMetadata {
  title: string;
  description: string;
}

export const PAGE_METADATA: Record<string, PageMetadata> = {
  login: {
    title: 'Teacher Login - KanjiStudy',
    description: 'Teacher login for KanjiStudy kanji learning application',
  },
  dashboard: {
    title: 'Dashboard - Teacher Dashboard - KanjiStudy',
    description: 'View student progress, notifications, and access teacher tools',
  },
  assignments: {
    title: 'Assignment Creation - Teacher Dashboard - KanjiStudy',
    description: 'Create and manage kanji assignments for students',
  },
  questions: {
    title: 'Question Management - Teacher Dashboard - KanjiStudy',
    description: 'Manage kanji questions and learning content',
  },
  students: {
    title: 'Student Management - Teacher Dashboard - KanjiStudy',
    description: 'Manage student accounts and information',
  },
  parents: {
    title: 'Parent Management - Teacher Dashboard - KanjiStudy',
    description: 'Manage parent accounts and communications',
  },
  reports: {
    title: 'Learning Status Report - Teacher Dashboard - KanjiStudy',
    description: 'View detailed learning analytics and reports',
  },
  admin: {
    title: 'Administrator Functions - Teacher Dashboard - KanjiStudy',
    description: 'Access administrative settings and system configuration',
  },
};

// ============================================================================
// Mock Data Generator Contracts
// ============================================================================

/**
 * CONTRACT: Mock Data Generators
 *
 * These functions generate consistent mock data for the teacher dashboard.
 * All generators use seeded randomness to ensure data consistency.
 *
 * Test Requirements:
 * - Generators return correct types matching entity interfaces
 * - Generated data passes validation rules
 * - Generated data is consistent across calls (seeded randomness)
 * - Default counts match spec (~50 students, ~10 teachers)
 */
export interface MockDataGenerators {
  generateMockStudents(count?: number): Student[];
  generateMockTeachers(count?: number): Teacher[];
  generateMockNotifications(count?: number): Notification[];
  generateMockAssignments(studentIds: string[], teacherIds: string[]): Assignment[];
  generateMockQuestions(count?: number): Question[];
  generateMockParents(studentIds: string[]): Parent[];
  getTeacherMenuItems(): MenuItem[];
  generateBreadcrumbs(pathname: string): BreadcrumbItem[];
  applyProgressFilter(students: Student[], filter: ProgressFilter): StudentProgress[];
}

// ============================================================================
// Navigation Contracts
// ============================================================================

/**
 * CONTRACT: Teacher Navigation Routes
 *
 * All teacher pages follow the /teacher/* pattern.
 *
 * Test Requirements:
 * - All routes are accessible
 * - Breadcrumbs correctly reflect current route
 * - Links navigate to correct pages
 */
export const TEACHER_ROUTES = {
  LOGIN: '/teacher/login',
  DASHBOARD: '/teacher/dashboard',
  ASSIGNMENTS: '/teacher/assignments',
  QUESTIONS: '/teacher/questions',
  STUDENTS: '/teacher/students',
  PARENTS: '/teacher/parents',
  REPORTS: '/teacher/reports',
  ADMIN: '/teacher/admin',
} as const;

export type TeacherRoute = (typeof TEACHER_ROUTES)[keyof typeof TEACHER_ROUTES];
