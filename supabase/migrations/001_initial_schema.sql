-- =============================================================================
-- Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- Tables
-- =============================================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  full_name text,
  company_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers (id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  address text,
  status text NOT NULL DEFAULT 'lead',
  priority text,
  estimated_amount numeric(10, 2),
  scheduled_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT jobs_status_check CHECK (
    status IN (
      'lead',
      'quoted',
      'scheduled',
      'in_progress',
      'completed',
      'paid',
      'cancelled'
    )
  ),
  CONSTRAINT jobs_priority_check CHECK (
    priority IS NULL
    OR priority IN ('low', 'medium', 'high', 'urgent')
  )
);

CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers (id) ON DELETE SET NULL,
  job_id uuid REFERENCES public.jobs (id) ON DELETE SET NULL,
  quote_number text,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  issued_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quotes_status_check CHECK (
    status IN ('draft', 'sent', 'accepted', 'declined', 'expired')
  )
);

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers (id) ON DELETE SET NULL,
  job_id uuid REFERENCES public.jobs (id) ON DELETE SET NULL,
  invoice_number text,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT invoices_status_check CHECK (
    status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')
  )
);


-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX customers_user_id_idx ON public.customers (user_id);
CREATE INDEX jobs_user_id_idx ON public.jobs (user_id);
CREATE INDEX jobs_customer_id_idx ON public.jobs (customer_id);
CREATE INDEX jobs_status_idx ON public.jobs (status);
CREATE INDEX quotes_user_id_idx ON public.quotes (user_id);
CREATE INDEX quotes_job_id_idx ON public.quotes (job_id);
CREATE INDEX invoices_user_id_idx ON public.invoices (user_id);
CREATE INDEX invoices_job_id_idx ON public.invoices (job_id);
CREATE INDEX invoices_status_idx ON public.invoices (status);


-- =============================================================================
-- Functions
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'company_name'
  );

  RETURN NEW;
END;
$$;


-- =============================================================================
-- Triggers
-- =============================================================================

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER create_profile_after_user_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();


-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- profiles policies
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can select their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (id = auth.uid());


-- -----------------------------------------------------------------------------
-- customers policies
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can select their own customers"
ON public.customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customers"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customers"
ON public.customers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own customers"
ON public.customers
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- -----------------------------------------------------------------------------
-- jobs policies
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can select their own jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = jobs.customer_id
        AND customers.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update their own jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = jobs.customer_id
        AND customers.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete their own jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- -----------------------------------------------------------------------------
-- quotes policies
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can select their own quotes"
ON public.quotes
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own quotes"
ON public.quotes
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = quotes.customer_id
        AND customers.user_id = auth.uid()
    )
  )
  AND (
    job_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.jobs
      WHERE jobs.id = quotes.job_id
        AND jobs.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update their own quotes"
ON public.quotes
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = quotes.customer_id
        AND customers.user_id = auth.uid()
    )
  )
  AND (
    job_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.jobs
      WHERE jobs.id = quotes.job_id
        AND jobs.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete their own quotes"
ON public.quotes
FOR DELETE
TO authenticated
USING (user_id = auth.uid());


-- -----------------------------------------------------------------------------
-- invoices policies
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can select their own invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own invoices"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = invoices.customer_id
        AND customers.user_id = auth.uid()
    )
  )
  AND (
    job_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.jobs
      WHERE jobs.id = invoices.job_id
        AND jobs.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update their own invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND (
    customer_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.id = invoices.customer_id
        AND customers.user_id = auth.uid()
    )
  )
  AND (
    job_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.jobs
      WHERE jobs.id = invoices.job_id
        AND jobs.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete their own invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
