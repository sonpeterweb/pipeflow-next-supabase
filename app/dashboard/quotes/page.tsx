import { redirect } from "next/navigation";

import {
  createQuote,
  deleteQuote,
  updateQuote,
} from "@/app/dashboard/quotes/actions";
import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card";
import { EmptyState as EmptyStateView } from "@/components/ui/empty-state";
import { Field, FieldLabel, Input, Select } from "@/components/ui/form-controls";
import { quoteStatuses } from "@/lib/quotes/validation";
import { createClient } from "@/lib/supabase/server";

type Quote = {
  id: string;
  quote_number: string | null;
  customer_id: string | null;
  job_id: string | null;
  amount: number;
  status: (typeof quoteStatuses)[number];
  issued_at: string | null;
  accepted_at: string | null;
  created_at: string;
};

type CustomerOption = {
  id: string;
  name: string;
  company_name: string | null;
};

type JobOption = {
  id: string;
  title: string;
  customer_id: string | null;
};

type QuotesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const statusLabels: Record<(typeof quoteStatuses)[number], string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

function fieldValue(value: string | null) {
  return value ?? "";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 16);
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-NZ", {
    currency: "NZD",
    style: "currency",
  }).format(value);
}

function getCustomerName(
  customerId: string | null,
  customersById: Map<string, CustomerOption>,
) {
  if (!customerId) {
    return "No customer";
  }

  return customersById.get(customerId)?.name ?? "Customer unavailable";
}

function getJobTitle(jobId: string | null, jobsById: Map<string, JobOption>) {
  if (!jobId) {
    return "No job";
  }

  return jobsById.get(jobId)?.title ?? "Job unavailable";
}

function Message({
  message,
  tone,
}: {
  message: string;
  tone: "error" | "success";
}) {
  const classes =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-800";

  return (
    <p className={`rounded-lg border px-4 py-3 text-sm font-medium ${classes}`}>
      {message}
    </p>
  );
}

function TextField({
  defaultValue,
  label,
  name,
  required,
  step,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  step?: string;
  type?: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        defaultValue={defaultValue}
        name={name}
        required={required}
        step={step}
        type={type}
      />
    </Field>
  );
}

function CustomerSelect({
  customers,
  defaultValue,
}: {
  customers: CustomerOption[];
  defaultValue?: string | null;
}) {
  return (
    <Field>
      <FieldLabel>Customer</FieldLabel>
      <Select
        defaultValue={defaultValue ?? ""}
        name="customer_id"
      >
        <option value="">No customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.company_name
              ? `${customer.name} (${customer.company_name})`
              : customer.name}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function JobSelect({
  defaultValue,
  jobs,
}: {
  defaultValue?: string | null;
  jobs: JobOption[];
}) {
  return (
    <Field>
      <FieldLabel>Job</FieldLabel>
      <Select
        defaultValue={defaultValue ?? ""}
        name="job_id"
      >
        <option value="">No job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function StatusSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <Field>
      <FieldLabel>Status</FieldLabel>
      <Select
        defaultValue={defaultValue ?? "draft"}
        name="status"
        required
      >
        {quoteStatuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function QuoteForm({
  action,
  customers,
  jobs,
  quote,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  customers: CustomerOption[];
  jobs: JobOption[];
  quote?: Quote;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <TextField
        defaultValue={fieldValue(quote?.quote_number ?? null)}
        label="Quote number"
        name="quote_number"
      />
      <TextField
        defaultValue={quote ? String(quote.amount) : "0"}
        label="Amount"
        name="amount"
        required
        step="0.01"
        type="number"
      />
      <CustomerSelect customers={customers} defaultValue={quote?.customer_id} />
      <JobSelect defaultValue={quote?.job_id} jobs={jobs} />
      <StatusSelect defaultValue={quote?.status} />
      <TextField
        defaultValue={formatDateTimeLocal(quote?.issued_at ?? null)}
        label="Issued date"
        name="issued_at"
        type="datetime-local"
      />
      <TextField
        defaultValue={formatDateTimeLocal(quote?.accepted_at ?? null)}
        label="Accepted date"
        name="accepted_at"
        type="datetime-local"
      />
      <div className="sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function EmptyState() {
  return (
    <EmptyStateView
      description="Create your first quote and link it to a customer or job when needed."
      title="No quotes yet"
    />
  );
}

function QuoteCard({
  customers,
  customersById,
  jobs,
  jobsById,
  quote,
}: {
  customers: CustomerOption[];
  customersById: Map<string, CustomerOption>;
  jobs: JobOption[];
  jobsById: Map<string, JobOption>;
  quote: Quote;
}) {
  const updateQuoteWithId = updateQuote.bind(null, quote.id);
  const deleteQuoteWithId = deleteQuote.bind(null, quote.id);
  const quoteTitle = quote.quote_number || "Untitled quote";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {quoteTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {getCustomerName(quote.customer_id, customersById)} ·{" "}
              {getJobTitle(quote.job_id, jobsById)}
            </p>
          </div>
          <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            {statusLabels[quote.status]}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
          <p>
            <span className="font-medium text-slate-800">Amount:</span>{" "}
            {formatAmount(quote.amount)}
          </p>
          <p>
            <span className="font-medium text-slate-800">Issued:</span>{" "}
            {formatDate(quote.issued_at)}
          </p>
          <p>
            <span className="font-medium text-slate-800">Accepted:</span>{" "}
            {formatDate(quote.accepted_at)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5">
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Edit quote
          </summary>
          <div className="mt-4">
            <QuoteForm
              action={updateQuoteWithId}
              customers={customers}
              jobs={jobs}
              quote={quote}
              submitLabel="Save changes"
            />
          </div>
        </details>

        <details className="rounded-lg border border-red-200 bg-red-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-800">
            Delete quote
          </summary>
          <form action={deleteQuoteWithId} className="mt-4">
            <p className="mb-3 text-sm text-red-700">
              This permanently removes {quoteTitle}.
            </p>
            <Button type="submit" variant="destructive">
              Confirm delete
            </Button>
          </form>
        </details>
      </div>
    </article>
  );
}

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [quotesResult, customersResult, jobsResult] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "id,quote_number,customer_id,job_id,amount,status,issued_at,accepted_at,created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id,name,company_name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("jobs")
      .select("id,title,customer_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const quotes = (quotesResult.data ?? []) as Quote[];
  const customers = (customersResult.data ?? []) as CustomerOption[];
  const jobs = (jobsResult.data ?? []) as JobOption[];
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));
  const jobsById = new Map(jobs.map((job) => [job.id, job]));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Quotes
        </h1>
        <p className="mt-2 text-slate-600">
          Manage quote drafts, sent estimates, and acceptance status.
        </p>
      </div>

      {params.error ? <Message message={params.error} tone="error" /> : null}
      {params.success ? (
        <Message message={params.success} tone="success" />
      ) : null}
      {quotesResult.error ? (
        <Message message={quotesResult.error.message} tone="error" />
      ) : null}
      {customersResult.error ? (
        <Message message={customersResult.error.message} tone="error" />
      ) : null}
      {jobsResult.error ? (
        <Message message={jobsResult.error.message} tone="error" />
      ) : null}

      <CardSection
        description="Create a draft or sent estimate for a customer or job."
        title="Add quote"
      >
        <QuoteForm
          action={createQuote}
          customers={customers}
          jobs={jobs}
          submitLabel="Create quote"
        />
      </CardSection>

      <div className="space-y-4">
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <QuoteCard
              customers={customers}
              customersById={customersById}
              jobs={jobs}
              jobsById={jobsById}
              key={quote.id}
              quote={quote}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
