/**
 * TypeScript Type Definitions: Teacher Dashboard Mockup
 *
 * This file contains all TypeScript types and interfaces for the teacher dashboard feature.
 * Types are based on data-model.md and contracts/component-contracts.ts.
 *
 * Status: Phase 3.1 - Setup & Foundation
 */

// ============================================================================
// Enums and Type Aliases
// ============================================================================

export type TimePeriod = 'last-week' | 'last-month' | 'custom';
export type NotificationType = 'assignment-completion' | 'system';
export type AssignmentStatus = 'active' | 'completed';

// ============================================================================
// Core Entity Types
// ============================================================================

/**
 * Teacher entity
 * Represents a teacher user in the system.
 */
export interface Teacher {
  id: string;
  name: string;
  email: string;
  assignedSessions: string[];
}

/**
 * Student entity
 * Represents a student learner in the system.
 */
export interface Student {
  id: string;
  name: string;
  grade?: string;
  studySessions: number;
  clearedQuestions: number;
  accuracyRate: number;
  lastStudyDate?: Date;
}

/**
 * Progress filter settings
 * Controls time period filtering for student progress data.
 */
export interface ProgressFilter {
  period: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Student progress with metrics
 * Represents student progress data filtered by time period.
 */
export interface StudentProgress {
  student: Student;
  metrics: {
    studySessions: number;
    clearedQuestions: number;
    accuracyRate: number;
  };
}

/**
 * Notification entity
 * Represents a notification message for teachers.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  relatedStudentId?: string;
}

/**
 * Assignment entity
 * Represents a kanji assignment for a student.
 */
export interface Assignment {
  id: string;
  studentId: string;
  teacherId: string;
  kanjiList: string[];
  createdDate: Date;
  status: AssignmentStatus;
  completedDate?: Date;
}

/**
 * Question entity
 * Represents a single kanji question/learning item.
 */
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

/**
 * Parent entity
 * Represents a parent/guardian of a student.
 */
export interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  studentIds: string[];
}

// ============================================================================
// Component Prop Types
// ============================================================================

/**
 * ProgressTable component props
 * Displays student progress data in responsive table/card layout.
 */
export interface ProgressTableProps {
  students: StudentProgress[];
  filter: ProgressFilter;
  onFilterChange?: (filter: ProgressFilter) => void;
  emptyMessage?: string;
}

/**
 * NotificationsList component props
 * Displays teacher notifications with type icons.
 */
export interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
  emptyMessage?: string;
}

/**
 * MenuItem for menu grid
 */
export interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

/**
 * MenuGrid component props
 * Displays menu items in responsive grid layout.
 */
export interface MenuGridProps {
  items: MenuItem[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

/**
 * BreadcrumbItem for navigation
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * BreadcrumbNav component props
 * Displays breadcrumb navigation trail.
 */
export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

/**
 * LoginForm component props
 * Mock login form for teachers.
 */
export interface LoginFormProps {
  onSubmit?: (email: string) => void;
  defaultEmail?: string;
  isLoading?: boolean;
}

// ============================================================================
// Page Metadata Types
// ============================================================================

/**
 * Page metadata for Next.js pages
 */
export interface PageMetadata {
  title: string;
  description: string;
}

/**
 * Teacher route paths
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

/**
 * Page metadata constants
 */
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
