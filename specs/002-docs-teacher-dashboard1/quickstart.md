# Quickstart: Teacher Dashboard Authentication and Navigation

**Feature**: Teacher Dashboard Authentication and Navigation
**Branch**: `002-docs-teacher-dashboard1`
**Prerequisites**: Next.js 15.5 development server running (`npm run dev`)

## Purpose

This quickstart provides step-by-step instructions to validate the teacher authentication and navigation feature against acceptance criteria from the spec. Follow these steps in order to verify all functional requirements.

---

## Setup

1. **Ensure development server is running**:
   ```bash
   npm run dev
   ```
   Server should start at `http://localhost:3000`

2. **Reset any existing sessions** (if applicable):
   - Clear browser cookies for `localhost:3000`
   - Open browser DevTools → Application → Cookies → Delete all

3. **Verify hardcoded credentials**:
   - Email: `teacher1@teacher.com`
   - Password: `Password!`

---

## Test Scenarios

### ✅ Scenario 1: Successful Teacher Login
**Acceptance Criteria**: FR-001, FR-002, FR-003, FR-004

**Steps**:
1. Navigate to `http://localhost:3000/login`
2. Enter email: `teacher1@teacher.com`
3. Enter password: `Password!`
4. Click "Login" button

**Expected Results**:
- ✅ Redirected to `/teacher/dashboard`
- ✅ Top navigation menu visible with 5 items: Assignments, Problem Management, User Management, Reports, Administrative Functions
- ✅ Logout button visible in top navigation
- ✅ Browser DevTools → Application → Cookies shows:
  - `session_access_token` (HttpOnly, Secure, SameSite=Strict)
  - `session_refresh_token` (HttpOnly, Secure, SameSite=Strict)

**Validation**:
```bash
# Check cookie expiration times
# Access token: Max-Age=1800 (30 minutes)
# Refresh token: Max-Age=2419200 (28 days)
```

---

### ✅ Scenario 2: Invalid Login Credentials
**Acceptance Criteria**: FR-015

**Steps**:
1. Navigate to `http://localhost:3000/login`
2. Enter email: `wrong@example.com`
3. Enter password: `wrongpassword`
4. Click "Login" button

**Expected Results**:
- ✅ Remain on `/login` page
- ✅ Error message displayed: "Invalid email or password" (or similar)
- ✅ No cookies set in browser
- ✅ Form fields retain entered values (optional UX improvement)

---

### ✅ Scenario 3: Navigate to Assignments
**Acceptance Criteria**: FR-006, FR-007

**Steps**:
1. Log in as teacher (use Scenario 1 steps)
2. Click "Assignments" in top navigation menu

**Expected Results**:
- ✅ Redirected to `/teacher/assignments`
- ✅ Page loads successfully (no 404 or error)
- ✅ Top navigation menu still visible
- ✅ Active menu item highlighted (optional UX improvement)

---

### ✅ Scenario 4: Problem Management Dropdown
**Acceptance Criteria**: FR-006, FR-008

**Steps**:
1. Log in as teacher
2. Hover over or click "Problem Management" in top navigation

**Expected Results**:
- ✅ Dropdown menu appears with 2 options:
  1. "Problem Management"
  2. "Hint Management"
- ✅ Click "Problem Management" → navigate to `/teacher/problem-management`
- ✅ Return to dashboard and click "Hint Management" → navigate to `/teacher/hint-management`

---

### ✅ Scenario 5: User Management Dropdown
**Acceptance Criteria**: FR-006, FR-009

**Steps**:
1. Log in as teacher
2. Hover over or click "User Management" in top navigation

**Expected Results**:
- ✅ Dropdown menu appears with 2 options:
  1. "Student Management"
  2. "Parent Management"
- ✅ Click "Student Management" → navigate to `/teacher/student-management`
- ✅ Return to dashboard and click "Parent Management" → navigate to `/teacher/parent-management`

---

### ✅ Scenario 6: Reports Dropdown
**Acceptance Criteria**: FR-006, FR-010

**Steps**:
1. Log in as teacher
2. Hover over or click "Reports" in top navigation

**Expected Results**:
- ✅ Dropdown menu appears with 3 options:
  1. "Report 1"
  2. "Report 2"
  3. "Report 3"
- ✅ Each option navigates to respective route:
  - Report 1 → `/teacher/reports/1`
  - Report 2 → `/teacher/reports/2`
  - Report 3 → `/teacher/reports/3`

---

### ✅ Scenario 7: Administrative Functions
**Acceptance Criteria**: FR-011

**Steps**:
1. Log in as teacher
2. Click "Administrative Functions" in top navigation

**Expected Results**:
- ✅ Navigate to `/teacher/admin`
- ✅ Placeholder/mockup page displayed (can be simple text: "Administrative Functions - Coming Soon")

