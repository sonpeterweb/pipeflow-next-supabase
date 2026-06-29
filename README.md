# PipeFlow

PipeFlow is a portfolio SaaS demo for small trade businesses in New Zealand. It helps owner-operated plumbing and trade teams manage customers, jobs, quotes, invoices, and dashboard metrics from a protected workspace.

The project is designed to demonstrate a production-style MVP architecture: authenticated routes, Supabase-backed CRUD workflows, Row Level Security, Server Components, Server Actions, validation, and focused tests.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres with Row Level Security
- Server Components and Server Actions
- Zod validation
- Vitest, React Testing Library, and jsdom
- pnpm

## Features

- Public marketing page
- Email/password authentication with Supabase
- Protected dashboard routes
- Dashboard metrics from Supabase data
- Customers CRUD
- Jobs CRUD with optional customer links
- Quotes CRUD with optional customer and job links
- Invoices CRUD with optional customer and job links
- SQL migration for schema, indexes, triggers, and RLS policies
- Focused unit and validation tests

## Architecture Overview

- `app/` contains the Next.js App Router pages, layouts, and Server Actions.
- `app/dashboard/*` contains protected SaaS workspace pages.
- `lib/*/validation.ts` contains Zod validation for form-backed resources.
- `lib/supabase/` contains browser, server, and proxy Supabase clients.
- `supabase/migrations/001_initial_schema.sql` contains the database schema and RLS policies.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in `.env.local` with values from your Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not commit real Supabase secrets.

Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Apply the migration in `supabase/migrations/001_initial_schema.sql`.
4. Confirm email/password auth is enabled in Supabase Auth.
5. Start the Next.js dev server with `pnpm dev`.

If you use the Supabase CLI, run the migration through your normal local database flow. Otherwise, paste the SQL migration into the Supabase SQL editor for a demo project.

The migration creates:

- `profiles`
- `customers`
- `jobs`
- `quotes`
- `invoices`
- indexes for common dashboard queries
- `updated_at` triggers
- RLS policies scoped to `auth.uid()`

## Commands

```bash
pnpm dev      # start local development
pnpm build    # create a production build
pnpm start    # run the production build
pnpm lint     # run ESLint
pnpm test     # run Vitest tests
```

## Testing

Tests are intentionally focused and lightweight for a portfolio SaaS project. They cover shared utilities, form validation, and dashboard metric calculations.

```bash
pnpm test
```

## Deployment

This app is ready for Vercel-style deployment:

1. Create a hosted Supabase project.
2. Apply the SQL migration.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the deployment environment.
4. Deploy the Next.js app.

No service role key is required for the implemented app flows.

## Roadmap

Potential future work:

- Improved settings page
- Recent activity on the dashboard
- Seed script for local-only demo data
- Role-based teams
- Quote/invoice PDF generation
- Payments
- Customer portal

These are outside the current MVP.