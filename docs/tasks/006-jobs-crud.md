# 006 — Jobs CRUD

## Goal

Implement job management for PipeFlow.

Users should be able to create, view, edit, and delete jobs linked to customers.

## Requirements

- Use Supabase database
- Use Server Components for data loading
- Use Server Actions for create/update/delete
- Use Zod validation
- Use shadcn/ui components
- Respect RLS and authenticated user ownership

## Pages

Implement or update:

- `/dashboard/jobs`

## Features

### Job List

Show jobs with:

- Title
- Customer
- Status
- Priority
- Scheduled date
- Estimated amount
- Address
- Edit action
- Delete action

### Create Job

Fields:

- title required
- customer_id optional
- description optional
- address optional
- status required
- priority optional
- estimated_amount optional
- scheduled_date optional

### Edit Job

Allow existing jobs to be edited.

### Delete Job

Allow jobs to be deleted.

## Valid Statuses

- lead
- quoted
- scheduled
- in_progress
- completed
- paid
- cancelled

## Valid Priorities

- low
- medium
- high
- urgent

## Testing

Add at least one focused test for job validation.

## Out of Scope

Do not implement:

- Quotes CRUD
- Invoices CRUD
- Dashboard metrics
- Calendar view
- Drag and drop
- Notifications

## Acceptance Criteria

- User can view jobs
- User can create a job
- User can edit a job
- User can delete a job
- Jobs can be linked to customers
- Server Actions are used
- Zod validation exists
- pnpm test passes
- pnpm lint passes
- pnpm build passes