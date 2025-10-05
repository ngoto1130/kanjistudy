# Research: Teacher Dashboard Mockup

**Feature**: Teacher Dashboard Mockup
**Date**: 2025-10-05
**Status**: Complete

## Research Questions

### 1. Next.js 15 App Router Best Practices for Mockup Pages

**Decision**: Use Server Components by default with selective Client Components

**Rationale**:
- Server Components provide better performance (less client JavaScript)
- Mockup pages with static mock data are perfect for Server Components
- Only interactive elements (breadcrumb active state, time filters) need Client Components
- Reduces bundle size and improves initial page load

**Alternatives Considered**:
- All Client Components: Rejected due to unnecessary client-side JavaScript overhead
- All Server Components: Rejected as some interactive UI (filters, navigation state) requires client hooks

**Implementation Pattern**:
```typescript
// Server Component (default)
// src/app/teacher/dashboard/page.tsx
export default function DashboardPage() {
  const students = generateMockStudents(); // Server-side mock data
  return <ProgressTable data={students} />;
}

// Client Component (when needed)
// src/components/teacher/breadcrumb-nav.tsx
'use client';
export function BreadcrumbNav() {
  const pathname = usePathname(); // Requires Client Component
  // ...
}
```

---

### 2. Responsive Design Patterns for Data Tables

**Decision**: Use CSS Grid for responsive table transformation (table → cards)

**Rationale**:
- Tables are difficult to read on mobile screens
- CSS Grid allows seamless transformation: full table (desktop) → card layout (mobile)
- No JavaScript required for layout changes
- Better accessibility than horizontal scrolling tables
- Aligns with Tailwind CSS responsive utilities

**Alternatives Considered**:
- Horizontal scroll on mobile: Rejected due to poor UX and accessibility
- Hidden columns on mobile: Rejected as all columns (name, sessions, cleared, accuracy) are important
- Separate mobile/desktop components: Rejected due to code duplication

**Implementation Pattern**:
```tsx
// Desktop: Traditional table
// Mobile: Grid cards with labels
<div className="hidden md:block">
  <table>...</table>
</div>
<div className="md:hidden space-y-4">
  {students.map(student => (
    <div key={student.id} className="border rounded-lg p-4">
      <div className="grid grid-cols-2 gap-2">
        <span className="font-semibold">Name:</span>
        <span>{student.name}</span>
        {/* ... other fields ... */}
      </div>
    </div>
  ))}
</div>
```

---

### 3. shadcn/ui Components for Teacher Dashboard

**Decision**: Use shadcn/ui Table, Card, Button, Badge, and Breadcrumb components

**Rationale**:
- shadcn/ui provides accessible, customizable components built on Radix UI
- Components are copy-pasted into project (not npm dependency), allowing full control
- Tailwind CSS-based styling aligns with project standards
- MCP tools available for easy component discovery and installation

**Components to Use**:
- **Table**: For desktop student progress table
- **Card**: For menu grid items, mobile table cards, notification cards
- **Button**: For login form, filter buttons, menu navigation
- **Badge**: For notification type indicators, student status badges
- **Breadcrumb**: For navigation (Dashboard > Current Page)
- **Select**: For time period filters (Last Week, Last Month, Custom Range)

**Alternatives Considered**:
- Custom components from scratch: Rejected due to longer development time and accessibility concerns
- Other UI libraries (Material UI, Chakra): Rejected as shadcn/ui is already integrated via MCP

---

### 4. Mock Data Generation Strategy

**Decision**: Centralized mock data generators in `src/lib/mock-data.ts` with seeded randomness

**Rationale**:
- Single source of truth for all mock data across pages
- Seeded randomness ensures consistent data on page refreshes
- Easy to adjust data scale (~50 students, ~10 teachers)
- Separates data generation from UI components (SRP)
- TypeScript types ensure mock data matches contracts

**Alternatives Considered**:
- Inline mock data in components: Rejected due to code duplication
- External JSON files: Rejected as dynamic generation is more flexible
- Random data on every render: Rejected due to confusing UX (data changes unpredictably)

