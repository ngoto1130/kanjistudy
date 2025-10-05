<!--
SYNC IMPACT REPORT
==================
Version Change: [INITIAL] → 1.0.0
Modified Principles: N/A (initial version)
Added Sections:
  - Core Principles (4 principles)
  - Development Standards
  - Quality Gates
  - Governance
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section references this file
  ✅ spec-template.md - No changes required (no constitution-specific constraints)
  ✅ tasks-template.md - TDD ordering aligns with Principle III
  ✅ CLAUDE.md - Already contains TDD philosophy and Next.js best practices
Follow-up TODOs: None
-->

# KanjiStudy Constitution

## Core Principles

### I. Clean & Modular Code
Every component, function, and module MUST have a single, well-defined responsibility. Code MUST be organized into logical, reusable modules that can be independently tested and maintained.

**Non-negotiable rules:**
- Follow the Single Responsibility Principle (SRP)
- Use descriptive, intention-revealing names for all identifiers
- Keep functions small (ideally <20 lines)
- Avoid code duplication (DRY principle)
- Separate concerns: UI logic, business logic, and data access MUST be in distinct layers

**Rationale:** Modular code reduces cognitive load, improves maintainability, enables parallel development, and facilitates testing. Clean code is easier to debug, extend, and onboard new developers to.

### II. Next.js 15 Best Practices
All code MUST adhere to Next.js 15 official best practices and conventions. Leverage framework features optimally to ensure performance, maintainability, and future compatibility.

**Non-negotiable rules:**
- Use App Router (not Pages Router)
- Server Components by default; Client Components only when necessary (hooks, browser APIs, event handlers)
- Use `next/image` for all images
- Use `next/font` for font optimization
- Leverage file-based routing in `src/app/`
- Use path aliases (`@/*`) for all internal imports
- Configure metadata exports for SEO
- Always run `npm run build` locally before pushing to catch type errors

**Rationale:** Following framework best practices ensures optimal performance (automatic code splitting, image optimization, SSR/SSG benefits), better developer experience (type safety, fast refresh), and easier upgrades. Server Components reduce client-side JavaScript bundle size.

### III. Responsive Design (MANDATORY)
Every UI component and screen MUST be fully responsive across all device sizes (mobile, tablet, desktop). Design mobile-first, then progressively enhance for larger screens.

**Non-negotiable rules:**
- Use Tailwind CSS responsive utility classes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Test all features on at minimum: mobile (375px), tablet (768px), desktop (1280px)
- Avoid fixed pixel widths; use relative units (%, rem, vh/vw)
- Touch targets MUST be at least 44x44px on mobile
- Text MUST be readable without zooming (minimum 16px base font size)
- No horizontal scrolling on any screen size

**Rationale:** Mobile-first responsive design ensures accessibility across all devices, improves user experience, increases reach, and aligns with modern web standards. Most users access web applications from mobile devices.

### IV. Test-Driven Development (NON-NEGOTIABLE)
TDD MUST be strictly enforced. Tests are written BEFORE implementation code. The Red-Green-Refactor cycle is mandatory for all features.

**Non-negotiable rules:**
- Write tests first based on expected input/output
- Run tests and verify they FAIL (Red phase)
- Commit failing tests BEFORE implementing
- Write minimal code to make tests pass (Green phase)
- Do NOT modify tests during implementation
- Refactor only after tests pass
- All tests MUST pass before merging
- Every feature MUST have contract tests, integration tests, and unit tests where applicable

**Rationale:** TDD ensures code correctness from the start, reduces debugging time, serves as living documentation, prevents regressions, and improves design by forcing developers to think about interfaces before implementation. It is the foundation of software quality.

## Development Standards

### Code Organization
- Use Next.js App Router structure: `src/app/` for pages and layouts
- Components in `src/components/` (shadcn/ui components preferred)
- Business logic in `src/lib/` or `src/services/`
- Types in `src/types/` or co-located with modules
- Tests mirror source structure: `__tests__/` or `.test.ts` files co-located

### Testing Requirements
- Contract tests for all API endpoints (request/response validation)
- Integration tests for user stories and critical flows
- Unit tests for complex business logic and utilities
- E2E tests for critical user journeys (optional but recommended)
- Minimum 80% code coverage for business logic

### Styling Standards
- Tailwind CSS 4 for all styling
- Use shadcn/ui components via MCP tools (`mcp__shadcn__*`) whenever possible
- Follow Tailwind responsive design patterns
- Global styles only in `src/app/globals.css`
- Avoid inline styles and CSS modules

### TypeScript Standards
- Strict mode enabled (already configured)
- No `any` types without explicit justification
- Prefer interfaces for object shapes
- Use proper typing for all function parameters and return values
- Leverage Next.js built-in types (`Metadata`, `NextPage`, etc.)

## Quality Gates

### Pre-Commit Gates
1. **Local Build Success**: `npm run build` MUST pass
2. **Linting**: `npm run lint` MUST pass with zero errors
3. **Tests**: All tests MUST pass
4. **Type Safety**: No TypeScript errors

### Pre-Merge Gates
1. All Pre-Commit Gates MUST pass
2. Code review approved
3. Tests cover new functionality
4. Responsive design verified on mobile/tablet/desktop
5. No console errors or warnings

### Pre-Deployment Gates
1. All Pre-Merge Gates MUST pass
2. Production build tested locally
3. Performance budget maintained (Core Web Vitals)
4. Accessibility standards met (WCAG 2.1 Level AA)

## Governance

### Amendment Process
1. Constitution changes MUST be proposed with rationale
2. Impact analysis MUST be performed on dependent templates
3. Version MUST be bumped according to semantic versioning:
   - **MAJOR**: Breaking changes to governance or principle removal
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic changes
4. All dependent files MUST be updated before constitution amendment is finalized

### Compliance Review
- All feature specs MUST be reviewed against constitution principles
- All implementation plans MUST include Constitution Check section
- Violations MUST be documented in Complexity Tracking with justification
- Unjustifiable violations MUST be rejected

### Constitutional Authority
This constitution supersedes all other practices and guidelines. When conflicts arise between this document and other guidance (README, CLAUDE.md, etc.), the constitution takes precedence. However, specific technical guidance in CLAUDE.md complements (not conflicts with) this constitution.

**Version**: 1.0.0 | **Ratified**: 2025-10-05 | **Last Amended**: 2025-10-05
