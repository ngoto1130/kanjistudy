
# Implementation Plan: Teacher Dashboard Authentication and Navigation

**Branch**: `002-docs-teacher-dashboard1` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/002-docs-teacher-dashboard1/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement teacher authentication and navigation system for the kanji study application. Teachers will log in using hardcoded credentials (teacher1@teacher.com / Password!), access a dashboard with top navigation menu (replacing current bottom quick-access links), and navigate to various teaching management features. The system includes session management (30min active, 28days extended), responsive mobile-first design with hamburger menu/drawer, and access control for protected pages.

## Technical Context
**Language/Version**: TypeScript with Next.js 15.5, React 19
**Primary Dependencies**: Next.js 15.5, React 19, Tailwind CSS 4, shadcn/ui, next/font
**Storage**: Hardcoded credentials initially (teacher1@teacher.com / Password!), session management via browser storage/cookies
**Testing**: Jest + React Testing Library (unit/integration), build-time validation (npm run build), Playwright via MCP (E2E)
**Target Platform**: Web application (desktop and mobile browsers)
**Project Type**: single (Next.js App Router)
**Performance Goals**: Standard web performance - Core Web Vitals compliance, responsive UI interactions
**Constraints**: Mobile-first responsive design (375px+), 30min active session / 28days extended session, no rate limiting (prototype)
**Scale/Scope**: Single teacher prototype with hardcoded auth, 6 menu items (5 top-level + logout), ~5-8 pages/routes

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Clean & Modular Code
- ✅ **Authentication logic** separated from UI components
- ✅ **Session management** isolated in dedicated service/hook
- ✅ **Navigation menu** as reusable component with single responsibility
- ✅ **Route protection** via middleware/HOC pattern
- ✅ All components follow SRP and use descriptive names

