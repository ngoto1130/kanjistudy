/**
 * Type Guards: Teacher Dashboard Mockup
 *
 * This file contains runtime type guard functions for teacher dashboard entities.
 * Type guards provide runtime validation to ensure data matches expected TypeScript types.
 *
 * Status: Phase 3.1 - Setup & Foundation
 */

import type {
  Teacher,
  Student,
  Notification,
  Assignment,
  Question,
  Parent,
  NotificationType,
  AssignmentStatus,
} from '@/types/teacher';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Check if a value is a valid Date
 */
function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if a value is a number within a range
 */
function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Check if a value is a valid email
 */
function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// ============================================================================
// Entity Type Guards
// ============================================================================

/**
 * Type guard for Teacher entity
 */
export function isTeacher(obj: unknown): obj is Teacher {
  if (typeof obj !== 'object' || obj === null) return false;

  const t = obj as Record<string, unknown>;

  return (
    isNonEmptyString(t.id) &&
    isNonEmptyString(t.name) &&
    isValidEmail(t.email) &&
    Array.isArray(t.assignedSessions) &&
    t.assignedSessions.every((s) => typeof s === 'string')
  );
}

/**
 * Type guard for Student entity
 */
export function isStudent(obj: unknown): obj is Student {
  if (typeof obj !== 'object' || obj === null) return false;

  const s = obj as Record<string, unknown>;

  const baseValid =
    isNonEmptyString(s.id) &&
    isNonEmptyString(s.name) &&
    typeof s.studySessions === 'number' &&
    s.studySessions >= 0 &&
    typeof s.clearedQuestions === 'number' &&
    s.clearedQuestions >= 0 &&
    isNumberInRange(s.accuracyRate, 0, 100);

  // Optional fields
  const gradeValid = s.grade === undefined || typeof s.grade === 'string';
  const dateValid = s.lastStudyDate === undefined || isValidDate(s.lastStudyDate);

  return baseValid && gradeValid && dateValid;
}

/**
 * Type guard for NotificationType
 */
function isNotificationType(value: unknown): value is NotificationType {
  return value === 'assignment-completion' || value === 'system';
}

/**
 * Type guard for Notification entity
 */
export function isNotification(obj: unknown): obj is Notification {
  if (typeof obj !== 'object' || obj === null) return false;

  const n = obj as Record<string, unknown>;

  const baseValid =
    isNonEmptyString(n.id) &&
    isNotificationType(n.type) &&
    isNonEmptyString(n.title) &&
    isNonEmptyString(n.message) &&
    isValidDate(n.date) &&
    typeof n.read === 'boolean';

  // Optional field
  const studentIdValid = n.relatedStudentId === undefined || typeof n.relatedStudentId === 'string';

  return baseValid && studentIdValid;
}

/**
 * Type guard for AssignmentStatus
 */
function isAssignmentStatus(value: unknown): value is AssignmentStatus {
  return value === 'active' || value === 'completed';
}

/**
 * Type guard for Assignment entity
 */
export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== 'object' || obj === null) return false;

  const a = obj as Record<string, unknown>;

  const baseValid =
    isNonEmptyString(a.id) &&
    isNonEmptyString(a.studentId) &&
    isNonEmptyString(a.teacherId) &&
    Array.isArray(a.kanjiList) &&
    a.kanjiList.length >= 10 &&
    a.kanjiList.length <= 30 &&
    a.kanjiList.every((k) => typeof k === 'string') &&
    isValidDate(a.createdDate) &&
    isAssignmentStatus(a.status);

  // Optional field - completedDate should exist if status is 'completed'
  const completedDateValid =
    a.status === 'completed'
      ? isValidDate(a.completedDate)
      : a.completedDate === undefined;

  return baseValid && completedDateValid;
}

/**
 * Type guard for Question entity
 */
export function isQuestion(obj: unknown): obj is Question {
  if (typeof obj !== 'object' || obj === null) return false;

  const q = obj as Record<string, unknown>;

  const readingsValid =
    typeof q.readings === 'object' &&
    q.readings !== null &&
    Array.isArray((q.readings as { onyomi?: unknown }).onyomi) &&
    Array.isArray((q.readings as { kunyomi?: unknown }).kunyomi) &&
    (q.readings as { onyomi: unknown[] }).onyomi.every((r) => typeof r === 'string') &&
    (q.readings as { kunyomi: unknown[] }).kunyomi.every((r) => typeof r === 'string');

  const baseValid =
    isNonEmptyString(q.id) &&
    typeof q.kanji === 'string' &&
    q.kanji.length === 1 &&
    readingsValid &&
    isNonEmptyString(q.meaning);

  // Optional fields
  const assignedToValid = q.assignedTo === undefined || typeof q.assignedTo === 'string';
  const consecutiveCorrectValid =
    q.consecutiveCorrect === undefined ||
    (typeof q.consecutiveCorrect === 'number' && q.consecutiveCorrect >= 0);
  const lastAnsweredDateValid =
    q.lastAnsweredDate === undefined || isValidDate(q.lastAnsweredDate);

  return baseValid && assignedToValid && consecutiveCorrectValid && lastAnsweredDateValid;
}

/**
 * Type guard for Parent entity
 */
export function isParent(obj: unknown): obj is Parent {
  if (typeof obj !== 'object' || obj === null) return false;

  const p = obj as Record<string, unknown>;

  const baseValid =
    isNonEmptyString(p.id) &&
    isNonEmptyString(p.name) &&
    isValidEmail(p.email) &&
    Array.isArray(p.studentIds) &&
    p.studentIds.length > 0 &&
    p.studentIds.every((s) => typeof s === 'string');

  // Optional field
  const phoneValid = p.phone === undefined || typeof p.phone === 'string';

  return baseValid && phoneValid;
}

// ============================================================================
// Array Type Guards
// ============================================================================

/**
 * Type guard for Teacher array
 */
export function isTeacherArray(arr: unknown): arr is Teacher[] {
  return Array.isArray(arr) && arr.every(isTeacher);
}

/**
 * Type guard for Student array
 */
export function isStudentArray(arr: unknown): arr is Student[] {
  return Array.isArray(arr) && arr.every(isStudent);
}

/**
 * Type guard for Notification array
 */
export function isNotificationArray(arr: unknown): arr is Notification[] {
  return Array.isArray(arr) && arr.every(isNotification);
}

/**
 * Type guard for Assignment array
 */
export function isAssignmentArray(arr: unknown): arr is Assignment[] {
  return Array.isArray(arr) && arr.every(isAssignment);
}

/**
 * Type guard for Question array
 */
export function isQuestionArray(arr: unknown): arr is Question[] {
  return Array.isArray(arr) && arr.every(isQuestion);
}

/**
 * Type guard for Parent array
 */
export function isParentArray(arr: unknown): arr is Parent[] {
  return Array.isArray(arr) && arr.every(isParent);
}
