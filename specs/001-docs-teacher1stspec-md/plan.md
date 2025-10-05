
# Implementation Plan: Teacher Dashboard Mockup

**Branch**: `001-docs-teacher1stspec-md` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/001-docs-teacher1stspec-md/spec.md`

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
A mockup-only teacher dashboard for a kanji learning application. Teachers can log in (mock authentication) to access a dashboard displaying all ~50 students' learning progress (study sessions count, cleared questions, accuracy rate with time filters), view notifications (assignment completions and system alerts), and navigate to six menu pages: Assignment Creation, Question Management, Student Management, Parent Management, Learning Status Report, and Administrator Functions. All pages include breadcrumb navigation. No real authentication, data persistence, or business logic - pure UI demonstration with mock data.

## Technical Context
**Language/Version**: TypeScript with Next.js 15.5, React 19
**Primary Dependencies**: Next.js 15.5, React 19, Tailwind CSS 4, shadcn/ui components (via MCP), next/font, next/image
**Storage**: N/A (mockup only - no data persistence)
**Testing**: Jest/React Testing Library (for component tests), Playwright (for E2E mockup navigation tests)
**Target Platform**: Web browsers (mobile, tablet, desktop - responsive design mandatory)
**Project Type**: Web application (frontend-only mockup, Next.js App Router)
**Performance Goals**: Standard Next.js performance (Core Web Vitals, fast page loads via Server Components)
**Constraints**: Mockup only (no authentication, no database, no API calls), must be fully responsive (mobile-first), must use shadcn/ui components where applicable
**Scale/Scope**: 8 pages (1 login + 1 dashboard + 6 menu pages), ~50 mock student records, ~10 mock teacher records, 2 notification types

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Clean & Modular Code
- ✅ **PASS**: Mockup feature naturally supports SRP - each page is a distinct component, navigation logic separate from content
- ✅ Components will be small, focused (login form, dashboard table, notification list, menu cards)
- ✅ Mock data generators will be separate utility functions in `src/lib/mock-data.ts`
- ✅ UI components (pages) separate from data layer (mock utilities)

### Principle II: Next.js 15 Best Practices
- ✅ **PASS**: All requirements align with Next.js 15
- ✅ Will use App Router (`src/app/teacher/*` for teacher pages)
- ✅ Server Components by default (only breadcrumb navigation may need Client Component for active state)
- ✅ Path aliases (`@/*`) for all imports
- ✅ `next/image` for any images (notification icons, avatars if used)
- ✅ Metadata exports for each page (SEO-friendly mockup)

### Principle III: Responsive Design (MANDATORY)
- ✅ **PASS**: Feature spec explicitly mentions mobile/tablet/desktop support
- ✅ Will use Tailwind responsive utilities (`sm:`, `md:`, `lg:`)
- ✅ Dashboard table will collapse to cards on mobile, full table on desktop
- ✅ Menu items will be grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- ✅ Breadcrumb navigation will be compact on mobile, full on desktop
- ✅ Touch targets ≥44px for all interactive elements

### Principle IV: Test-Driven Development (NON-NEGOTIABLE)
- ✅ **PASS**: TDD workflow will be followed
- ✅ Phase 1 will generate failing contract tests (component prop interfaces)
- ✅ Phase 1 will generate failing integration tests (navigation flows, data display)
- ✅ Implementation (Phase 4) will make tests pass without modifying tests
- ⚠️ **NOTE**: Since this is mockup-only (no business logic), tests focus on:
  - Component rendering with mock data
  - Navigation between pages
  - Responsive layout breakpoints
  - Mock data structure validation

### Overall Assessment
**STATUS**: ✅ **PASS** - No constitutional violations. Feature is well-suited for TDD with mockup constraints. All principles can be satisfied with standard Next.js patterns and shadcn/ui components.

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
├── app/
│   ├── teacher/
│   │   ├── login/
│   │   │   └── page.tsx                    # Teacher login page (mockup)
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Main teacher dashboard
│   │   ├── assignments/
│   │   │   └── page.tsx                    # Assignment Creation page
│   │   ├── questions/
│   │   │   └── page.tsx                    # Question Management page
│   │   ├── students/
│   │   │   └── page.tsx                    # Student Management page
│   │   ├── parents/
│   │   │   └── page.tsx                    # Parent Management page
│   │   ├── reports/
│   │   │   └── page.tsx                    # Learning Status Report page
│   │   ├── admin/
│   │   │   └── page.tsx                    # Administrator Functions page
│   │   └── layout.tsx                      # Teacher section layout with breadcrumbs
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home page (may redirect to teacher login)
│   └── globals.css                         # Global styles
├── components/
│   ├── teacher/
│   │   ├── progress-table.tsx              # Student progress table component
│   │   ├── notifications-list.tsx          # Notifications list component
│   │   ├── menu-grid.tsx                   # Menu cards grid component
│   │   ├── breadcrumb-nav.tsx              # Breadcrumb navigation component
│   │   └── login-form.tsx                  # Mock login form component
│   └── ui/                                 # shadcn/ui components (installed via MCP)
├── lib/
│   └── mock-data.ts                        # Mock data generators for teacher feature
└── types/
    └── teacher.ts                          # TypeScript types for teacher entities

__tests__/
├── components/
│   └── teacher/                            # Component unit tests
│       ├── progress-table.test.tsx
│       ├── notifications-list.test.tsx
│       ├── menu-grid.test.tsx
│       └── breadcrumb-nav.test.tsx
├── integration/
│   └── teacher-navigation.test.tsx         # Integration tests for page navigation
└── e2e/
    └── teacher-mockup.spec.ts              # Playwright E2E tests for mockup flows
```

**Structure Decision**: Next.js App Router structure (Option 2 Web - frontend only). All teacher-related pages under `src/app/teacher/*` with shared layout for breadcrumb navigation. Components modularized in `src/components/teacher/`, mock data utilities in `src/lib/`. Tests mirror source structure with component, integration, and E2E test directories.

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

1. **Foundation Tasks** (Sequential):
   - Task 1: Create type definitions (`src/types/teacher.ts`) from data-model.md
   - Task 2: Create mock data generators (`src/lib/mock-data.ts`) with seeded randomness
   - Task 3: Create type guards (`src/lib/type-guards.ts`) for runtime validation

2. **Test-First Tasks** (TDD - Tests before implementation):
   - **Component Contract Tests** [P]:
     - Task 4: Write failing test for ProgressTable component
     - Task 5: Write failing test for NotificationsList component
     - Task 6: Write failing test for MenuGrid component
     - Task 7: Write failing test for BreadcrumbNav component
     - Task 8: Write failing test for LoginForm component

   - **Component Implementation** [P]:
     - Task 9: Implement ProgressTable to pass tests
     - Task 10: Implement NotificationsList to pass tests
     - Task 11: Implement MenuGrid to pass tests
     - Task 12: Implement BreadcrumbNav to pass tests
     - Task 13: Implement LoginForm to pass tests

3. **Page Tasks** (TDD - Tests before implementation):
   - **Page Tests** [P]:
     - Task 14: Write failing test for login page
     - Task 15: Write failing test for dashboard page
     - Task 16: Write failing tests for 6 menu pages (assignments, questions, students, parents, reports, admin)

   - **Page Implementation** [P]:
     - Task 17: Implement login page (`src/app/teacher/login/page.tsx`)
     - Task 18: Implement dashboard page (`src/app/teacher/dashboard/page.tsx`)
     - Task 19: Implement 6 menu pages (mockup content)
     - Task 20: Implement teacher layout with breadcrumb (`src/app/teacher/layout.tsx`)

4. **Integration Tests** (Sequential - after page implementation):
   - Task 21: Write navigation integration test (login → dashboard → menu pages)
   - Task 22: Write responsive layout integration test (mobile/tablet/desktop)
   - Task 23: Write empty state integration test (no students, no notifications)

5. **E2E Tests** (Sequential - final validation):
   - Task 24: Write Playwright E2E test for full teacher journey
   - Task 25: Write Playwright E2E test for responsive behavior
   - Task 26: Write Playwright E2E test for mock data rendering

6. **shadcn/ui Component Installation** [P - can run early]:
   - Task 27: Install shadcn/ui Table component (for ProgressTable)
   - Task 28: Install shadcn/ui Card component (for MenuGrid, NotificationsList)
   - Task 29: Install shadcn/ui Button component (for LoginForm, navigation)
   - Task 30: Install shadcn/ui Badge component (for notification types)
   - Task 31: Install shadcn/ui Breadcrumb component (for BreadcrumbNav)
   - Task 32: Install shadcn/ui Select component (for time filters)

7. **Final Validation** (Sequential - last step):
   - Task 33: Run all tests (component, integration, E2E) - verify all pass
   - Task 34: Run `npm run build` - verify production build succeeds
   - Task 35: Run `npm run lint` - verify no linting errors
   - Task 36: Manual quickstart validation (verify all 9 scenarios)

**Ordering Strategy**:
- **TDD order**: All tests written before implementation (Tasks 4-8 → 9-13, 14-16 → 17-20)
- **Dependency order**: Types → Mock data → Components → Pages → Integration tests → E2E tests
- **Parallel markers [P]**: Tasks 4-8, 9-13, 14-16, 17-19, 27-32 can run in parallel (independent files)
- **Sequential**: Foundation (1-3), Integration (21-23), E2E (24-26), Validation (33-36)

**Estimated Output**: 36 numbered, ordered tasks in tasks.md

**Key TDD Checkpoints**:
- ✅ Checkpoint 1: After Task 8 - All component tests fail (Red phase)
- ✅ Checkpoint 2: After Task 13 - All component tests pass (Green phase)
- ✅ Checkpoint 3: After Task 16 - All page tests fail (Red phase)
- ✅ Checkpoint 4: After Task 20 - All page tests pass (Green phase)
- ✅ Checkpoint 5: After Task 36 - All tests pass, build succeeds, quickstart validated (Complete)

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
- [x] Phase 0: Research complete (/plan command) - ✅ research.md created
- [x] Phase 1: Design complete (/plan command) - ✅ data-model.md, contracts/, quickstart.md, CLAUDE.md updated
- [x] Phase 2: Task planning complete (/plan command - describe approach only) - ✅ 36 tasks planned
- [ ] Phase 3: Tasks generated (/tasks command) - Awaiting /tasks execution
- [ ] Phase 4: Implementation complete - Awaiting implementation
- [ ] Phase 5: Validation passed - Awaiting validation

**Gate Status**:
- [x] Initial Constitution Check: PASS - No violations, all principles satisfied
- [x] Post-Design Constitution Check: PASS - Design confirms all principles
- [x] All NEEDS CLARIFICATION resolved - Technical Context fully specified
- [x] Complexity deviations documented - No deviations, standard Next.js patterns

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
