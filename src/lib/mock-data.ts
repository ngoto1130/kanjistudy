/**
 * Mock Data Generators: Teacher Dashboard Mockup
 *
 * This file contains mock data generators for all teacher dashboard entities.
 * All generators use seeded randomness to ensure consistent data across page refreshes.
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
  MenuItem,
  BreadcrumbItem,
  ProgressFilter,
  StudentProgress,
  NotificationType,
  AssignmentStatus,
} from '@/types/teacher';

// ============================================================================
// Seeded Random Number Generator
// ============================================================================

/**
 * Simple seeded random number generator for consistent mock data
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

const random = seededRandom(12345); // Fixed seed for consistency

/**
 * Get a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

// ============================================================================
// Mock Data Constants
// ============================================================================

const MOCK_STUDENT_NAMES = [
  '佐藤 花子', '鈴木 太郎', '高橋 美咲', '田中 健太', '渡辺 さくら',
  '伊藤 大輔', '山本 結衣', '中村 翔太', '小林 陽子', '加藤 拓海',
  '吉田 愛美', '山田 亮太', '佐々木 莉子', '松本 海斗', '井上 美優',
  '木村 颯太', '林 桜', '斎藤 陸', '清水 優花', '山口 大樹',
  '森 彩乃', '池田 悠人', '橋本 七海', '山崎 優斗', '石川 真央',
  '阿部 航平', '藤田 美月', '西村 颯', '長谷川 菜々子', '近藤 匠',
  '村上 千尋', '遠藤 悠真', '青木 結菜', '坂本 蓮', '岡田 心春',
  '前田 隼人', '藤井 美羽', '上田 大和', '森田 咲良', '原 陸斗',
  '金子 詩織', '石田 樹', '後藤 結月', '小川 颯馬', '藤原 美咲',
  '岡本 蒼空', '三浦 莉緒', '松田 大輝', '竹内 優奈', '中島 颯汰',
];

const MOCK_TEACHER_NAMES = [
  '山田 先生', '田中 先生', '鈴木 先生', '佐藤 先生', '高橋 先生',
  '渡辺 先生', '伊藤 先生', '中村 先生', '小林 先生', '加藤 先生',
];

const MOCK_PARENT_NAMES = [
  '佐藤 洋子', '鈴木 太郎', '高橋 敏夫', '田中 美智子', '渡辺 博',
  '伊藤 恵子', '山本 健一', '中村 幸子', '小林 正樹', '加藤 さゆり',
];

const MOCK_GRADES = ['小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年'];

const MOCK_KANJI_LIST = [
  '日', '月', '火', '水', '木', '金', '土', '一', '二', '三', '四', '五',
  '六', '七', '八', '九', '十', '百', '千', '万', '円', '人', '年', '時',
  '分', '間', '本', '名', '前', '後', '左', '右', '上', '下', '中', '外',
  '国', '学', '校', '生', '先', '字', '文', '読', '書', '言', '語', '話',
];

// ============================================================================
// Mock Data Generators
// ============================================================================

/**
 * Generate mock students
 * @param count Number of students to generate (default: 50)
 */
