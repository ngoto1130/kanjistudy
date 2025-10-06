# Data Model: Teacher Dashboard Mockup

**Feature**: Teacher Dashboard Mockup
**Date**: 2025-10-05
**Status**: Phase 1 - Design

## Overview

This data model defines the TypeScript types and interfaces for the teacher dashboard mockup feature. All entities represent **mock data only** - no database persistence, no API calls, no authentication. These types serve as contracts for component props and mock data generators.

---

## Core Entities

### Teacher

Represents a teacher user in the system.

```typescript
interface Teacher {
  id: string;                    // Unique identifier (e.g., "teacher-001")
  name: string;                  // Full name (e.g., "田中 太郎")
  email: string;                 // Email address (for mock login)
  assignedSessions: string[];    // Session IDs teacher is assigned to
}
```

**Validation Rules**:
- `id`: Non-empty string, unique across all teachers
- `name`: Non-empty string, 1-50 characters
- `email`: Valid email format
- `assignedSessions`: Array of session IDs (may be empty)

**Notes**:
- In non-homeroom system, teachers are assigned to sessions, not students
- ~10 teachers in the system
- Mock login accepts any email (no password validation)

---

### Student

Represents a student learner in the system.

```typescript
interface Student {
  id: string;                    // Unique identifier (e.g., "student-001")
  name: string;                  // Full name (e.g., "佐藤 花子")
  grade?: string;                // Optional grade level (e.g., "小学3年")
  studySessions: number;         // Count of completed learning sessions
  clearedQuestions: number;      // Count of cleared questions
  accuracyRate: number;          // Percentage (0-100) of correct answers
  lastStudyDate?: Date;          // Optional last study date
}
```

**Validation Rules**:
- `id`: Non-empty string, unique across all students
- `name`: Non-empty string, 1-50 characters
- `studySessions`: Non-negative integer
- `clearedQuestions`: Non-negative integer
- `accuracyRate`: Number between 0 and 100 (inclusive)
- `lastStudyDate`: Valid date or undefined

**Notes**:
- ~50 students in the system
- Progress metrics (studySessions, clearedQuestions, accuracyRate) are filterable by time period
- Students attend sessions every 2 weeks to 1 month

---

### Progress

Represents student learning progress with time period filtering.

```typescript
type TimePeriod = 'last-week' | 'last-month' | 'custom';

interface ProgressFilter {
  period: TimePeriod;            // Time period for filtering
  startDate?: Date;              // Required if period === 'custom'
  endDate?: Date;                // Required if period === 'custom'
}

interface StudentProgress {
  student: Student;              // Full student entity
  metrics: {
    studySessions: number;       // Filtered by time period
    clearedQuestions: number;    // Filtered by time period
    accuracyRate: number;        // Filtered by time period (0-100)
  };
}
```

**Validation Rules**:
- `period`: Must be one of 'last-week', 'last-month', 'custom'
- `startDate` and `endDate`: Required when `period === 'custom'`, must be valid dates
- `endDate` must be >= `startDate` when both provided
- Metrics validation same as Student entity

**Notes**:
- Progress table displays StudentProgress array with current filter
- Default filter: 'last-month'
- Mock implementation: filter doesn't actually affect data (all mock data shown)

---

### Notification

Represents a notification message for teachers.

```typescript
type NotificationType = 'assignment-completion' | 'system';

interface Notification {
  id: string;                    // Unique identifier (e.g., "notif-001")
  type: NotificationType;        // Notification category
  title: string;                 // Notification title (e.g., "Assignment Completed")
  message: string;               // Brief message preview (e.g., "Student X cleared all kanji")
  date: Date;                    // Notification timestamp
  read: boolean;                 // Whether notification has been read
  relatedStudentId?: string;     // Optional related student ID (for assignment completions)
}
```

**Validation Rules**:
- `id`: Non-empty string, unique across all notifications
- `type`: Must be 'assignment-completion' or 'system'
- `title`: Non-empty string, 1-100 characters
- `message`: Non-empty string, 1-200 characters
- `date`: Valid date
- `read`: Boolean
- `relatedStudentId`: Valid student ID or undefined

**Notification Type Examples**:
- **assignment-completion**: "Student 佐藤 花子 completed all assigned kanji. New assignment needed."
- **system**: "Teacher 山田 先生 registered new student 鈴木 太郎."

**Notes**:
- Empty state: "No new notifications" when no notifications exist
- Sorted by date (newest first)

---

### Assignment

Represents a kanji assignment for a student.

```typescript
interface Assignment {
  id: string;                    // Unique identifier
  studentId: string;             // Student this assignment is for
  teacherId: string;             // Teacher who created the assignment
  kanjiList: string[];           // List of kanji characters (10-30 items)
  createdDate: Date;             // When assignment was created
  status: 'active' | 'completed'; // Assignment status
  completedDate?: Date;          // When all kanji were cleared
}
```

**Validation Rules**:
- `id`: Non-empty string, unique
- `studentId`: Valid student ID
- `teacherId`: Valid teacher ID
- `kanjiList`: Array of 10-30 kanji characters
- `createdDate`: Valid date
- `status`: Must be 'active' or 'completed'
- `completedDate`: Valid date if status === 'completed', undefined otherwise

**Notes**:
- Students can have multiple assignments over time
- When all kanji cleared (4 consecutive correct days per kanji), status → 'completed'
- Assignment completion triggers notification to teacher

---

### Question

Represents a single kanji question/learning item.

