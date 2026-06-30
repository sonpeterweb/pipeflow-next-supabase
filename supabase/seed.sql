-- PipeFlow demo/dev seed data.
--
-- This file is intentionally for local/demo use only.
-- Do not run it against production data.
--
-- Before running:
-- 1. Create a demo user through the app signup flow.
-- 2. Find that user's id in Supabase:
--    select id, email from auth.users order by created_at desc;
-- 3. Replace the placeholder demo_user_id below with the demo user's auth id.

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000000';

  auckland_property_care_id uuid := '10000000-0000-0000-0000-000000000001';
  north_shore_villas_id uuid := '10000000-0000-0000-0000-000000000002';
  henderson_family_home_id uuid := '10000000-0000-0000-0000-000000000003';

  kitchen_leak_repair_id uuid := '20000000-0000-0000-0000-000000000001';
  hot_water_cylinder_id uuid := '20000000-0000-0000-0000-000000000002';
  bathroom_inspection_id uuid := '20000000-0000-0000-0000-000000000003';
  emergency_blocked_drain_id uuid := '20000000-0000-0000-0000-000000000004';

  quote_1001_id uuid := '30000000-0000-0000-0000-000000000001';
  quote_1002_id uuid := '30000000-0000-0000-0000-000000000002';
  quote_1003_id uuid := '30000000-0000-0000-0000-000000000003';

  invoice_1001_id uuid := '40000000-0000-0000-0000-000000000001';
  invoice_1002_id uuid := '40000000-0000-0000-0000-000000000002';
  invoice_1003_id uuid := '40000000-0000-0000-0000-000000000003';
begin
  if demo_user_id = '00000000-0000-0000-0000-000000000000' then
    raise exception 'Replace demo_user_id in supabase/seed.sql with an id from auth.users before running.';
  end if;

  if not exists (select 1 from auth.users where id = demo_user_id) then
    raise exception 'No auth.users row found for demo_user_id %. Create a demo user first.', demo_user_id;
  end if;

  insert into public.customers (
    id,
    user_id,
    name,
    company_name,
    email,
    phone,
    address,
    notes
  )
  values
    (
      auckland_property_care_id,
      demo_user_id,
      'Auckland Property Care',
      'Auckland Property Care Ltd',
      'admin@demo.example',
      '021 000 1001',
      '12 Queen Street, Auckland',
      'Commercial property maintenance client with several central Auckland sites.'
    ),
    (
      north_shore_villas_id,
      demo_user_id,
      'North Shore Villas',
      'North Shore Villas',
      'manager@demo.example',
      '021 000 1002',
      '8 Lake Road, Takapuna',
      'Body corporate contact for villa maintenance and plumbing upgrades.'
    ),
    (
      henderson_family_home_id,
      demo_user_id,
      'Henderson Family Home',
      null,
      'homeowner@demo.example',
      '021 000 1003',
      '24 Railside Avenue, Henderson',
      'Residential customer for inspection and repair work.'
    )
  on conflict (id) do update
  set
    user_id = excluded.user_id,
    name = excluded.name,
    company_name = excluded.company_name,
    email = excluded.email,
    phone = excluded.phone,
    address = excluded.address,
    notes = excluded.notes;

  insert into public.jobs (
    id,
    user_id,
    customer_id,
    title,
    description,
    address,
    status,
    priority,
    estimated_amount,
    scheduled_date
  )
  values
    (
      kitchen_leak_repair_id,
      demo_user_id,
      auckland_property_care_id,
      'Kitchen Leak Repair',
      'Trace and repair leak under a commercial kitchen sink.',
      '12 Queen Street, Auckland',
      'in_progress',
      'high',
      650.00,
      now() + interval '2 days'
    ),
    (
      hot_water_cylinder_id,
      demo_user_id,
      north_shore_villas_id,
      'Hot Water Cylinder Replacement',
      'Replace aging hot water cylinder and test pressure relief valve.',
      '8 Lake Road, Takapuna',
      'scheduled',
      'urgent',
      1850.00,
      now() + interval '7 days'
    ),
    (
      bathroom_inspection_id,
      demo_user_id,
      henderson_family_home_id,
      'Bathroom Plumbing Inspection',
      'Inspect bathroom plumbing after renovation and provide final notes.',
      '24 Railside Avenue, Henderson',
      'completed',
      'medium',
      280.00,
      now() - interval '5 days'
    ),
    (
      emergency_blocked_drain_id,
      demo_user_id,
      auckland_property_care_id,
      'Emergency Blocked Drain',
      'Assess blocked stormwater drain and prepare repair plan.',
      '12 Queen Street, Auckland',
      'lead',
      'urgent',
      420.00,
      null
    )
  on conflict (id) do update
  set
    user_id = excluded.user_id,
    customer_id = excluded.customer_id,
    title = excluded.title,
    description = excluded.description,
    address = excluded.address,
    status = excluded.status,
    priority = excluded.priority,
    estimated_amount = excluded.estimated_amount,
    scheduled_date = excluded.scheduled_date;

  insert into public.quotes (
    id,
    user_id,
    customer_id,
    job_id,
    quote_number,
    amount,
    status,
    issued_at,
    accepted_at
  )
  values
    (
      quote_1001_id,
      demo_user_id,
      north_shore_villas_id,
      hot_water_cylinder_id,
      'Q-1001',
      1850.00,
      'sent',
      now() - interval '1 day',
      null
    ),
    (
      quote_1002_id,
      demo_user_id,
      henderson_family_home_id,
      bathroom_inspection_id,
      'Q-1002',
      280.00,
      'accepted',
      now() - interval '10 days',
      now() - interval '8 days'
    ),
    (
      quote_1003_id,
      demo_user_id,
      auckland_property_care_id,
      emergency_blocked_drain_id,
      'Q-1003',
      420.00,
      'draft',
      null,
      null
    )
  on conflict (id) do update
  set
    user_id = excluded.user_id,
    customer_id = excluded.customer_id,
    job_id = excluded.job_id,
    quote_number = excluded.quote_number,
    amount = excluded.amount,
    status = excluded.status,
    issued_at = excluded.issued_at,
    accepted_at = excluded.accepted_at;

  insert into public.invoices (
    id,
    user_id,
    customer_id,
    job_id,
    invoice_number,
    amount,
    status,
    issued_at,
    due_at,
    paid_at
  )
  values
    (
      invoice_1001_id,
      demo_user_id,
      henderson_family_home_id,
      bathroom_inspection_id,
      'INV-1001',
      280.00,
      'paid',
      now() - interval '7 days',
      now() + interval '7 days',
      now() - interval '2 days'
    ),
    (
      invoice_1002_id,
      demo_user_id,
      auckland_property_care_id,
      kitchen_leak_repair_id,
      'INV-1002',
      650.00,
      'sent',
      now() - interval '1 day',
      now() + interval '13 days',
      null
    ),
    (
      invoice_1003_id,
      demo_user_id,
      auckland_property_care_id,
      emergency_blocked_drain_id,
      'INV-1003',
      420.00,
      'overdue',
      now() - interval '21 days',
      now() - interval '7 days',
      null
    )
  on conflict (id) do update
  set
    user_id = excluded.user_id,
    customer_id = excluded.customer_id,
    job_id = excluded.job_id,
    invoice_number = excluded.invoice_number,
    amount = excluded.amount,
    status = excluded.status,
    issued_at = excluded.issued_at,
    due_at = excluded.due_at,
    paid_at = excluded.paid_at;
end $$;
