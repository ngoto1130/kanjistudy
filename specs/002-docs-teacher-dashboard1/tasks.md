# Tasks: Teacher Dashboard Authentication and Navigation

**Input**: Design documents from `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/002-docs-teacher-dashboard1/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/auth-api.yaml, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript, Next.js 15.5, React 19, Tailwind CSS 4
   → Libraries: shadcn/ui, next/font, Jest, React Testing Library
2. Load design documents ✓
   → data-model.md: 4 entities (Teacher, Session, MenuItem, RouteProtection)
   → contracts/: auth-api.yaml (3 endpoints: login, logout, session)
   → quickstart.md: 11 test scenarios
3. Generate tasks by category ✓
4. Apply TDD ordering: Tests before implementation ✓
5. Mark [P] for parallel execution ✓
6. Number tasks sequentially (T001, T002...) ✓
7. Validate task completeness ✓
8. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Next.js App Router single project structure
- Source: `src/app/`, `src/components/`, `src/lib/`, `src/types/`
- Tests: `__tests__/contract/`, `__tests__/integration/`, `__tests__/unit/`

---

## Phase 3.1: Setup & Dependencies

- [ ] **T001** Verify Next.js 15.5 project structure matches plan.md (src/app/, src/components/, src/lib/, src/types/, __tests__/)
- [ ] **T002** Install shadcn/ui CLI if not already installed (`npx shadcn@latest init`)
- [ ] **T003** Configure Jest for Next.js 15 App Router (jest.config.js, jest.setup.js)
- [ ] **T004** [P] Install test dependencies: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- [ ] **T005** [P] Create __tests__ directory structure (contract/, integration/, unit/)

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (API Endpoints)
- [ ] **T006** [P] Write failing contract test for POST /api/auth/login in `__tests__/contract/auth-login.test.ts`
  - Test valid credentials → 200 + cookies + teacher object
  - Test invalid credentials → 401 + error message
  - Test missing fields → 400 + validation error
  - Verify response schema matches auth-api.yaml

- [ ] **T007** [P] Write failing contract test for POST /api/auth/logout in `__tests__/contract/auth-logout.test.ts`
  - Test with valid session → 200 + cookies cleared
  - Test without session → 401 + error message
  - Verify response schema matches auth-api.yaml

- [ ] **T008** [P] Write failing contract test for GET /api/auth/session in `__tests__/contract/auth-session.test.ts`
  - Test with valid access token → 200 + session valid
  - Test with expired access token but valid refresh → 200 + new access token
  - Test with both tokens expired → 401 + error
  - Verify response schema matches auth-api.yaml

### Integration Tests (User Stories)
- [ ] **T009** [P] Write failing integration test for Scenario 1 (successful login flow) in `__tests__/integration/teacher-login.test.tsx`
  - Render login page
  - Fill email: teacher1@teacher.com, password: Password!
  - Click login button
  - Assert redirect to /teacher/dashboard
  - Assert cookies set (session_access_token, session_refresh_token)

- [ ] **T010** [P] Write failing integration test for Scenario 2 (invalid credentials) in `__tests__/integration/teacher-login-error.test.tsx`
  - Render login page
  - Fill invalid credentials
  - Click login button
  - Assert remain on /login page
  - Assert error message displayed

- [ ] **T011** [P] Write failing integration test for Scenario 3-7 (navigation flows) in `__tests__/integration/teacher-navigation.test.tsx`
  - Mock authenticated session
  - Test navigation to /teacher/assignments
  - Test Problem Management dropdown (2 items)
  - Test User Management dropdown (2 items)
  - Test Reports dropdown (3 items)
  - Test Administrative Functions link

- [ ] **T012** [P] Write failing integration test for Scenario 8 (unauthorized access) in `__tests__/integration/access-control.test.tsx`
  - Clear session cookies
  - Attempt to access /teacher/dashboard
  - Assert redirect to /error page
  - Assert error message displayed
  - Repeat for other protected routes

- [ ] **T013** [P] Write failing integration test for Scenario 9 (logout) in `__tests__/integration/teacher-logout.test.tsx`
  - Mock authenticated session
  - Render dashboard with navigation
  - Click logout button
  - Assert redirect to /login
  - Assert cookies cleared
  - Attempt to access protected route → redirect to /error

- [ ] **T014** [P] Write failing integration test for Scenario 10 (responsive design) in `__tests__/integration/responsive-navigation.test.tsx`
  - Test mobile viewport (375px): hamburger menu + drawer
  - Test tablet viewport (768px): transitional layout
  - Test desktop viewport (1280px): horizontal navigation
  - Assert touch targets ≥ 44x44px on mobile

### Unit Tests (Utilities)
- [ ] **T015** [P] Write failing unit tests for auth utilities in `__tests__/unit/auth.test.ts`
  - validateCredentials(email, password) → true/false
  - createTokens(teacherEmail) → { accessToken, refreshToken, expiresAt }
  - verifyToken(token) → { valid, expired, payload }
  - Test edge cases: empty strings, invalid formats, expired tokens

- [ ] **T016** [P] Write failing unit tests for session utilities in `__tests__/unit/session.test.ts`
  - createSession(teacher) → Session object with correct expiration times
  - validateSession(accessToken, refreshToken) → session state (Active, Refreshable, Expired)
  - refreshSession(refreshToken) → new access token
  - Test 30min access token expiration, 28day refresh token expiration

---

## Phase 3.2.1: Commit Failing Tests ⚠️ BLOCKING
- [ ] **T017** Run all tests and verify they FAIL (npm test)
  - All contract tests should fail (no API routes exist yet)
  - All integration tests should fail (no components/pages exist yet)
  - All unit tests should fail (no utilities exist yet)
  - This is EXPECTED and REQUIRED for TDD

- [ ] **T018** Commit failing tests with message: "test: add failing tests for teacher authentication and navigation"
  - Stage: `__tests__/contract/`, `__tests__/integration/`, `__tests__/unit/`
  - Verify: `npm run build` still succeeds (tests can fail, but build should pass)
  - Push to branch: 002-docs-teacher-dashboard1

---

## Phase 3.3: Core Implementation (ONLY after T018 complete)

### Type Definitions
- [ ] **T019** Define TypeScript types in `src/types/auth.ts`
  - Teacher interface (email, password, name)
  - Session interface (accessToken, refreshToken, teacherEmail, issuedAt, expiresAt)
  - MenuItem interface (id, label, href?, children?, order)
  - RouteProtection interface (pattern, requiresAuth, redirectOnFail)

### Utility Functions
- [ ] **T020** Implement auth utilities in `src/lib/auth.ts`
  - validateCredentials(email, password): boolean - check against hardcoded teacher
  - createTokens(teacherEmail): { accessToken, refreshToken, expiresAt } - use crypto.randomBytes()
  - verifyToken(token): { valid, expired, payload } - simple token validation (no JWT for prototype)
  - HARDCODED_TEACHER constant

- [ ] **T021** Implement session utilities in `src/lib/session.ts`
  - createSession(teacher): Session - generate tokens with 30min/28day expiration
  - validateSession(accessToken, refreshToken): SessionState - check expiration times
  - refreshSession(refreshToken): new access token - issue new 30min token
  - Session state enum: Active, Refreshable, Expired, Invalidated

### API Routes
- [ ] **T022** Implement POST /api/auth/login in `src/app/api/auth/login/route.ts`
  - Validate request body (email, password)
  - Call validateCredentials() from lib/auth.ts
  - If valid: createSession(), set httpOnly cookies, return 200 + teacher + expiresAt
  - If invalid: return 401 + error message
  - Cookie options: httpOnly=true, secure=true (production), sameSite=strict, maxAge

- [ ] **T023** Implement POST /api/auth/logout in `src/app/api/auth/logout/route.ts`
  - Check for existing session cookies
  - Clear both cookies (set Max-Age=0)
  - Return 200 + success message

- [ ] **T024** Implement GET /api/auth/session in `src/app/api/auth/session/route.ts`
  - Read access_token and refresh_token from cookies
  - Call validateSession() from lib/session.ts
  - If Active: return 200 + session valid
  - If Refreshable: refreshSession(), set new access_token cookie, return 200 + refreshed=true
  - If Expired: return 401 + error

### Middleware (Route Protection)
- [ ] **T025** Implement Next.js middleware in `src/middleware.ts`
  - Export config with matcher: ['/teacher/:path*']
  - Read access_token from cookies
  - If valid: allow request
  - If invalid: redirect to /error page
  - Use NextResponse.redirect()

### UI Components (shadcn/ui)
- [ ] **T026** Install shadcn/ui Button component (`npx shadcn@latest add button`)
  - Verify 'use client' directive is present in src/components/ui/button.tsx

- [ ] **T027** Install shadcn/ui NavigationMenu component (`npx shadcn@latest add navigation-menu`)
  - Verify 'use client' directive is present
  - Component will be used for desktop navigation

- [ ] **T028** Install shadcn/ui Sheet component (`npx shadcn@latest add sheet`)
  - Verify 'use client' directive is present
  - Component will be used for mobile drawer

- [ ] **T029** Install shadcn/ui Input component (`npx shadcn@latest add input`)
  - Used for login form email/password fields

- [ ] **T030** Install shadcn/ui Form components (`npx shadcn@latest add form`)
  - Used for login form validation and error handling

### Navigation Components
- [ ] **T031** Create desktop navigation menu in `src/components/ui/teacher-nav.tsx`
  - 'use client' directive (uses state for dropdowns)
  - Use shadcn/ui NavigationMenu component
  - Implement MENU_ITEMS structure from data-model.md
  - 5 top-level items: Assignments, Problem Management, User Management, Reports, Admin
  - Dropdowns for: Problem Management (2), User Management (2), Reports (3)
  - Logout button that calls POST /api/auth/logout then redirects
  - Desktop only: hidden on mobile (md:flex)

- [ ] **T032** Create mobile navigation drawer in `src/components/ui/teacher-mobile-nav.tsx`
  - 'use client' directive (uses Sheet component)
  - Use shadcn/ui Sheet component
  - Hamburger icon trigger (☰)
  - Same MENU_ITEMS structure as desktop
  - Slide-in from left/right
  - Close on item click or outside tap
  - Mobile only: visible below md breakpoint (flex md:hidden)

### Pages
- [ ] **T033** Create login page in `src/app/(auth)/login/page.tsx`
  - 'use client' directive (uses form state, useRouter)
  - Use shadcn/ui Form, Input, Button components
  - Email field with validation (required, email format)
  - Password field with validation (required, min 8 chars)
  - Submit → POST /api/auth/login
  - On success: redirect to /teacher/dashboard
  - On error: display error message below form
  - Responsive: mobile-first design

- [ ] **T034** Create error page in `src/app/error/page.tsx`
  - Display simple message: "Access denied. Please login."
  - Link to /login page
  - Can be Server Component (no client state needed)

- [ ] **T035** Create teacher dashboard in `src/app/teacher/dashboard/page.tsx`
  - Server Component (no client interactions on dashboard itself)
  - Import TeacherNav and TeacherMobileNav components
  - Display welcome message: "Welcome, Teacher"
  - Navigation menu visible at top
  - Responsive layout

- [ ] **T036** [P] Create placeholder page for Assignments in `src/app/teacher/assignments/page.tsx`
  - Server Component
  - Simple heading: "Assignments"
  - Include navigation menu

- [ ] **T037** [P] Create placeholder page for Problem Management in `src/app/teacher/problem-management/page.tsx`
  - Server Component
  - Simple heading: "Problem Management"

- [ ] **T038** [P] Create placeholder page for Hint Management in `src/app/teacher/hint-management/page.tsx`
  - Server Component
  - Simple heading: "Hint Management"

- [ ] **T039** [P] Create placeholder page for Student Management in `src/app/teacher/student-management/page.tsx`
  - Server Component
  - Simple heading: "Student Management"

- [ ] **T040** [P] Create placeholder page for Parent Management in `src/app/teacher/parent-management/page.tsx`
  - Server Component
  - Simple heading: "Parent Management"

- [ ] **T041** [P] Create placeholder pages for Reports in `src/app/teacher/reports/[id]/page.tsx`
  - Server Component with dynamic route
  - Display: "Report {id}"
  - Handles id = 1, 2, 3

- [ ] **T042** [P] Create placeholder page for Admin in `src/app/teacher/admin/page.tsx`
  - Server Component
  - Simple heading: "Administrative Functions - Coming Soon"

---

## Phase 3.4: Integration & Validation ⚠️ BLOCKING

- [ ] **T043** Run all tests and fix implementation until ALL tests PASS
  - Contract tests must pass (API contracts fulfilled)
  - Integration tests must pass (user stories validated)
  - Unit tests must pass (utilities correct)
  - Fix bugs, adjust implementation
  - DO NOT modify tests (only implementation)

- [ ] **T044** Run production build: `npm run build`
  - Must succeed with zero errors
  - Fix any TypeScript errors
  - Fix any Server/Client Component boundary errors
  - Fix any import/export errors
  - Verify no 'client-only' package errors

- [ ] **T045** Test responsive design manually (Playwright via MCP or browser DevTools)
  - Mobile (375px): Hamburger menu works, drawer opens/closes, all links functional
  - Tablet (768px): Navigation transitions correctly
  - Desktop (1280px): Horizontal nav with dropdowns, all links functional
  - Touch targets ≥ 44x44px on mobile
  - No horizontal scrolling on any screen size

- [ ] **T046** Execute quickstart.md scenarios manually ⚠️ BLOCKING
  - Run through all 11 scenarios from quickstart.md
  - Scenario 1: Successful login → dashboard
  - Scenario 2: Invalid credentials → error message
  - Scenario 3: Navigate to Assignments
  - Scenario 4-6: Test all dropdowns
  - Scenario 7: Administrative Functions
  - Scenario 8: Unauthorized access → error page
  - Scenario 9: Logout → session cleared
  - Scenario 10: Responsive design
  - Scenario 11: Session expiration (optional - manual time manipulation)
  - Document any failures, fix implementation

---

## Phase 3.5: Polish & Documentation

- [ ] **T047** [P] Add JSDoc comments to all public functions in src/lib/auth.ts and src/lib/session.ts
  - Document parameters, return types, edge cases

- [ ] **T048** [P] Add ARIA labels and accessibility attributes to navigation components
  - NavigationMenu: proper ARIA roles
  - Sheet drawer: focus trap, keyboard navigation (Escape to close)
  - Buttons: accessible labels

- [ ] **T049** Review code for duplication and refactor
  - Extract common navigation logic
  - Ensure DRY principle (Don't Repeat Yourself)
  - Keep functions < 20 lines where possible

- [ ] **T050** Final commit: "feat: implement teacher authentication and navigation"
  - Stage all implementation files (src/, __tests__/)
  - Verify all tests pass
  - Verify npm run build succeeds
  - Verify quickstart.md scenarios pass
  - Push to branch 002-docs-teacher-dashboard1

---

## Dependencies

**Blocking Dependencies**:
- T001-T005 (Setup) must complete before T006-T016 (Tests)
- T006-T016 (Tests) must complete before T017 (Verify Failure)
- T017-T018 (Commit Failing Tests) must complete before T019-T042 (Implementation)
- T019 (Types) blocks T020-T021 (Utilities that use types)
- T020-T021 (Utilities) block T022-T024 (API routes that use utilities)
- T022-T024 (API routes) block T043 (Integration testing)
- T025 (Middleware) blocks T012 (Access control tests)
- T026-T030 (shadcn components) block T031-T032 (Navigation components)
- T031-T032 (Navigation) block T033-T042 (Pages that use navigation)
- T033-T042 (All pages) block T043 (Integration testing)
- T043-T046 (Validation) must complete before T047-T050 (Polish)

**Parallel Groups**:
```
Group 1 (Setup): T004, T005 can run in parallel
Group 2 (Contract Tests): T006, T007, T008 can run in parallel
Group 3 (Integration Tests): T009, T010, T011, T012, T013, T014 can run in parallel
Group 4 (Unit Tests): T015, T016 can run in parallel
Group 5 (shadcn Install): T026, T027, T028, T029, T030 can run in parallel
Group 6 (Placeholder Pages): T036, T037, T038, T039, T040, T041, T042 can run in parallel
Group 7 (Polish): T047, T048 can run in parallel
```

---

## Parallel Execution Example

### Phase 3.2: Launch all contract tests together
```bash
# T006, T007, T008 can run in parallel (different files)
Task: "Write failing contract test for POST /api/auth/login in __tests__/contract/auth-login.test.ts"
Task: "Write failing contract test for POST /api/auth/logout in __tests__/contract/auth-logout.test.ts"
Task: "Write failing contract test for GET /api/auth/session in __tests__/contract/auth-session.test.ts"
```

### Phase 3.2: Launch all integration tests together
```bash
# T009-T014 can run in parallel (different test files)
Task: "Write failing integration test for Scenario 1 (successful login flow) in __tests__/integration/teacher-login.test.tsx"
Task: "Write failing integration test for Scenario 2 (invalid credentials) in __tests__/integration/teacher-login-error.test.tsx"
Task: "Write failing integration test for Scenario 3-7 (navigation flows) in __tests__/integration/teacher-navigation.test.tsx"
Task: "Write failing integration test for Scenario 8 (unauthorized access) in __tests__/integration/access-control.test.tsx"
Task: "Write failing integration test for Scenario 9 (logout) in __tests__/integration/teacher-logout.test.tsx"
Task: "Write failing integration test for Scenario 10 (responsive design) in __tests__/integration/responsive-navigation.test.tsx"
```

### Phase 3.3: Install shadcn components in parallel
```bash
# T026-T030 can run in parallel (different components)
Task: "Install shadcn/ui Button component (npx shadcn@latest add button)"
Task: "Install shadcn/ui NavigationMenu component (npx shadcn@latest add navigation-menu)"
Task: "Install shadcn/ui Sheet component (npx shadcn@latest add sheet)"
Task: "Install shadcn/ui Input component (npx shadcn@latest add input)"
Task: "Install shadcn/ui Form components (npx shadcn@latest add form)"
```

---

## Validation Checklist
*GATE: Verify before marking tasks.md complete*

- [x] All 3 contracts (login, logout, session) have corresponding tests (T006-T008)
- [x] All 4 entities (Teacher, Session, MenuItem, RouteProtection) have type definitions (T019)
- [x] All 11 quickstart scenarios have integration tests (T009-T014)
- [x] All tests come before implementation (T006-T016 before T019-T042)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD workflow enforced: Red (T017) → Green (T043) → Refactor (T049)
- [x] Build validation included (T044)
- [x] Responsive testing included (T045)
- [x] Quickstart validation included (T046)

---

## Notes

- **TDD is MANDATORY**: Tests T006-T016 MUST fail before implementation begins
- **Commit failing tests** at T018 before any implementation
- **Do not modify tests** during implementation (T019-T042)
- **shadcn/ui components**: Always verify 'use client' directive is present
- **Build before commit**: Run `npm run build` at T044 and T050
- **Constitutional compliance**: Adheres to all 4 principles (Clean Code, Next.js Best Practices, Responsive Design, TDD)
- **Estimated total**: 50 tasks (11 test tasks, 1 commit gate, 24 implementation tasks, 4 validation tasks, 4 polish tasks, 6 setup tasks)

---

**Status**: Tasks ready for execution. Begin with T001.