```typescript
interface Question {
  id: string;                    // Unique identifier
  kanji: string;                 // The kanji character
  readings: {
    onyomi: string[];            // On-yomi readings
    kunyomi: string[];           // Kun-yomi readings
  };
  meaning: string;               // English/Japanese meaning
  assignedTo?: string;           // Student ID if part of assignment
  consecutiveCorrect?: number;   // Consecutive correct answers (0-4+)
  lastAnsweredDate?: Date;       // Last time student answered
}
```

**Validation Rules**:
- `id`: Non-empty string, unique
- `kanji`: Single kanji character (1 character)
- `readings.onyomi`: Array of strings (may be empty)
- `readings.kunyomi`: Array of strings (may be empty)
- `meaning`: Non-empty string
- `consecutiveCorrect`: Non-negative integer (0-4+)
- Question cleared when `consecutiveCorrect >= 4` (configurable)

**Notes**:
- Questions managed via Question Management page (mockup)
- Kanji cleared after 4 consecutive correct answers (configurable setting)

---

### Parent (Referenced Entity)

Represents a parent/guardian of a student.

```typescript
interface Parent {
  id: string;                    // Unique identifier
  name: string;                  // Full name
  email: string;                 // Contact email
  phone?: string;                // Optional phone number
  studentIds: string[];          // IDs of students they are guardian of
}
```

**Validation Rules**:
- `id`: Non-empty string, unique
- `name`: Non-empty string, 1-50 characters
- `email`: Valid email format
- `phone`: Valid phone format or undefined
- `studentIds`: Non-empty array of valid student IDs

**Notes**:
- Managed via Parent Management page (mockup)
- One parent can have multiple students
- One student can have multiple parents

---

## Component Contracts

### ProgressTable Props

```typescript
interface ProgressTableProps {
  students: StudentProgress[];   // Filtered student progress data
  filter: ProgressFilter;        // Current filter settings
  onFilterChange?: (filter: ProgressFilter) => void; // Optional filter callback
  emptyMessage?: string;         // Custom empty state message
}
```

---

### NotificationsList Props

```typescript
interface NotificationsListProps {
  notifications: Notification[]; // Array of notifications
  onNotificationClick?: (id: string) => void; // Optional click handler
  emptyMessage?: string;         // Custom empty state message
}
```

---

### MenuGrid Props

```typescript
interface MenuItem {
  title: string;                 // Menu item title (e.g., "Assignment Creation")
  description: string;           // Brief description
  href: string;                  // Navigation path (e.g., "/teacher/assignments")
  icon?: string;                 // Optional icon identifier
}

interface MenuGridProps {
  items: MenuItem[];             // Array of 6 menu items
  columns?: {                    // Responsive column configuration
    mobile: number;              // Columns on mobile (default: 1)
    tablet: number;              // Columns on tablet (default: 2)
    desktop: number;             // Columns on desktop (default: 3)
  };
}
```

---

### BreadcrumbNav Props

```typescript
interface BreadcrumbItem {
  label: string;                 // Breadcrumb label (e.g., "Dashboard")
  href: string;                  // Navigation path
  isCurrent?: boolean;           // Whether this is the current page
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];       // Breadcrumb trail (e.g., [Dashboard, Assignments])
}
```

---

### LoginForm Props

```typescript
interface LoginFormProps {
  onSubmit?: (email: string) => void; // Mock login handler (no password)
  defaultEmail?: string;         // Pre-filled email for mockup
  isLoading?: boolean;           // Loading state (always false in mockup)
}
```

---

## Mock Data Generation Contracts

All mock data generators are defined in `src/lib/mock-data.ts`:

```typescript
// Generate mock students
export function generateMockStudents(count?: number): Student[];

// Generate mock teachers
export function generateMockTeachers(count?: number): Teacher[];

// Generate mock notifications
export function generateMockNotifications(count?: number): Notification[];

// Generate mock assignments
export function generateMockAssignments(studentIds: string[], teacherIds: string[]): Assignment[];

// Generate mock questions
export function generateMockQuestions(count?: number): Question[];

// Generate mock parents
export function generateMockParents(studentIds: string[]): Parent[];

// Generate menu items
export function getTeacherMenuItems(): MenuItem[];

// Generate breadcrumb trail from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[];
```

---

## Relationships

```
Teacher 1:N Session (teachers assigned to sessions)
Session N:M Student (students attend sessions)
Student 1:N Assignment (students receive assignments)
Teacher 1:N Assignment (teachers create assignments)
Assignment 1:N Question (assignments contain kanji questions)
Student 1:N Progress (student has progress metrics)
Teacher 1:N Notification (teachers receive notifications)
Notification N:1 Student (some notifications relate to students)
Parent N:M Student (parents have multiple students, students have multiple parents)
```

**Note**: In mockup, relationships are represented by ID references (e.g., `studentId: string`), not actual object references or foreign keys.

---

## Type Guards

Utility functions for type checking (to be implemented in `src/lib/type-guards.ts`):

```typescript
export function isStudent(obj: unknown): obj is Student;
export function isTeacher(obj: unknown): obj is Teacher;
export function isNotification(obj: unknown): obj is Notification;
export function isAssignment(obj: unknown): obj is Assignment;
export function isQuestion(obj: unknown): obj is Question;
export function isParent(obj: unknown): obj is Parent;
```

---

## File Locations

- **Type Definitions**: `src/types/teacher.ts`
- **Mock Data Generators**: `src/lib/mock-data.ts`
- **Type Guards**: `src/lib/type-guards.ts`

---

**Data Model Status**: ✅ COMPLETE - All entities defined, validation rules specified, component contracts established.
