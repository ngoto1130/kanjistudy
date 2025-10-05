# Quickstart: Teacher Dashboard Mockup

**Feature**: Teacher Dashboard Mockup
**Date**: 2025-10-05
**Purpose**: Validate the teacher dashboard mockup by executing key user scenarios

---

## Prerequisites

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

---

## Quick Validation Scenarios

### Scenario 1: Teacher Login Flow (Mock)

**Goal**: Verify mock login redirects to dashboard

**Steps**:
1. Navigate to `http://localhost:3000/teacher/login`
2. Observe: Login form with email input field
3. Enter any email (e.g., `teacher@example.com`)
4. Click "Login" button
5. **Expected**: Redirect to `/teacher/dashboard`

**Validation**:
- ✅ Login form renders
- ✅ Email input accepts text
- ✅ Submit button is clickable
- ✅ Redirects to dashboard (no actual authentication)

---

### Scenario 2: Dashboard - Student Progress Table

**Goal**: Verify student progress table displays mock data and filters

**Steps**:
1. Navigate to `http://localhost:3000/teacher/dashboard`
2. Observe: Student progress table with columns (Name, Study Sessions, Cleared Questions, Accuracy Rate)
3. Verify: ~50 student rows displayed
4. Click "Last Week" filter
5. Click "Last Month" filter
6. Click "Custom Range" filter

**Validation**:
- ✅ Table displays mock student data
- ✅ All 4 columns are visible
- ✅ Data is readable (no overlapping text)
- ✅ Filter buttons are clickable (mockup - no actual filtering)
- ✅ Desktop: Full table layout
- ✅ Mobile (resize to 375px): Card layout with labeled fields

---

### Scenario 3: Dashboard - Notifications List

**Goal**: Verify notifications display correctly

**Steps**:
1. On dashboard, scroll to notifications section
2. Observe: List of notifications with icons, titles, messages, dates
3. Verify: Both "assignment-completion" and "system" notification types present
4. Check notification icons: Different icons for different types

**Validation**:
- ✅ Notifications list renders
- ✅ Each notification shows: icon, title, message preview, date
- ✅ Notification types are visually distinct (different icons)
- ✅ Dates are human-readable (e.g., "2 hours ago", "Oct 5, 2025")
- ✅ Empty state: If no notifications, shows "No new notifications"

---

### Scenario 4: Dashboard - Menu Grid

**Goal**: Verify 6 menu items are displayed in responsive grid

**Steps**:
1. On dashboard, scroll to menu section
2. Observe: 6 menu cards in a grid layout
3. Verify menu items:
   - Assignment Creation
   - Question Management
   - Student Management
   - Parent Management
   - Learning Status Report
   - Administrator Functions
4. Resize browser to mobile (375px), tablet (768px), desktop (1280px)

**Validation**:
- ✅ All 6 menu items displayed
- ✅ Each card shows title and description
- ✅ Mobile (375px): 1 column grid
- ✅ Tablet (768px): 2 columns grid
- ✅ Desktop (1280px): 3 columns grid
- ✅ Touch targets >= 44px on mobile

---

### Scenario 5: Navigation - Menu Pages

**Goal**: Verify navigation to all menu pages and breadcrumbs

**Steps**:
1. From dashboard, click "Assignment Creation"
2. Observe: Assignment Creation page with breadcrumb "Dashboard > Assignment Creation"
3. Click "Dashboard" in breadcrumb
4. **Expected**: Navigate back to dashboard
5. Repeat for all 6 menu pages:
   - Questions: `/teacher/questions`
   - Students: `/teacher/students`
   - Parents: `/teacher/parents`
   - Reports: `/teacher/reports`
   - Admin: `/teacher/admin`

**Validation**:
- ✅ All menu links navigate to correct pages
- ✅ Breadcrumb shows current page path
- ✅ Breadcrumb "Dashboard" link navigates back
- ✅ Each page renders (even if empty mockup)
- ✅ Page titles in browser tab are correct

---

### Scenario 6: Responsive Design - Mobile

**Goal**: Verify mobile responsive design (375px width)

**Steps**:
1. Open browser DevTools
2. Set device to "iPhone SE" (375px width) or custom 375px
3. Navigate through all pages:
   - Login
   - Dashboard
   - All 6 menu pages
4. Check:
   - Text is readable without horizontal scroll
   - Buttons/links are tappable (>= 44px)
   - Tables collapse to cards
   - Menu grid is 1 column

**Validation**:
- ✅ No horizontal scrolling on any page
- ✅ All text is readable (min 16px font)
- ✅ Touch targets >= 44px
- ✅ Progress table: Card layout on mobile
- ✅ Menu grid: 1 column on mobile
- ✅ Breadcrumb is compact (may abbreviate)

---

### Scenario 7: Responsive Design - Tablet

**Goal**: Verify tablet responsive design (768px width)

**Steps**:
1. Set device to "iPad Mini" (768px width) or custom 768px
2. Navigate through dashboard
3. Check:
   - Progress table: Full table or hybrid layout
   - Menu grid: 2 columns
   - Breadcrumb: Full labels

**Validation**:
- ✅ Progress table: Full table or readable hybrid
- ✅ Menu grid: 2 columns
- ✅ Breadcrumb: Full labels visible
- ✅ Good use of screen space (not too cramped, not too sparse)

---

### Scenario 8: Responsive Design - Desktop

**Goal**: Verify desktop responsive design (1280px+ width)

**Steps**:
1. Set browser to full desktop width (1280px+)
2. Navigate through dashboard
3. Check:
   - Progress table: Full table with all columns
   - Menu grid: 3 columns
   - Breadcrumb: Full labels with separators

