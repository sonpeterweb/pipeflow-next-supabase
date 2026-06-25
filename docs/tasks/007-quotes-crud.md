# 007 — Quotes CRUD

## Goal

Implement quote management for PipeFlow.

Users should be able to create, view, edit, and delete quotes linked to customers and jobs.

## Requirements

- Use Supabase database
- Use Server Components for data loading
- Use Server Actions for mutations
- Use Zod validation
- Use shadcn/ui components
- Respect RLS and authenticated user ownership

## Pages

Implement or update:

- `/dashboard/quotes`

## Features

### Quote List

Show quotes with:

- Quote number
- Customer
- Job
- Amount
- Status
- Issued date
- Accepted date
- Edit action
- Delete action

### Create Quote

Fields:

- quote_number optional
- customer_id optional
- job_id optional
- amount required
- status required
- issued_at optional
- accepted_at optional

### Edit Quote

Allow existing quotes to be edited.

### Delete Quote

Allow quotes to be deleted.

## Valid Statuses

- draft
- sent
- accepted
- declined
- expired

## Testing

Add at least one focused test for quote validation.

## Out of Scope

Do not implement:

- PDF generation
- Email sending
- Payments
- Invoice conversion
- AI quote generation

## Acceptance Criteria

- User can view quotes
- User can create a quote
- User can edit a quote
- User can delete a quote
- Quotes can link to customers and jobs
- Server Actions are used
- Zod validation exists
- pnpm test passes
- pnpm lint passes
- pnpm build passes