export function generateMockStudents(count = 50): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const studySessions = randomInt(5, 50);
    const clearedQuestions = randomInt(10, 100);
    const accuracyRate = randomInt(65, 100);
    const daysAgo = randomInt(1, 30);

    students.push({
      id: `student-${String(i + 1).padStart(3, '0')}`,
      name: MOCK_STUDENT_NAMES[i % MOCK_STUDENT_NAMES.length],
      grade: randomItem(MOCK_GRADES),
      studySessions,
      clearedQuestions,
      accuracyRate,
      lastStudyDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  return students;
}

/**
 * Generate mock teachers
 * @param count Number of teachers to generate (default: 10)
 */
export function generateMockTeachers(count = 10): Teacher[] {
  const teachers: Teacher[] = [];

  for (let i = 0; i < count; i++) {
    const sessionCount = randomInt(2, 5);
    const assignedSessions = Array.from(
      { length: sessionCount },
      (_, j) => `session-${i * sessionCount + j + 1}`
    );

    teachers.push({
      id: `teacher-${String(i + 1).padStart(3, '0')}`,
      name: MOCK_TEACHER_NAMES[i % MOCK_TEACHER_NAMES.length],
      email: `teacher${i + 1}@kanjistudy.example.com`,
      assignedSessions,
    });
  }

  return teachers;
}

/**
 * Generate mock notifications
 * @param count Number of notifications to generate (default: 10)
 */
export function generateMockNotifications(count = 10): Notification[] {
  const notifications: Notification[] = [];
  const students = generateMockStudents(50);

  const notificationTemplates: Array<{
    type: NotificationType;
    titleTemplate: string;
    messageTemplate: (studentName: string) => string;
  }> = [
    {
      type: 'assignment-completion',
      titleTemplate: 'Assignment Completed',
      messageTemplate: (name) => `${name}が課題のすべての漢字をクリアしました。新しい課題を作成してください。`,
    },
    {
      type: 'system',
      titleTemplate: 'New Student Registered',
      messageTemplate: (name) => `新しい生徒 ${name} が登録されました。`,
    },
  ];

  for (let i = 0; i < count; i++) {
    const template = notificationTemplates[i % notificationTemplates.length];
    const student = randomItem(students);
    const hoursAgo = randomInt(1, 72);

    notifications.push({
      id: `notif-${String(i + 1).padStart(3, '0')}`,
      type: template.type,
      title: template.titleTemplate,
      message: template.messageTemplate(student.name),
      date: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
      read: random() > 0.5,
      relatedStudentId: template.type === 'assignment-completion' ? student.id : undefined,
    });
  }

  // Sort by date (newest first)
  return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Generate mock assignments
 * @param studentIds Student IDs to create assignments for
 * @param teacherIds Teacher IDs to assign assignments from
 */
export function generateMockAssignments(studentIds: string[], teacherIds: string[]): Assignment[] {
  const assignments: Assignment[] = [];

  // Create 1-3 assignments per student
  studentIds.forEach((studentId, index) => {
    const assignmentCount = randomInt(1, 3);

    for (let i = 0; i < assignmentCount; i++) {
      const kanjiCount = randomInt(10, 30);
      const kanjiList = Array.from({ length: kanjiCount }, () => randomItem(MOCK_KANJI_LIST));
      const daysAgo = randomInt(1, 90);
      const isCompleted = random() > 0.7;

      assignments.push({
        id: `assignment-${String(assignments.length + 1).padStart(3, '0')}`,
        studentId,
        teacherId: teacherIds[index % teacherIds.length],
        kanjiList,
        createdDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        status: (isCompleted ? 'completed' : 'active') as AssignmentStatus,
        completedDate: isCompleted
          ? new Date(Date.now() - randomInt(1, daysAgo) * 24 * 60 * 60 * 1000)
          : undefined,
      });
    }
  });

  return assignments;
}

/**
 * Generate mock questions
 * @param count Number of questions to generate (default: 100)
 */
export function generateMockQuestions(count = 100): Question[] {
  const questions: Question[] = [];

  // Mock readings data
  const mockReadings: Record<string, { onyomi: string[]; kunyomi: string[]; meaning: string }> = {
    '日': { onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], meaning: 'day, sun' },
    '月': { onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], meaning: 'month, moon' },
    '火': { onyomi: ['カ'], kunyomi: ['ひ'], meaning: 'fire' },
    '水': { onyomi: ['スイ'], kunyomi: ['みず'], meaning: 'water' },
    '木': { onyomi: ['モク', 'ボク'], kunyomi: ['き', 'こ'], meaning: 'tree, wood' },
    '金': { onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'], meaning: 'gold, money' },
    '土': { onyomi: ['ド', 'ト'], kunyomi: ['つち'], meaning: 'soil, earth' },
  };

  for (let i = 0; i < count; i++) {
    const kanji = MOCK_KANJI_LIST[i % MOCK_KANJI_LIST.length];
    const readingData = mockReadings[kanji] || {
      onyomi: ['unknown'],
      kunyomi: ['unknown'],
      meaning: 'unknown'
    };

    questions.push({
      id: `question-${String(i + 1).padStart(3, '0')}`,
      kanji,
      readings: readingData,
      meaning: readingData.meaning,
      consecutiveCorrect: randomInt(0, 5),
      lastAnsweredDate: random() > 0.3
        ? new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000)
        : undefined,
    });
  }

  return questions;
}

