# 005 — Customers CRUD

## Goal

Implement customer management for PipeFlow.

Users should be able to create, view, edit, and delete their own customers.

## Requirements

- Use Supabase database
- Use Server Components for data loading
- Use Server Actions for create/update/delete
- Use Zod validation
- Use shadcn/ui components
- Respect RLS and authenticated user ownership
- Keep UI simple and mobile responsive

## Pages

Implement or update:

- `/dashboard/customers`

## Features

### Customer List

Show a list/table of customers with:

- Name
- Company name
- Email
- Phone
- Address
- Created date
- Edit action
- Delete action

### Create Customer

Add a form to create a customer.

Fields:

- name required
- company_name optional
- email optional
- phone optional
- address optional
- notes optional

### Edit Customer

Allow existing customers to be edited.

### Delete Customer

Allow customers to be deleted.

Use a simple confirmation pattern before delete.

## Validation

Use Zod for customer input.

Rules:

- name is required
- email must be valid if provided
- optional fields may be empty

## Testing

Add at least one focused test for customer validation or customer utility logic.

## Out of Scope

Do not implement:

- Jobs CRUD
- Quotes CRUD
- Invoices CRUD
- Dashboard metrics
- Search/filtering unless very simple
- Pagination
- Bulk actions

## Acceptance Criteria

- User can view their customers
- User can create a customer
- User can edit a customer
- User can delete a customer
- Server Actions are used for mutations
- Zod validation exists
- RLS-safe queries are used
- pnpm test passes
- pnpm lint passes
- pnpm build passes