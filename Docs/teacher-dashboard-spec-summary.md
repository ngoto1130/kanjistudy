# Teacher Dashboard Mockup - Specification Summary

**Spec File**: `/Users/itounorihiro/Documents/projects/KanjiAppWithSpecKit/kanjistudy/specs/001-docs-teacher1stspec-md/spec.md`

**Branch**: `001-docs-teacher1stspec-md`

**Status**: Specification Complete - Ready for Planning

## Overview

Creating mockup-only teacher dashboard for kanji learning application. No real implementation - all mock code and data.

## Key Clarifications Integrated

### School System Context
- **Non-homeroom system**: ~10 teachers managing ~50 students collectively
- **Session frequency**: Students attend every 2 weeks to 1 month
- **Teacher assignment**: Teachers assigned to individual sessions (not to specific students permanently)

### Assignment Workflow
- Teachers assign 10-30 kanji per student
- Questions "cleared" after 4 consecutive correct answers (configurable)
- When all assigned kanji are cleared → teacher receives notification

### Dashboard Components

#### 1. Student Progress Table
Displays all ~50 students with:
- Student name
- Study sessions count (学習回数)
- Cleared questions count
- Accuracy rate
- **Time filters**: Last Week, Last Month, Custom Range
- **Empty state**: Show column headers only (no data rows)

#### 2. Notifications Section
Two notification types:
1. **Assignment completion**: "Student X completed all assigned kanji" (needs new assignment)
2. **System notifications**: "Teacher Y registered new student Z"

Display format:
- Title
- Brief message preview
- Date
- Type icon
- **Empty state**: "No new notifications"

#### 3. Navigation
- **Breadcrumb navigation**: "Dashboard > [Current Page Name]"
- Clickable breadcrumbs to return to dashboard

#### 4. Menu Pages (All Mockups)
1. Assignment Creation
2. Question Management
3. Student Management
4. Parent Management
5. Learning Status Report
6. Administrator Functions

## Next Steps

Run `/plan` to generate implementation plan for the mockup screens.

## Business Rules Summary

- Dashboard shows ALL students (not filtered by teacher)
- Non-homeroom model: any teacher can work with any student
- Assignment completion triggers notification
- Progress metrics filterable by time period
- All functionality is mockup only (no real data/auth)