/**
 * Generate mock parents
 * @param studentIds Student IDs to assign parents to
 */
export function generateMockParents(studentIds: string[]): Parent[] {
  const parents: Parent[] = [];

  // Create 1 parent per 2-3 students
  const studentsPerParent = 2;
  const parentCount = Math.ceil(studentIds.length / studentsPerParent);

  for (let i = 0; i < parentCount; i++) {
    const startIdx = i * studentsPerParent;
    const endIdx = Math.min(startIdx + studentsPerParent, studentIds.length);
    const assignedStudents = studentIds.slice(startIdx, endIdx);

    parents.push({
      id: `parent-${String(i + 1).padStart(3, '0')}`,
      name: MOCK_PARENT_NAMES[i % MOCK_PARENT_NAMES.length],
      email: `parent${i + 1}@example.com`,
      phone: `090-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
      studentIds: assignedStudents,
    });
  }

  return parents;
}

/**
 * Get teacher menu items
 * Returns the 6 menu items for teacher dashboard navigation
 */
export function getTeacherMenuItems(): MenuItem[] {
  return [
    {
      title: 'Assignment Creation',
      description: 'Create and manage kanji assignments for students',
      href: '/teacher/assignments',
      icon: 'assignment',
    },
    {
      title: 'Question Management',
      description: 'Manage kanji questions and learning content',
      href: '/teacher/questions',
      icon: 'question',
    },
    {
      title: 'Student Management',
      description: 'Manage student accounts and information',
      href: '/teacher/students',
      icon: 'students',
    },
    {
      title: 'Parent Management',
      description: 'Manage parent accounts and communications',
      href: '/teacher/parents',
      icon: 'parents',
    },
    {
      title: 'Learning Status Report',
      description: 'View detailed learning analytics and reports',
      href: '/teacher/reports',
      icon: 'reports',
    },
    {
      title: 'Administrator Functions',
      description: 'Access administrative settings and system configuration',
      href: '/teacher/admin',
      icon: 'admin',
    },
  ];
}

/**
 * Generate breadcrumb items from pathname
 * @param pathname Current page pathname (e.g., '/teacher/assignments')
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/teacher/dashboard', isCurrent: false },
  ];

  // Map pathnames to labels
  const pathLabels: Record<string, string> = {
    '/teacher/dashboard': 'Dashboard',
    '/teacher/assignments': 'Assignment Creation',
    '/teacher/questions': 'Question Management',
    '/teacher/students': 'Student Management',
    '/teacher/parents': 'Parent Management',
    '/teacher/reports': 'Learning Status Report',
    '/teacher/admin': 'Administrator Functions',
  };

  // If not on dashboard, add current page
  if (pathname !== '/teacher/dashboard') {
    const label = pathLabels[pathname] || 'Unknown Page';
    breadcrumbs.push({ label, href: pathname, isCurrent: true });
  } else {
    // Mark dashboard as current
    breadcrumbs[0].isCurrent = true;
  }

  return breadcrumbs;
}

/**
 * Apply progress filter to students
 * In mockup, this returns StudentProgress with original metrics (no actual filtering)
 * @param students Student array to filter
 * @param filter Progress filter settings
 */
export function applyProgressFilter(students: Student[], filter: ProgressFilter): StudentProgress[] {
  // In mockup, filter is ignored - just transform students to StudentProgress
  return students.map(student => ({
    student,
    metrics: {
      studySessions: student.studySessions,
      clearedQuestions: student.clearedQuestions,
      accuracyRate: student.accuracyRate,
    },
  }));
}