---

### ✅ Scenario 8: Unauthorized Access (Logged Out)
**Acceptance Criteria**: FR-012, FR-013

**Steps**:
1. Ensure no active session (clear cookies or use incognito window)
2. Attempt to navigate directly to `http://localhost:3000/teacher/dashboard`

**Expected Results**:
- ✅ Redirected to `/error` page
- ✅ Error page displays simple message: "Access denied" or "Please login"
- ✅ No flash of protected content before redirect

**Repeat for other protected routes**:
- `/teacher/assignments`
- `/teacher/problem-management`
- `/teacher/student-management`
- `/teacher/admin`

All should redirect to `/error`

---

### ✅ Scenario 9: Logout Functionality
**Acceptance Criteria**: FR-017

**Steps**:
1. Log in as teacher
2. Click "Logout" button in top navigation menu

**Expected Results**:
- ✅ Redirected to `/login` page
- ✅ Browser cookies cleared (check DevTools → Application → Cookies)
- ✅ Attempting to navigate to `/teacher/dashboard` redirects to `/error` (session invalidated)

---

### ✅ Scenario 10: Mobile Responsive Design
**Acceptance Criteria**: FR-014, Principle III (Constitution)

**Steps**:
1. Log in as teacher on desktop view
2. Open browser DevTools → Toggle device toolbar
3. Set viewport to:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1280px width

**Expected Results (Mobile - 375px)**:
- ✅ Top navigation replaced with hamburger icon (☰)
- ✅ Click hamburger → drawer slides in from side
- ✅ Drawer contains all 5 menu items + Logout button
- ✅ Menu items stacked vertically
- ✅ Touch targets ≥ 44x44px (buttons, menu items)
- ✅ Click outside drawer → drawer closes

**Expected Results (Tablet - 768px)**:
- ✅ Transitional layout (hamburger or horizontal menu based on design)
- ✅ All navigation items accessible

**Expected Results (Desktop - 1280px)**:
- ✅ Full horizontal navigation menu visible
- ✅ Dropdown menus on hover/click
- ✅ No horizontal scrolling

---

### ✅ Scenario 11: Session Expiration (Manual Test)
**Acceptance Criteria**: FR-003 (30min access, 28day refresh)

**Note**: This test requires manual time manipulation or waiting.

**Steps (Access Token Expiration)**:
1. Log in as teacher
2. Wait 30 minutes OR manually expire access token in DevTools
3. Attempt to navigate to a protected page

**Expected Results**:
- ✅ If refresh token valid: New access token issued, navigation succeeds
- ✅ If refresh token expired: Redirect to `/error` or `/login`

**Steps (Refresh Token Expiration)**:
1. Log in as teacher
2. Wait 28 days OR manually expire both tokens
3. Attempt to navigate to a protected page

**Expected Results**:
- ✅ Redirect to `/error` (session fully expired)

---

## Validation Checklist

After completing all scenarios, verify:

- [ ] All 9 acceptance scenarios from spec pass
- [ ] No console errors in browser DevTools
- [ ] TypeScript build passes: `npm run build`
- [ ] All contract tests pass: `npm test -- __tests__/contract/`
- [ ] All integration tests pass: `npm test -- __tests__/integration/`
- [ ] All unit tests pass: `npm test -- __tests__/unit/`
- [ ] Responsive design verified on 3 breakpoints (mobile, tablet, desktop)
- [ ] Accessibility: Keyboard navigation works (Tab, Enter, Escape)
- [ ] Session cookies are httpOnly, Secure, SameSite=Strict

---

## Troubleshooting

### Issue: Login redirects to error page
- **Cause**: Hardcoded credentials mismatch
- **Fix**: Verify email is `teacher1@teacher.com` and password is `Password!` (case-sensitive)

### Issue: Cookies not set after login
- **Cause**: Cookie settings incorrect (not httpOnly or Secure)
- **Fix**: Check cookie flags in API response headers

### Issue: Protected pages accessible without login
- **Cause**: Middleware not running or matcher pattern incorrect
- **Fix**: Verify `middleware.ts` matcher includes `/teacher/:path*`

### Issue: Mobile drawer not appearing
- **Cause**: Tailwind responsive classes incorrect
- **Fix**: Ensure `md:hidden` on hamburger and `hidden md:flex` on desktop menu

### Issue: Build fails with type errors
- **Cause**: TypeScript types not properly defined
- **Fix**: Run `npm run build` and fix reported type errors

---

## Success Criteria

This quickstart is successful when:
1. All 11 test scenarios pass
2. No errors in browser console
3. `npm run build` succeeds
4. All automated tests pass (`npm test`)
5. Responsive design works on all breakpoints

**Status**: Ready for validation after implementation complete.