**Validation**:
- ✅ Progress table: Full table, all columns visible
- ✅ Menu grid: 3 columns
- ✅ Breadcrumb: Full labels, clear separators
- ✅ Good use of wide screen space
- ✅ Content is centered or well-distributed

---

### Scenario 9: Empty States

**Goal**: Verify empty state handling

**Steps**:
1. Modify mock data to return empty arrays (or use URL params if implemented)
2. Check dashboard with:
   - No students (empty progress table)
   - No notifications (empty notifications list)

**Validation**:
- ✅ Empty progress table: Shows column headers with message "No student data available"
- ✅ Empty notifications: Shows message "No new notifications"
- ✅ Menu grid: Always shows 6 items (not affected by empty data)

---

## Integration Test Scenarios (Playwright)

These scenarios should be automated as Playwright E2E tests:

### Test 1: Full Teacher Journey
```typescript
test('teacher can navigate full dashboard flow', async ({ page }) => {
  // Login → Dashboard → Menu pages → Back to dashboard
  await page.goto('/teacher/login');
  await page.fill('input[type="email"]', 'teacher@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/teacher/dashboard');

  // Navigate to each menu page
  await page.click('text=Assignment Creation');
  await expect(page).toHaveURL('/teacher/assignments');
  await page.click('text=Dashboard'); // Breadcrumb
  await expect(page).toHaveURL('/teacher/dashboard');

  // Repeat for all 6 menu items...
});
```

### Test 2: Responsive Behavior
```typescript
test('dashboard is responsive on all screen sizes', async ({ page }) => {
  // Mobile (375px)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/teacher/dashboard');
  await expect(page.locator('.progress-table-mobile')).toBeVisible(); // Card layout
  await expect(page.locator('.menu-grid')).toHaveCSS('grid-template-columns', '1fr');

  // Tablet (768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.menu-grid')).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');

  // Desktop (1280px)
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.progress-table-desktop')).toBeVisible(); // Full table
  await expect(page.locator('.menu-grid')).toHaveCSS('grid-template-columns', 'repeat(3, 1fr)');
});
```

### Test 3: Mock Data Rendering
```typescript
test('dashboard displays mock student data', async ({ page }) => {
  await page.goto('/teacher/dashboard');

  // Expect ~50 students
  const studentRows = page.locator('[data-testid="student-row"]');
  await expect(studentRows).toHaveCount(50);

  // Each row has required fields
  const firstRow = studentRows.first();
  await expect(firstRow.locator('[data-testid="student-name"]')).toBeVisible();
  await expect(firstRow.locator('[data-testid="study-sessions"]')).toBeVisible();
  await expect(firstRow.locator('[data-testid="cleared-questions"]')).toBeVisible();
  await expect(firstRow.locator('[data-testid="accuracy-rate"]')).toBeVisible();
});
```

---

## Component Test Scenarios (Jest + RTL)

These scenarios should be automated as component unit tests:

### ProgressTable Component
```typescript
describe('ProgressTable', () => {
  it('renders student progress data', () => {
    const students = generateMockStudents(5);
    const filter: ProgressFilter = { period: 'last-month' };
    render(<ProgressTable students={students} filter={filter} />);

    students.forEach(student => {
      expect(screen.getByText(student.name)).toBeInTheDocument();
    });
  });

  it('shows empty state when no students', () => {
    const filter: ProgressFilter = { period: 'last-month' };
    render(<ProgressTable students={[]} filter={filter} emptyMessage="No students" />);

    expect(screen.getByText('No students')).toBeInTheDocument();
  });

  it('calls onFilterChange when filter is changed', () => {
    const onFilterChange = jest.fn();
    const filter: ProgressFilter = { period: 'last-month' };
    render(<ProgressTable students={[]} filter={filter} onFilterChange={onFilterChange} />);

    fireEvent.click(screen.getByText('Last Week'));
    expect(onFilterChange).toHaveBeenCalledWith({ period: 'last-week' });
  });
});
```

### NotificationsList Component
```typescript
describe('NotificationsList', () => {
  it('renders notifications with correct type icons', () => {
    const notifications = generateMockNotifications(5);
    render(<NotificationsList notifications={notifications} />);

    notifications.forEach(notif => {
      expect(screen.getByText(notif.title)).toBeInTheDocument();
      expect(screen.getByText(notif.message)).toBeInTheDocument();
    });
  });

  it('shows empty state when no notifications', () => {
    render(<NotificationsList notifications={[]} emptyMessage="No new notifications" />);

    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });
});
```

---

## Success Criteria

All scenarios must pass for the feature to be considered complete:

- ✅ All 8 manual scenarios validated
- ✅ All 3 Playwright E2E tests pass
- ✅ All component unit tests pass (ProgressTable, NotificationsList, MenuGrid, BreadcrumbNav, LoginForm)
- ✅ Responsive design verified on mobile (375px), tablet (768px), desktop (1280px)
- ✅ No console errors or warnings
- ✅ Local build succeeds: `npm run build`
- ✅ No TypeScript errors
- ✅ No ESLint errors: `npm run lint`

---

## Troubleshooting

### Issue: Build fails with TypeScript errors
**Solution**: Run `npm run build` to see specific errors. Fix type mismatches in components.

### Issue: Components don't render
**Solution**: Check that mock data generators are imported and called correctly.

### Issue: Responsive layout doesn't change
**Solution**: Verify Tailwind responsive classes (`sm:`, `md:`, `lg:`) are applied correctly.

### Issue: Navigation doesn't work
**Solution**: Ensure `next/link` is used for all internal navigation, not `<a>` tags.

---

**Quickstart Status**: ✅ READY - All test scenarios defined, ready for TDD implementation in Phase 4.
