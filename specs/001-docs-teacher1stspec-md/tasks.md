# Tasks: Teacher Dashboard Mockup

**Input**: Design documents from `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/001-docs-teacher1stspec-md/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/component-contracts.ts ✅

## Execution Flow (main)
```
1. ✅ Load plan.md from feature directory
   → Tech stack: Next.js 15.5, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
   → Structure: App Router, src/app/teacher/*, src/components/teacher/
2. ✅ Load design documents:
   → data-model.md: 7 entities (Teacher, Student, Progress, Notification, Assignment, Question, Parent)
   → contracts/component-contracts.ts: 5 component contracts (ProgressTable, NotificationsList, MenuGrid, BreadcrumbNav, LoginForm)
   → quickstart.md: 9 validation scenarios
3. ✅ Generate tasks by category:
   → Setup: Type definitions, mock data, shadcn/ui components
   → Tests: Component contract tests (TDD - tests first!)
   → Core: Component implementations
   → Pages: Page tests and implementations
   → Integration: Navigation tests, responsive tests
   → Polish: E2E tests, build validation, quickstart validation
4. ✅ Apply task rules:
   → Different files/components = [P] parallel
   → Same file = sequential
   → Tests before implementation (TDD)
5. ✅ Tasks numbered T001-T040
6. ✅ Dependencies validated
7. ✅ Parallel execution examples provided
8. ✅ Task completeness validated
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Exact file paths included in descriptions

---

## Phase 3.1: Setup & Foundation

### [X] T001 - Create TypeScript type definitions
**File**: `src/types/teacher.ts`
**Description**: Create all TypeScript types and interfaces from data-model.md and contracts/component-contracts.ts (Teacher, Student, Progress, Notification, Assignment, Question, Parent, component prop types)
**Dependencies**: None
**Parallel**: No (single file foundation)

### [X] T002 - Create mock data generators
**File**: `src/lib/mock-data.ts`
**Description**: Implement mock data generators for all entities with seeded randomness (~50 students, ~10 teachers, notifications, assignments, questions, parents, menu items, breadcrumbs)
**Dependencies**: T001 (needs types)
**Parallel**: No

### [X] T003 - Create type guards
**File**: `src/lib/type-guards.ts`
**Description**: Implement runtime type guard functions (isStudent, isTeacher, isNotification, isAssignment, isQuestion, isParent)
**Dependencies**: T001 (needs types)
**Parallel**: No

---

## Phase 3.2: shadcn/ui Component Installation [P]

**CRITICAL**: These can run in parallel as they install to different locations

### [X] T004 [P] - Install shadcn/ui Table component
**Command**: Use `mcp__shadcn__getComponent` and install Table component
**Description**: Install shadcn/ui Table component for ProgressTable desktop view
**Dependencies**: None
**Parallel**: Yes (independent installation)

### [X] T005 [P] - Install shadcn/ui Card component
**Command**: Use `mcp__shadcn__getComponent` and install Card component
**Description**: Install shadcn/ui Card component for MenuGrid, NotificationsList, mobile table cards
**Dependencies**: None
**Parallel**: Yes (independent installation)

### [X] T006 [P] - Install shadcn/ui Button component
**Command**: Use `mcp__shadcn__getComponent` and install Button component
**Description**: Install shadcn/ui Button component for LoginForm and navigation
**Dependencies**: None
**Parallel**: Yes (independent installation)

### [X] T007 [P] - Install shadcn/ui Badge component
**Command**: Use `mcp__shadcn__getComponent` and install Badge component
**Description**: Install shadcn/ui Badge component for notification type indicators
**Dependencies**: None
**Parallel**: Yes (independent installation)

### [X] T008 [P] - Install shadcn/ui Breadcrumb component
**Command**: Use `mcp__shadcn__getComponent` and install Breadcrumb component
**Description**: Install shadcn/ui Breadcrumb component for BreadcrumbNav
**Dependencies**: None
**Parallel**: Yes (independent installation)

### [X] T009 [P] - Install shadcn/ui Select component
**Command**: Use `mcp__shadcn__getComponent` and install Select component
**Description**: Install shadcn/ui Select component for time period filters
**Dependencies**: None
**Parallel**: Yes (independent installation)

---

## Phase 3.3: Component Contract Tests (TDD - Tests First!) [P]

**CRITICAL**: These tests MUST be written and MUST FAIL before ANY component implementation

### [X] T010 [P] - Write failing test for ProgressTable component
**File**: `__tests__/components/teacher/progress-table.test.tsx`
**Description**: Write contract test verifying ProgressTable renders student progress data, shows empty state, applies filters, calls onFilterChange, and has responsive layout (table on md+, cards on mobile)
**Dependencies**: T001-T003 (needs types and mock data)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (component not implemented yet)

### [X] T011 [P] - Write failing test for NotificationsList component
**File**: `__tests__/components/teacher/notifications-list.test.tsx`
**Description**: Write contract test verifying NotificationsList renders notifications, shows correct type icons, displays empty state, calls onNotificationClick, formats dates, and distinguishes read/unread
**Dependencies**: T001-T003 (needs types and mock data)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (component not implemented yet)

### [X] T012 [P] - Write failing test for MenuGrid component
**File**: `__tests__/components/teacher/menu-grid.test.tsx`
**Description**: Write contract test verifying MenuGrid renders 6 menu items, links navigate correctly, responsive grid (1 col mobile, 2 col tablet, 3 col desktop), and touch targets >= 44px
**Dependencies**: T001-T003 (needs types and mock data)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (component not implemented yet)

### [X] T013 [P] - Write failing test for BreadcrumbNav component
**File**: `__tests__/components/teacher/breadcrumb-nav.test.tsx`
**Description**: Write contract test verifying BreadcrumbNav renders breadcrumb items, current item is plain text, non-current items are links, separators present, compact on mobile
**Dependencies**: T001-T003 (needs types and mock data)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (component not implemented yet)

### [X] T014 [P] - Write failing test for LoginForm component
**File**: `__tests__/components/teacher/login-form.test.tsx`
**Description**: Write contract test verifying LoginForm renders email input, calls onSubmit with email, pre-fills defaultEmail, shows loading state, validates email format
**Dependencies**: T001-T003 (needs types and mock data)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (component not implemented yet)

---

## Phase 3.4: TDD Checkpoint 1
**GATE**: Run all component tests and verify they FAIL (Red phase)
```bash
npm test -- __tests__/components/teacher/
```
**Expected Output**: 5 test suites failed (ProgressTable, NotificationsList, MenuGrid, BreadcrumbNav, LoginForm)
**Action**: If any test PASSES, investigate and fix the test to ensure it's actually testing the component contract

---

## Phase 3.5: Component Implementations (Make Tests Pass) [P]

**CRITICAL**: Implement components to pass tests WITHOUT modifying tests

### [X] T015 [P] - Implement ProgressTable component
**File**: `src/components/teacher/progress-table.tsx`
**Description**: Implement ProgressTable to pass contract tests - render student progress data, empty state, filter controls, responsive layout (table desktop, cards mobile)
**Dependencies**: T010 (test must fail first), T004 (Table), T005 (Card), T009 (Select)
**Parallel**: Yes (independent component file)
**Expected**: ✅ Tests in T010 now PASS

### [X] T016 [P] - Implement NotificationsList component
**File**: `src/components/teacher/notifications-list.tsx`
**Description**: Implement NotificationsList to pass contract tests - render notifications with type icons, empty state, click handlers, date formatting, read/unread styling
**Dependencies**: T011 (test must fail first), T005 (Card), T007 (Badge)
**Parallel**: Yes (independent component file)
**Expected**: ✅ Tests in T011 now PASS

### [X] T017 [P] - Implement MenuGrid component
**File**: `src/components/teacher/menu-grid.tsx`
**Description**: Implement MenuGrid to pass contract tests - render 6 menu cards, navigation links, responsive grid (1/2/3 columns), touch targets >= 44px
**Dependencies**: T012 (test must fail first), T005 (Card), T006 (Button)
**Parallel**: Yes (independent component file)
**Expected**: ✅ Tests in T012 now PASS

### [X] T018 [P] - Implement BreadcrumbNav component (Client Component)
**File**: `src/components/teacher/breadcrumb-nav.tsx`
**Description**: Implement BreadcrumbNav to pass contract tests - use 'use client', usePathname hook, render breadcrumb items, current item as text, links for non-current, compact mobile
**Dependencies**: T013 (test must fail first), T008 (Breadcrumb)
**Parallel**: Yes (independent component file)
**Expected**: ✅ Tests in T013 now PASS

### [X] T019 [P] - Implement LoginForm component (Client Component)
**File**: `src/components/teacher/login-form.tsx`
**Description**: Implement LoginForm to pass contract tests - use 'use client', email input, onSubmit handler, defaultEmail, loading state, email validation
**Dependencies**: T014 (test must fail first), T006 (Button)
**Parallel**: Yes (independent component file)
**Expected**: ✅ Tests in T014 now PASS

---

## Phase 3.6: TDD Checkpoint 2
**GATE**: Run all component tests and verify they PASS (Green phase)
```bash
npm test -- __tests__/components/teacher/
```
**Expected Output**: 5 test suites passed (ProgressTable, NotificationsList, MenuGrid, BreadcrumbNav, LoginForm)
**Action**: If any test FAILS, fix the component implementation (NOT the test) until all pass

---

## Phase 3.7: Page Contract Tests (TDD - Tests First!) [P]

**CRITICAL**: These tests MUST be written and MUST FAIL before ANY page implementation

### T020 [P] - Write failing test for login page
**File**: `__tests__/pages/teacher/login.test.tsx`
**Description**: Write test verifying login page renders LoginForm, has correct metadata (title: "Teacher Login - KanjiStudy"), and redirects to dashboard on submit
**Dependencies**: T019 (LoginForm implemented)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T021 [P] - Write failing test for dashboard page
**File**: `__tests__/pages/teacher/dashboard.test.tsx`
**Description**: Write test verifying dashboard page renders ProgressTable, NotificationsList, MenuGrid, loads mock data (50 students), has correct metadata
**Dependencies**: T015-T017 (components implemented)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T022 [P] - Write failing test for assignments page
**File**: `__tests__/pages/teacher/assignments.test.tsx`
**Description**: Write test verifying assignments page renders mockup content, has breadcrumb "Dashboard > Assignment Creation", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T023 [P] - Write failing test for questions page
**File**: `__tests__/pages/teacher/questions.test.tsx`
**Description**: Write test verifying questions page renders mockup content, breadcrumb "Dashboard > Question Management", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T024 [P] - Write failing test for students page
**File**: `__tests__/pages/teacher/students.test.tsx`
**Description**: Write test verifying students page renders mockup content, breadcrumb "Dashboard > Student Management", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T025 [P] - Write failing test for parents page
**File**: `__tests__/pages/teacher/parents.test.tsx`
**Description**: Write test verifying parents page renders mockup content, breadcrumb "Dashboard > Parent Management", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T026 [P] - Write failing test for reports page
**File**: `__tests__/pages/teacher/reports.test.tsx`
**Description**: Write test verifying reports page renders mockup content, breadcrumb "Dashboard > Learning Status Report", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

### T027 [P] - Write failing test for admin page
**File**: `__tests__/pages/teacher/admin.test.tsx`
**Description**: Write test verifying admin page renders mockup content, breadcrumb "Dashboard > Administrator Functions", correct metadata
**Dependencies**: T018 (BreadcrumbNav)
**Parallel**: Yes (independent test file)
**Expected**: ❌ MUST FAIL (page not implemented yet)

---

## Phase 3.8: TDD Checkpoint 3
**GATE**: Run all page tests and verify they FAIL (Red phase)
```bash
npm test -- __tests__/pages/teacher/
```
**Expected Output**: 8 test suites failed (login, dashboard, assignments, questions, students, parents, reports, admin)
**Action**: If any test PASSES, investigate and fix the test

---

## Phase 3.9: Page Implementations (Make Tests Pass) [P]

**CRITICAL**: Implement pages to pass tests WITHOUT modifying tests

### T028 [P] - Implement login page
**File**: `src/app/teacher/login/page.tsx`
**Description**: Implement login page (Server Component) rendering LoginForm, export metadata, mock redirect to dashboard on submit
**Dependencies**: T020 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T020 now PASS

### T029 - Implement dashboard page
**File**: `src/app/teacher/dashboard/page.tsx`
**Description**: Implement dashboard page (Server Component) rendering ProgressTable, NotificationsList, MenuGrid, load mock data (50 students), export metadata
**Dependencies**: T021 (test must fail first)
**Parallel**: No (wait for T028 to avoid route conflicts)
**Expected**: ✅ Tests in T021 now PASS

### T030 [P] - Implement assignments page
**File**: `src/app/teacher/assignments/page.tsx`
**Description**: Implement assignments page mockup content, export metadata (title: "Assignment Creation - Teacher Dashboard - KanjiStudy")
**Dependencies**: T022 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T022 now PASS

### T031 [P] - Implement questions page
**File**: `src/app/teacher/questions/page.tsx`
**Description**: Implement questions page mockup content, export metadata (title: "Question Management - Teacher Dashboard - KanjiStudy")
**Dependencies**: T023 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T031 now PASS

### T032 [P] - Implement students page
**File**: `src/app/teacher/students/page.tsx`
**Description**: Implement students page mockup content, export metadata (title: "Student Management - Teacher Dashboard - KanjiStudy")
**Dependencies**: T024 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T024 now PASS

### T033 [P] - Implement parents page
**File**: `src/app/teacher/parents/page.tsx`
**Description**: Implement parents page mockup content, export metadata (title: "Parent Management - Teacher Dashboard - KanjiStudy")
**Dependencies**: T025 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T025 now PASS

### T034 [P] - Implement reports page
**File**: `src/app/teacher/reports/page.tsx`
**Description**: Implement reports page mockup content, export metadata (title: "Learning Status Report - Teacher Dashboard - KanjiStudy")
**Dependencies**: T026 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T026 now PASS

### T035 [P] - Implement admin page
**File**: `src/app/teacher/admin/page.tsx`
**Description**: Implement admin page mockup content, export metadata (title: "Administrator Functions - Teacher Dashboard - KanjiStudy")
**Dependencies**: T027 (test must fail first)
**Parallel**: Yes (independent page file)
**Expected**: ✅ Tests in T027 now PASS

### T036 - Implement teacher layout with breadcrumbs
**File**: `src/app/teacher/layout.tsx`
**Description**: Implement teacher layout (wraps all /teacher/* pages) rendering BreadcrumbNav component, consistent header/navigation
**Dependencies**: T028-T035 (pages implemented)
**Parallel**: No (wraps all teacher pages, implement after pages)
**Expected**: ✅ Breadcrumbs appear on all teacher pages

---

## Phase 3.10: TDD Checkpoint 4
**GATE**: Run all page tests and verify they PASS (Green phase)
```bash
npm test -- __tests__/pages/teacher/
```
**Expected Output**: 8 test suites passed (login, dashboard, assignments, questions, students, parents, reports, admin)
**Action**: If any test FAILS, fix the page implementation (NOT the test) until all pass

---

## Phase 3.11: Integration Tests (Sequential - after pages)

### T037 - Write navigation integration test
**File**: `__tests__/integration/teacher-navigation.test.tsx`
**Description**: Write integration test verifying: login → dashboard navigation, dashboard → each menu page navigation, breadcrumb navigation back to dashboard, mock data consistency across pages
**Dependencies**: T036 (all pages and layout implemented)
**Parallel**: No (tests cross-page navigation)

### T038 - Write responsive layout integration test
**File**: `__tests__/integration/teacher-responsive.test.tsx`
**Description**: Write integration test verifying responsive behavior at mobile (375px), tablet (768px), desktop (1280px) - table/cards transformation, menu grid columns, breadcrumb compact/full
**Dependencies**: T036 (all pages implemented)
**Parallel**: No (tests layout behavior)

### T039 - Write empty state integration test
**File**: `__tests__/integration/teacher-empty-states.test.tsx`
**Description**: Write integration test verifying empty states: no students (progress table shows "No student data available"), no notifications (shows "No new notifications"), menu grid always shows 6 items
**Dependencies**: T036 (all pages implemented)
**Parallel**: No (tests data edge cases)

---

## Phase 3.12: Final Validation (Sequential - last steps)

### T040 - Run all tests and verify 100% pass rate
**Command**: `npm test`
**Description**: Run all component tests, page tests, integration tests - verify all pass with no errors
**Dependencies**: T037-T039 (all tests implemented)
**Parallel**: No (validation gate)
**Expected**: ✅ All test suites pass

### T041 - Run production build
**Command**: `npm run build`
**Description**: Verify production build succeeds with no TypeScript errors, no build warnings
**Dependencies**: T040 (tests pass)
**Parallel**: No (validation gate)
**Expected**: ✅ Build completes successfully

### T042 - Run linting
**Command**: `npm run lint`
**Description**: Verify no ESLint errors or warnings
**Dependencies**: T041 (build succeeds)
**Parallel**: No (validation gate)
**Expected**: ✅ No linting errors

### T043 - Manual quickstart validation (9 scenarios)
**File**: `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/001-docs-teacher1stspec-md/quickstart.md`
**Description**: Execute all 9 quickstart scenarios manually: (1) Teacher login flow, (2) Dashboard progress table, (3) Dashboard notifications, (4) Dashboard menu grid, (5) Navigation to menu pages, (6) Responsive mobile, (7) Responsive tablet, (8) Responsive desktop, (9) Empty states
**Dependencies**: T042 (linting passes)
**Parallel**: No (manual validation)
**Expected**: ✅ All 9 scenarios validated

---

## Dependencies Graph

```
Foundation Layer:
T001 (types) ─┬─→ T002 (mock data) ─→ T003 (type guards)
              └─→ T010-T014 (component tests)

shadcn/ui Layer (Parallel):
[T004, T005, T006, T007, T008, T009] ─→ T015-T019 (component implementations)

Component Tests Layer (TDD - Parallel):
T001-T003 ─→ [T010, T011, T012, T013, T014] ─→ Checkpoint 1 (tests FAIL)

Component Implementation Layer (Parallel):
[T010, T004, T005, T009] ─→ T015 (ProgressTable)
[T011, T005, T007] ─→ T016 (NotificationsList)
[T012, T005, T006] ─→ T017 (MenuGrid)
[T013, T008] ─→ T018 (BreadcrumbNav)
[T014, T006] ─→ T019 (LoginForm)
─→ Checkpoint 2 (tests PASS)

Page Tests Layer (TDD - Parallel):
T019 ─→ T020 (login test)
T015-T017 ─→ T021 (dashboard test)
T018 ─→ [T022, T023, T024, T025, T026, T027] (menu page tests)
─→ Checkpoint 3 (tests FAIL)

Page Implementation Layer:
T020 ─→ T028 (login page) ─→ T029 (dashboard page)
[T022-T027] ─→ [T030-T035] (menu pages) ─→ T036 (layout)
─→ Checkpoint 4 (tests PASS)

Integration Layer (Sequential):
T036 ─→ T037 (navigation test) ─→ T038 (responsive test) ─→ T039 (empty state test)

Validation Layer (Sequential):
T039 ─→ T040 (all tests) ─→ T041 (build) ─→ T042 (lint) ─→ T043 (quickstart)
```

---

## Parallel Execution Examples

### Example 1: Install all shadcn/ui components together (T004-T009)
```bash
# Launch 6 tasks in parallel:
mcp__shadcn__getComponent("table") && install
mcp__shadcn__getComponent("card") && install
mcp__shadcn__getComponent("button") && install
mcp__shadcn__getComponent("badge") && install
mcp__shadcn__getComponent("breadcrumb") && install
mcp__shadcn__getComponent("select") && install
```

### Example 2: Write all component contract tests together (T010-T014)
```
Task: "Write failing test for ProgressTable in __tests__/components/teacher/progress-table.test.tsx"
Task: "Write failing test for NotificationsList in __tests__/components/teacher/notifications-list.test.tsx"
Task: "Write failing test for MenuGrid in __tests__/components/teacher/menu-grid.test.tsx"
Task: "Write failing test for BreadcrumbNav in __tests__/components/teacher/breadcrumb-nav.test.tsx"
Task: "Write failing test for LoginForm in __tests__/components/teacher/login-form.test.tsx"
```

### Example 3: Implement all components together (T015-T019)
```
Task: "Implement ProgressTable in src/components/teacher/progress-table.tsx to pass T010 tests"
Task: "Implement NotificationsList in src/components/teacher/notifications-list.tsx to pass T011 tests"
Task: "Implement MenuGrid in src/components/teacher/menu-grid.tsx to pass T012 tests"
Task: "Implement BreadcrumbNav in src/components/teacher/breadcrumb-nav.tsx to pass T013 tests"
Task: "Implement LoginForm in src/components/teacher/login-form.tsx to pass T014 tests"
```

### Example 4: Write all page tests together (T020-T027)
```
Task: "Write failing test for login page in __tests__/pages/teacher/login.test.tsx"
Task: "Write failing test for dashboard page in __tests__/pages/teacher/dashboard.test.tsx"
Task: "Write failing test for assignments page in __tests__/pages/teacher/assignments.test.tsx"
Task: "Write failing test for questions page in __tests__/pages/teacher/questions.test.tsx"
Task: "Write failing test for students page in __tests__/pages/teacher/students.test.tsx"
Task: "Write failing test for parents page in __tests__/pages/teacher/parents.test.tsx"
Task: "Write failing test for reports page in __tests__/pages/teacher/reports.test.tsx"
Task: "Write failing test for admin page in __tests__/pages/teacher/admin.test.tsx"
```

### Example 5: Implement all menu pages together (T030-T035)
```
Task: "Implement assignments page in src/app/teacher/assignments/page.tsx"
Task: "Implement questions page in src/app/teacher/questions/page.tsx"
Task: "Implement students page in src/app/teacher/students/page.tsx"
Task: "Implement parents page in src/app/teacher/parents/page.tsx"
Task: "Implement reports page in src/app/teacher/reports/page.tsx"
Task: "Implement admin page in src/app/teacher/admin/page.tsx"
```

---

## TDD Workflow Summary

1. **Red Phase** (Write failing tests):
   - T010-T014: Component contract tests → Run tests → ❌ All FAIL
   - T020-T027: Page tests → Run tests → ❌ All FAIL

2. **Green Phase** (Make tests pass):
   - T015-T019: Component implementations → Run tests → ✅ All PASS
   - T028-T036: Page implementations → Run tests → ✅ All PASS

3. **Refactor Phase** (Optional - not planned as separate tasks):
   - During implementation, refactor as needed while keeping tests green
   - No test modifications allowed during this phase

4. **Integration Phase** (Verify everything works together):
   - T037-T039: Integration tests → ✅ All PASS
   - T040-T043: Final validation → ✅ All PASS

---

## Validation Checklist
*GATE: Verified before task execution*

- ✅ All contracts have corresponding tests (T010-T014 cover all 5 component contracts)
- ✅ All entities have type definitions (T001 covers all 7 entities from data-model.md)
- ✅ All tests come before implementation (T010-T014 before T015-T019, T020-T027 before T028-T036)
- ✅ Parallel tasks are truly independent (different files, no shared state)
- ✅ Each task specifies exact file path (all tasks include file paths)
- ✅ No task modifies same file as another [P] task (verified in dependency graph)
- ✅ All quickstart scenarios covered (T043 validates all 9 scenarios from quickstart.md)
- ✅ shadcn/ui components installed before use (T004-T009 before T015-T019)
- ✅ TDD checkpoints enforce test-first workflow (4 checkpoints: 2 Red, 2 Green)

---

## Notes

- **Total Tasks**: 43 tasks (T001-T043)
- **Parallel Tasks**: 29 tasks marked [P] (67% parallelizable)
- **TDD Checkpoints**: 4 critical gates (Red → Green → Red → Green)
- **Validation Gates**: 3 final gates (tests → build → lint → quickstart)
- **Estimated Timeline**:
  - Setup: 1-2 hours (T001-T009)
  - Component TDD: 3-4 hours (T010-T019)
  - Page TDD: 3-4 hours (T020-T036)
  - Integration: 2-3 hours (T037-T039)
  - Validation: 1 hour (T040-T043)
  - **Total**: 10-14 hours for experienced developer

---

**Tasks Status**: ✅ READY FOR EXECUTION - 43 tasks generated, dependencies validated, TDD workflow enforced, parallel execution optimized
