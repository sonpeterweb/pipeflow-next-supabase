# 008 — Invoices CRUD

## Goal

Implement invoice management for PipeFlow.

Users should be able to create, view, edit, and delete invoices linked to customers and jobs.

## Requirements

- Use Supabase database
- Use Server Components for data loading
- Use Server Actions for mutations
- Use Zod validation
- Use shadcn/ui components
- Respect RLS and authenticated user ownership

## Pages

Implement or update:

- `/dashboard/invoices`

## Features

### Invoice List

Show invoices with:

- Invoice number
- Customer
- Job
- Amount
- Status
- Issued date
- Due date
- Paid date
- Edit action
- Delete action

### Create Invoice

Fields:

- invoice_number optional
- customer_id optional
- job_id optional
- amount required
- status required
- issued_at optional
- due_at optional
- paid_at optional

### Edit Invoice

Allow existing invoices to be edited.

### Delete Invoice

Allow invoices to be deleted.

## Valid Statuses

- draft
- sent
- paid
- overdue
- cancelled

## Testing

Add at least one focused test for invoice validation.

## Out of Scope

Do not implement:

- Stripe payments
- PDF generation
- Email sending
- Recurring invoices
- Tax calculations
- Accounting integrations

## Acceptance Criteria

- User can view invoices
- User can create an invoice
- User can edit an invoice
- User can delete an invoice
- Invoices can link to customers and jobs
- Server Actions are used
- Zod validation exists
- pnpm test passes
- pnpm lint passes
- pnpm build passes