### Principle II: Next.js 15 Best Practices
- ✅ **App Router** usage confirmed (src/app/ structure)
- ✅ **Server Components** by default, Client Components only for auth state, navigation interactions
- ✅ **next/image** for any images in UI
- ✅ **Path aliases** (@/*) for all imports
- ✅ **Metadata exports** for dashboard and login pages
- ✅ **Pre-push validation**: npm run build enforced before commits

### Principle III: Responsive Design (MANDATORY)
- ✅ **Mobile-first** approach confirmed in spec (FR-014)
- ✅ **Hamburger menu + drawer** for mobile navigation
- ✅ **Tailwind responsive utilities** for all breakpoints
- ✅ **Touch targets** ≥44x44px for mobile buttons
- ✅ Testing required on mobile (375px), tablet (768px), desktop (1280px)

### Principle IV: Test-Driven Development (NON-NEGOTIABLE)
- ✅ **Tests first**: Contract tests → integration tests → unit tests → implementation
- ✅ **Red-Green-Refactor**: All tests written to fail before implementation
- ✅ **Commit failing tests** before any implementation code
- ✅ **Contract tests** for auth endpoints (login, logout, session validation)
- ✅ **Integration tests** for user stories (login flow, navigation, access control)
- ✅ **Build validation** before every commit (npm run build)

**GATE STATUS**: ✅ PASS - No constitutional violations detected

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   └── login/
│   │       └── page.tsx          # Login page (Client Component)
│   ├── teacher/                  # Protected teacher routes
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Teacher dashboard (Server Component)
│   │   ├── assignments/
│   │   │   └── page.tsx
│   │   ├── problem-management/
│   │   │   └── page.tsx
│   │   ├── hint-management/
│   │   │   └── page.tsx
│   │   ├── student-management/
│   │   │   └── page.tsx
│   │   ├── parent-management/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   ├── error/                    # Error page for unauthorized access
│   │   └── page.tsx
│   ├── layout.tsx
│   └── middleware.ts             # Route protection middleware
│
├── components/
│   └── ui/                       # shadcn/ui components
│       ├── navigation-menu.tsx   # Top nav with dropdowns (Client)
│       ├── mobile-drawer.tsx     # Mobile hamburger menu (Client)
│       ├── button.tsx
│       └── ...                   # Other shadcn components
│
├── lib/
│   ├── auth.ts                   # Auth utilities and validation
│   └── session.ts                # Session management (30min/28day)
│
└── types/
    └── auth.ts                   # Teacher, Session types

__tests__/
├── contract/                     # API/endpoint contract tests
│   ├── auth-login.test.ts
│   ├── auth-logout.test.ts
│   └── auth-session.test.ts
├── integration/                  # User story tests
│   ├── teacher-login.test.tsx
│   ├── teacher-navigation.test.tsx
│   └── access-control.test.tsx
└── unit/                         # Component/utility unit tests
    ├── auth.test.ts
    └── session.test.ts
```

**Structure Decision**: Next.js 15 App Router single project structure. Uses route groups for auth vs protected routes, middleware for access control, and separates UI components from business logic (lib/). Tests mirror source structure with contract, integration, and unit layers following TDD principles.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
The `/tasks` command will load `.specify/templates/tasks-template.md` and generate tasks.md following this approach:

1. **Contract Test Tasks** (from contracts/auth-api.yaml):
   - Task: Write failing contract test for POST /api/auth/login [P]
   - Task: Write failing contract test for POST /api/auth/logout [P]
   - Task: Write failing contract test for GET /api/auth/session [P]

2. **Type Definition Tasks** (from data-model.md):
   - Task: Define Teacher, Session, MenuItem, RouteProtection types in src/types/auth.ts [P]

3. **Integration Test Tasks** (from quickstart.md scenarios):
   - Task: Write failing integration test for Scenario 1 (successful login flow) [P]
   - Task: Write failing integration test for Scenario 2 (invalid credentials) [P]
   - Task: Write failing integration test for Scenario 3-7 (navigation flows) [P]
   - Task: Write failing integration test for Scenario 8 (unauthorized access) [P]
   - Task: Write failing integration test for Scenario 9 (logout) [P]
   - Task: Write failing integration test for Scenario 10 (responsive design) [P]

4. **Unit Test Tasks** (from lib/ utilities):
   - Task: Write failing unit tests for src/lib/auth.ts (validateCredentials, createTokens) [P]
   - Task: Write failing unit tests for src/lib/session.ts (validateSession, refreshSession) [P]

5. **Commit Failing Tests**:
   - Task: Run all tests, verify failures, commit with message "test: add failing tests for teacher auth" [BLOCKING]

6. **Implementation Tasks** (to make tests pass):
   - Task: Implement src/types/auth.ts type definitions
   - Task: Implement src/lib/auth.ts (validateCredentials, createTokens, hashPassword)
   - Task: Implement src/lib/session.ts (createSession, validateSession, refreshSession)
   - Task: Implement API route src/app/api/auth/login/route.ts
   - Task: Implement API route src/app/api/auth/logout/route.ts
   - Task: Implement API route src/app/api/auth/session/route.ts
   - Task: Implement middleware src/app/middleware.ts (route protection)
   - Task: Implement login page src/app/(auth)/login/page.tsx (Client Component)
   - Task: Implement error page src/app/error/page.tsx
   - Task: Install shadcn/ui NavigationMenu component
   - Task: Install shadcn/ui Sheet component
   - Task: Implement navigation menu src/components/ui/navigation-menu.tsx (desktop)
   - Task: Implement mobile drawer src/components/ui/mobile-drawer.tsx
   - Task: Implement teacher dashboard src/app/teacher/dashboard/page.tsx
   - Task: Implement placeholder pages for all routes (assignments, problem-management, etc.)
   - Task: Run tests until all pass, fix implementation as needed [BLOCKING]

7. **Build Validation**:
   - Task: Run npm run build, fix any type errors or build issues [BLOCKING]

8. **Responsive Testing**:
   - Task: Test responsive design on mobile (375px), tablet (768px), desktop (1280px) [BLOCKING]

9. **Final Validation**:
   - Task: Execute quickstart.md scenarios, verify all pass [BLOCKING]
   - Task: Commit implementation with message "feat: implement teacher authentication and navigation" [BLOCKING]

**Ordering Strategy**:
- **TDD order**: All test tasks (1-4) BEFORE implementation tasks (6)
- **Blocking commit**: Failing tests committed (5) before implementation begins
- **Dependency order**: Types → Utilities → API routes → Middleware → UI components → Pages
- **Parallel execution**: Tasks marked [P] are independent and can be executed in parallel
- **Blocking tasks**: Tasks marked [BLOCKING] must complete before subsequent tasks

**Estimated Output**: ~35-40 numbered, dependency-ordered tasks in tasks.md

**Task Breakdown**:
- Contract tests: 3 tasks
- Type definitions: 1 task
- Integration tests: 6 tasks
- Unit tests: 2 tasks
- Commit failing tests: 1 task
- Implementation: 16 tasks
- Validation: 4 tasks
- **Total: ~33 tasks**

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none - no violations)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
