create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company_name text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  description text,
  address text,
  status text not null default 'lead',
  priority text,
  estimated_amount numeric(10, 2),
  scheduled_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_status_check check (
    status in (
      'lead',
      'quoted',
      'scheduled',
      'in_progress',
      'completed',
      'paid',
      'cancelled'
    )
  ),
  constraint jobs_priority_check check (
    priority is null
    or priority in ('low', 'medium', 'high', 'urgent')
  )
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  quote_number text,
  amount numeric(10, 2) not null default 0,
  status text not null default 'draft',
  issued_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quotes_status_check check (
    status in ('draft', 'sent', 'accepted', 'declined', 'expired')
  )
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  invoice_number text,
  amount numeric(10, 2) not null default 0,
  status text not null default 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_status_check check (
    status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')
  )
);

create index customers_user_id_idx on public.customers(user_id);
create index jobs_user_id_idx on public.jobs(user_id);
create index jobs_customer_id_idx on public.jobs(customer_id);
create index jobs_status_idx on public.jobs(status);
create index quotes_user_id_idx on public.quotes(user_id);
create index quotes_job_id_idx on public.quotes(job_id);
create index invoices_user_id_idx on public.invoices(user_id);
create index invoices_job_id_idx on public.invoices(job_id);
create index invoices_status_idx on public.invoices(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger set_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger set_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

create trigger set_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company_name'
  );

  return new;
end;
$$;

create trigger create_profile_after_user_insert
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.jobs enable row level security;
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;

create policy "Users can select their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can delete their own profile"
on public.profiles for delete
to authenticated
using (id = auth.uid());

create policy "Users can select their own customers"
on public.customers for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own customers"
on public.customers for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own customers"
on public.customers for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own customers"
on public.customers for delete
to authenticated
using (user_id = auth.uid());

create policy "Users can select their own jobs"
on public.jobs for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own jobs"
on public.jobs for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = jobs.customer_id
        and customers.user_id = auth.uid()
    )
  )
);

create policy "Users can update their own jobs"
on public.jobs for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = jobs.customer_id
        and customers.user_id = auth.uid()
    )
  )
);

create policy "Users can delete their own jobs"
on public.jobs for delete
to authenticated
using (user_id = auth.uid());

create policy "Users can select their own quotes"
on public.quotes for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own quotes"
on public.quotes for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = quotes.customer_id
        and customers.user_id = auth.uid()
    )
  )
  and (
    job_id is null
    or exists (
      select 1
      from public.jobs
      where jobs.id = quotes.job_id
        and jobs.user_id = auth.uid()
    )
  )
);

create policy "Users can update their own quotes"
on public.quotes for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = quotes.customer_id
        and customers.user_id = auth.uid()
    )
  )
  and (
    job_id is null
    or exists (
      select 1
      from public.jobs
      where jobs.id = quotes.job_id
        and jobs.user_id = auth.uid()
    )
  )
);

create policy "Users can delete their own quotes"
on public.quotes for delete
to authenticated
using (user_id = auth.uid());

create policy "Users can select their own invoices"
on public.invoices for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own invoices"
on public.invoices for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = invoices.customer_id
        and customers.user_id = auth.uid()
    )
  )
  and (
    job_id is null
    or exists (
      select 1
      from public.jobs
      where jobs.id = invoices.job_id
        and jobs.user_id = auth.uid()
    )
  )
);

create policy "Users can update their own invoices"
on public.invoices for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    customer_id is null
    or exists (
      select 1
      from public.customers
      where customers.id = invoices.customer_id
        and customers.user_id = auth.uid()
    )
  )
  and (
    job_id is null
    or exists (
      select 1
      from public.jobs
      where jobs.id = invoices.job_id
        and jobs.user_id = auth.uid()
    )
  )
);

create policy "Users can delete their own invoices"
on public.invoices for delete
to authenticated
using (user_id = auth.uid());
