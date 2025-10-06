# Data Model: Teacher Dashboard Authentication and Navigation

**Feature**: Teacher Dashboard Authentication and Navigation
**Date**: 2025-10-06
**Status**: Complete

## Entities

### 1. Teacher

**Description**: Represents an authenticated teacher user in the system.

**Fields**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | Yes | Email format, max 255 chars | Teacher's email address (e.g., teacher1@teacher.com) |
| `password` | string | Yes | Min 8 chars, requires special char | Teacher's password (e.g., Password!) |
| `name` | string | No | Max 100 chars | Teacher's display name (optional for prototype) |

**Validation Rules**:
- `email` MUST match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `password` MUST be at least 8 characters
- `password` MUST contain at least one special character (!, @, #, $, %, etc.)

**State**: Immutable (hardcoded credentials for prototype phase)

**Hardcoded Data** (prototype):
```typescript
const HARDCODED_TEACHER = {
  email: 'teacher1@teacher.com',
  password: 'Password!', // In production: hashed
  name: 'Teacher One'
};
```

---

### 2. Session

**Description**: Represents an active authenticated session for a teacher.

**Fields**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `accessToken` | string | Yes | JWT format, 256 chars max | Short-lived token (30min) for API requests |
| `refreshToken` | string | Yes | JWT format, 256 chars max | Long-lived token (28days) for token refresh |
| `teacherEmail` | string | Yes | Email format | Email of authenticated teacher |
| `issuedAt` | number | Yes | Unix timestamp | Session creation timestamp |
| `accessTokenExpiresAt` | number | Yes | Unix timestamp | Access token expiration (issuedAt + 30min) |
| `refreshTokenExpiresAt` | number | Yes | Unix timestamp | Refresh token expiration (issuedAt + 28days) |

**Validation Rules**:
- `accessTokenExpiresAt` MUST be `issuedAt + 1800` seconds (30 minutes)
- `refreshTokenExpiresAt` MUST be `issuedAt + 2419200` seconds (28 days)
- `accessToken` and `refreshToken` MUST be unique per session
- `teacherEmail` MUST match existing Teacher entity

**State Transitions**:
1. **Created**: Login successful → new session created
2. **Active**: Access token valid (within 30min) → full access
3. **Refreshable**: Access token expired but refresh token valid → can refresh
4. **Expired**: Both tokens expired → redirect to login
5. **Invalidated**: Logout triggered → session destroyed

**Storage**: httpOnly cookies (XSS protection)
- Cookie name: `session_access_token`, `session_refresh_token`
- Flags: `httpOnly=true`, `secure=true` (HTTPS only), `sameSite=strict`

---

### 3. MenuItem

**Description**: Represents a navigation menu item in the teacher dashboard.

**Fields**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | Unique, kebab-case | Menu item identifier (e.g., 'assignments') |
| `label` | string | Yes | Max 50 chars | Display label (e.g., 'Assignments') |
| `href` | string | No | Valid path, starts with '/' | Direct link (null if has dropdown) |
| `children` | MenuItem[] | No | Max 5 items | Submenu items (for dropdowns) |
| `order` | number | Yes | 1-10 | Display order in menu |

**Validation Rules**:
- `id` MUST be unique across all menu items
- Either `href` OR `children` MUST be provided (not both)
- If `children` provided, MUST have at least 1 item
- `order` determines left-to-right display (ascending)

**Relationships**:
- **Self-referential**: MenuItem can have child MenuItems (one level deep only)

**Hardcoded Menu Structure** (prototype):
```typescript
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'assignments',
    label: 'Assignments',
    href: '/teacher/assignments',
    order: 1
  },
  {
    id: 'problem-management',
    label: 'Problem Management',
    order: 2,
    children: [
      { id: 'problems', label: 'Problem Management', href: '/teacher/problem-management' },
      { id: 'hints', label: 'Hint Management', href: '/teacher/hint-management' }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    order: 3,
    children: [
      { id: 'students', label: 'Student Management', href: '/teacher/student-management' },
      { id: 'parents', label: 'Parent Management', href: '/teacher/parent-management' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    order: 4,
    children: [
      { id: 'report-1', label: 'Report 1', href: '/teacher/reports/1' },
      { id: 'report-2', label: 'Report 2', href: '/teacher/reports/2' },
      { id: 'report-3', label: 'Report 3', href: '/teacher/reports/3' }
    ]
  },
  {
    id: 'admin',
    label: 'Administrative Functions',
    href: '/teacher/admin',
    order: 5
  }
];
```

---

### 4. RouteProtection

**Description**: Represents the access control configuration for application routes.

**Fields**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `pattern` | string | Yes | Valid path pattern | Route matcher (e.g., '/teacher/:path*') |
| `requiresAuth` | boolean | Yes | - | Whether route requires authentication |
| `redirectOnFail` | string | Yes | Valid path | Where to redirect unauthenticated users |

**Validation Rules**:
- `pattern` MUST be valid Next.js matcher pattern
- `redirectOnFail` MUST be an existing route
- Public routes (login, error) MUST NOT match protected patterns

**Hardcoded Route Config** (prototype):
```typescript
const ROUTE_PROTECTION: RouteProtection[] = [
  {
    pattern: '/teacher/:path*',
    requiresAuth: true,
    redirectOnFail: '/error'
  }
];
```

---

## Entity Relationships

```
Teacher (1) ──── (0..1) Session
   │
   │ (creates)
   ▼
MenuItem (n) ──── (n) MenuItem (children)
   │
   │ (links to)
   ▼
RouteProtection (n)
```

**Relationships**:
1. **Teacher → Session**: One teacher can have zero or one active session
2. **MenuItem → MenuItem**: Menu items can have child menu items (1 level deep)
3. **MenuItem → RouteProtection**: Menu items link to protected routes

---

## Validation Summary

**Cross-Entity Validation**:
1. Session `teacherEmail` MUST reference valid Teacher
2. MenuItem `href` MUST NOT point to protected routes without valid Session
3. RouteProtection patterns MUST NOT conflict (no overlapping matches)

**Data Integrity**:
- Hardcoded data (prototype) is immutable at runtime
- Session tokens MUST be cryptographically secure (use `crypto.randomBytes()`)
- Passwords MUST be hashed in production (for prototype, plaintext comparison only)

---

## Future Extensions (Out of Scope)

- Database persistence for Teacher entities
- Role-based access control (RBAC)
- Multiple teacher accounts
- Dynamic menu item configuration
- OAuth integration (Google, Microsoft)
- Two-factor authentication (2FA)

---

**Status**: All entities defined and validated against feature requirements. Ready for contract generation.
