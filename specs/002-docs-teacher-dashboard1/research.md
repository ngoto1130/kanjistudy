# Research: Teacher Dashboard Authentication and Navigation

**Feature**: Teacher Dashboard Authentication and Navigation
**Date**: 2025-10-06
**Status**: Complete

## Research Questions

### 1. Next.js 15 Authentication Patterns

**Decision**: Use Next.js middleware for route protection + React Context for client-side auth state

**Rationale**:
- Next.js 15 App Router provides `middleware.ts` for server-side route protection before page load
- Prevents unauthorized access at the earliest point (before rendering)
- React Context (Client Component) manages auth state for UI components (navigation menu, logout)
- Separates concerns: middleware = access control, context = UI state

**Alternatives considered**:
- Higher-Order Components (HOC): Less idiomatic in Next.js 15 App Router, requires wrapping each page
- Client-only checks: Allows flash of protected content, security risk
- Server Actions only: Not suitable for session management across page navigations

**Best practices**:
- Store session token in httpOnly cookies (XSS protection)
- Validate token in middleware before rendering protected routes
- Use `useRouter` redirect in Client Components for logout
- Implement token refresh logic for 28-day extended session

**References**:
- Next.js 15 Docs: [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- Next.js Authentication Patterns: [Auth Guide](https://nextjs.org/docs/app/building-your-application/authentication)

---

### 2. Session Management (30min active / 28day extended)

**Decision**: Use dual-token approach with access token (30min) + refresh token (28days) stored in httpOnly cookies

**Rationale**:
- Access token (short-lived) limits exposure if compromised
- Refresh token (long-lived) provides seamless UX - no re-login for 28 days
- httpOnly cookies prevent XSS attacks (cannot be accessed via JavaScript)
- Middleware can validate access token on each request, refresh if expired but refresh token valid

**Alternatives considered**:
- localStorage: Vulnerable to XSS attacks, not recommended for tokens
- sessionStorage: Lost on tab close, doesn't meet 28-day requirement
- Single long-lived token: Higher security risk if compromised

**Implementation approach**:
- Set two cookies on login: `access_token` (30min), `refresh_token` (28days)
- Middleware checks access_token validity
- If expired but refresh_token valid: issue new access_token, continue request
- If both expired: redirect to login

**References**:
- OWASP Token Storage: [Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- Next.js Cookies: [Documentation](https://nextjs.org/docs/app/api-reference/functions/cookies)

---

### 3. shadcn/ui Components for Navigation

**Decision**: Use shadcn/ui `NavigationMenu` for desktop + `Sheet` for mobile drawer

**Rationale**:
- NavigationMenu provides accessible, keyboard-navigable dropdowns (meets WCAG 2.1 AA)
- Sheet component implements mobile drawer pattern with slide-in animation
- Both components support Tailwind responsive utilities for breakpoint switching
- Radix UI primitives (underlying shadcn/ui) handle focus management and ARIA attributes automatically

**Alternatives considered**:
- Custom navigation: Reinventing the wheel, accessibility concerns, more testing needed
- Headless UI: Similar to shadcn/ui but not already integrated in project
- Material UI / Chakra UI: Different design system, inconsistent with Tailwind-first approach

**Components needed**:
- `NavigationMenu`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent` (desktop)
- `Sheet`, `SheetTrigger`, `SheetContent` (mobile)
- `Button` (logout, hamburger icon)

**References**:
- shadcn/ui NavigationMenu: [Docs](https://ui.shadcn.com/docs/components/navigation-menu)
- shadcn/ui Sheet: [Docs](https://ui.shadcn.com/docs/components/sheet)

---

### 4. Route Protection Strategy

**Decision**: Next.js middleware.ts at repository root with matcher config

**Rationale**:
- Runs before rendering any page (server-side, before React hydration)
- Single source of truth for protected routes
- Can redirect to error page or login based on auth state
- Matcher pattern allows excluding public routes (login, error)

**Alternatives considered**:
- Per-route layout checks: Duplicated logic across multiple files
- Client-side guards: Allows protected content to flash before redirect
- API route protection only: Doesn't protect page rendering

**Implementation approach**:
```typescript
// middleware.ts
export const config = {
  matcher: ['/teacher/:path*'], // Protect all /teacher/* routes
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  if (!token || !isValid(token)) {
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
```

**References**:
- Next.js Middleware: [Matching Paths](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)

---

### 5. Mobile-First Responsive Design with Tailwind CSS 4

**Decision**: Use Tailwind's mobile-first breakpoint system with `sm:`, `md:`, `lg:` prefixes

**Rationale**:
- Tailwind CSS 4 follows mobile-first approach by default (unprefixed styles apply to smallest screens)
- Progressive enhancement: start with mobile layout, add desktop features via breakpoints
- Reduces CSS bundle size (mobile styles always loaded, desktop conditionally)
- Aligns with constitutional requirement (Principle III)

**Breakpoints**:
- Default (0-640px): Hamburger menu, vertical stack
- `sm:` (640px+): Tablet adjustments
- `md:` (768px+): Desktop navigation menu (horizontal)
- `lg:` (1024px+): Wider layouts
- `xl:` (1280px+): Max-width containers

**Implementation pattern**:
```tsx
<nav className="flex flex-col md:flex-row">
  {/* Mobile: vertical stack, Desktop: horizontal */}
</nav>
```

**References**:
- Tailwind CSS 4 Responsive Design: [Docs](https://tailwindcss.com/docs/responsive-design)

---

### 6. TDD Strategy for Auth & Navigation

**Decision**: Contract tests → Integration tests → Unit tests → Implementation (Red-Green-Refactor)

**Rationale**:
- Contract tests define auth API shape (login, logout, validate) - fail first
- Integration tests validate user stories (login flow, navigation, access control) - fail first
- Unit tests cover utility functions (token validation, session helpers) - fail first
- Implementation code written only after all tests fail
- Constitutional requirement (Principle IV)

**Test layers**:
1. **Contract tests** (`__tests__/contract/`):
   - `auth-login.test.ts`: POST /api/auth/login with credentials → token response
   - `auth-logout.test.ts`: POST /api/auth/logout → clear cookies
   - `auth-session.test.ts`: GET /api/auth/session → validate token

2. **Integration tests** (`__tests__/integration/`):
   - `teacher-login.test.tsx`: Full login flow (form → API → redirect)
   - `teacher-navigation.test.tsx`: Menu interactions (dropdowns, navigation)
   - `access-control.test.tsx`: Unauthorized access → error page

3. **Unit tests** (`__tests__/unit/`):
   - `auth.test.ts`: validateCredentials(), hashPassword(), verifyToken()
   - `session.test.ts`: createSession(), refreshSession(), expireSession()

**Tools**:
- Jest + React Testing Library (unit/integration)
- `npm run build` (build-time validation)
- Playwright via MCP (E2E - optional)

**References**:
- Next.js Testing: [Docs](https://nextjs.org/docs/app/building-your-application/testing)
- React Testing Library: [Best Practices](https://testing-library.com/docs/react-testing-library/intro/)

---

## Summary

All technical decisions resolved. No NEEDS CLARIFICATION remaining. Ready for Phase 1 (Design & Contracts).

**Key Technologies**:
- Next.js 15.5 middleware for route protection
- React Context for auth state
- httpOnly cookies for dual-token session management
- shadcn/ui NavigationMenu + Sheet for responsive navigation
- Tailwind CSS 4 mobile-first responsive design
- Jest + RTL for TDD (contract → integration → unit → implementation)

**Next Steps**: Phase 1 - Generate data-model.md, contracts/, quickstart.md, CLAUDE.md