**Implementation Pattern**:
```typescript
// src/lib/mock-data.ts
export function generateMockStudents(count = 50): Student[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `student-${i + 1}`,
    name: MOCK_STUDENT_NAMES[i % MOCK_STUDENT_NAMES.length],
    studySessions: Math.floor(Math.random() * 50) + 10,
    clearedQuestions: Math.floor(Math.random() * 100) + 20,
    accuracyRate: Math.floor(Math.random() * 30) + 70, // 70-100%
  }));
}
```

---

### 5. Test Strategy for Mockup Feature

**Decision**: Component tests (Jest/RTL) + Integration tests (navigation) + E2E tests (Playwright)

**Rationale**:
- **Component tests**: Verify rendering, props, responsive behavior (fast, isolated)
- **Integration tests**: Verify page navigation, breadcrumb state, mock data flow
- **E2E tests**: Verify full user journeys (login → dashboard → menu pages)
- TDD approach: Write tests first, verify they fail, then implement

**Test Coverage**:
1. **Component Tests** (Jest + React Testing Library):
   - ProgressTable: Renders mock data, responsive layout, filter functionality
   - NotificationsList: Renders notifications, empty state, type icons
   - MenuGrid: Renders 6 menu cards, navigation links
   - BreadcrumbNav: Shows correct breadcrumb, active state

2. **Integration Tests** (Jest/RTL or Playwright Component Testing):
   - Login → Dashboard navigation
   - Dashboard → Menu page navigation
   - Breadcrumb navigation back to dashboard
   - Mock data consistency across pages

3. **E2E Tests** (Playwright):
   - Full teacher journey: Login → Dashboard → Each menu page → Back to dashboard
   - Responsive behavior at mobile (375px), tablet (768px), desktop (1280px)
   - Empty states (no students, no notifications)

**Alternatives Considered**:
- E2E only: Rejected due to slow feedback loop
- Component tests only: Rejected as navigation flows are critical
- Snapshot tests: Rejected as mockup UI will change frequently during development

---

### 6. Breadcrumb Navigation Implementation

**Decision**: Use Next.js App Router layout with shadcn/ui Breadcrumb component

**Rationale**:
- App Router layout (`src/app/teacher/layout.tsx`) wraps all teacher pages
- Breadcrumb component can access pathname via `usePathname()` hook (Client Component)
- Consistent navigation across all teacher pages
- No prop drilling required

**Implementation Pattern**:
```tsx
// src/app/teacher/layout.tsx
import { BreadcrumbNav } from '@/components/teacher/breadcrumb-nav';

export default function TeacherLayout({ children }) {
  return (
    <div>
      <BreadcrumbNav />
      <main>{children}</main>
    </div>
  );
}
```

**Alternatives Considered**:
- Breadcrumb in each page: Rejected due to code duplication
- Route-based breadcrumb generation: Accepted (pathname → breadcrumb labels)

---

## Technology Stack Summary

| Category | Technology | Rationale |
|----------|------------|-----------|
| **Framework** | Next.js 15.5 App Router | Server Components, file-based routing, optimal performance |
| **Language** | TypeScript | Type safety, better developer experience |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive design, mobile-first |
| **UI Components** | shadcn/ui | Accessible, customizable, Tailwind-based, MCP integration |
| **Mock Data** | Custom generators in `src/lib/` | Centralized, type-safe, seeded randomness |
| **Component Tests** | Jest + React Testing Library | Fast, isolated, DOM-based assertions |
| **E2E Tests** | Playwright | Full browser testing, mobile/tablet/desktop viewports |
| **Navigation** | Next.js App Router + `next/link` | Client-side navigation, prefetching |
| **Fonts** | Geist Sans/Mono (next/font) | Optimized font loading |
| **Images** | next/image | Automatic optimization, responsive images |

---

## Next Steps

1. ✅ Technical Context fully resolved (no NEEDS CLARIFICATION items)
2. → Proceed to Phase 1: Design & Contracts
3. → Generate data-model.md (TypeScript types for entities)
4. → Generate contracts (component prop interfaces)
5. → Generate quickstart.md (test scenarios)
6. → Update CLAUDE.md with teacher feature context

---

**Research Status**: ✅ COMPLETE - All unknowns resolved, best practices identified, ready for Phase 1 design.
