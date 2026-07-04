import { redirect } from "next/navigation";

import { createJob, deleteJob, updateJob } from "@/app/dashboard/jobs/actions";
import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card";
import { EmptyState as EmptyStateView } from "@/components/ui/empty-state";
import {
  Field,
  FieldLabel,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form-controls";
import { jobPriorities, jobStatuses } from "@/lib/jobs/validation";
import { createClient } from "@/lib/supabase/server";

type Job = {
  id: string;
  customer_id: string | null;
  title: string;
  description: string | null;
  address: string | null;
  status: (typeof jobStatuses)[number];
  priority: (typeof jobPriorities)[number] | null;
  estimated_amount: number | null;
  scheduled_date: string | null;
  created_at: string;
};

type CustomerOption = {
  id: string;
  name: string;
  company_name: string | null;
};

type JobsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const statusLabels: Record<(typeof jobStatuses)[number], string> = {
  lead: "Lead",
  quoted: "Quoted",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  paid: "Paid",
  cancelled: "Cancelled",
};

const priorityLabels: Record<(typeof jobPriorities)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

function fieldValue(value: string | null) {
  return value ?? "";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
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

function formatAmount(value: number | null) {
  if (value === null) {
    return "Not set";
  }

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

function TextAreaField({
  defaultValue,
  label,
  name,
}: {
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <Field className="sm:col-span-2">
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        defaultValue={defaultValue}
        name={name}
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

function StatusSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <Field>
      <FieldLabel>Status</FieldLabel>
      <Select
        defaultValue={defaultValue ?? "lead"}
        name="status"
        required
      >
        {jobStatuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function PrioritySelect({ defaultValue }: { defaultValue?: string | null }) {
  return (
    <Field>
      <FieldLabel>Priority</FieldLabel>
      <Select
        defaultValue={defaultValue ?? ""}
        name="priority"
      >
        <option value="">No priority</option>
        {jobPriorities.map((priority) => (
          <option key={priority} value={priority}>
            {priorityLabels[priority]}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function JobForm({
  action,
  customers,
  job,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  customers: CustomerOption[];
  job?: Job;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <TextField
        defaultValue={job?.title}
        label="Title"
        name="title"
        required
      />
      <CustomerSelect customers={customers} defaultValue={job?.customer_id} />
      <StatusSelect defaultValue={job?.status} />
      <PrioritySelect defaultValue={job?.priority} />
      <TextField
        defaultValue={
          job?.estimated_amount === null || job?.estimated_amount === undefined
            ? ""
            : String(job.estimated_amount)
        }
        label="Estimated amount"
        name="estimated_amount"
        step="0.01"
        type="number"
      />
      <TextField
        defaultValue={formatDateTimeLocal(job?.scheduled_date ?? null)}
        label="Scheduled date"
        name="scheduled_date"
        type="datetime-local"
      />
      <Field className="sm:col-span-2">
        <FieldLabel>Address</FieldLabel>
        <Input
          defaultValue={fieldValue(job?.address ?? null)}
          name="address"
          type="text"
        />
      </Field>
      <TextAreaField
        defaultValue={fieldValue(job?.description ?? null)}
        label="Description"
        name="description"
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
      description="Create your first job and link it to a customer when needed."
      title="No jobs yet"
    />
  );
}

function JobCard({
  customers,
  customersById,
  job,
}: {
  customers: CustomerOption[];
  customersById: Map<string, CustomerOption>;
  job: Job;
}) {
  const updateJobWithId = updateJob.bind(null, job.id);
  const deleteJobWithId = deleteJob.bind(null, job.id);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {job.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {getCustomerName(job.customer_id, customersById)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              {statusLabels[job.status]}
            </span>
            {job.priority ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {priorityLabels[job.priority]}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
          <p>
            <span className="font-medium text-slate-800">Scheduled:</span>{" "}
            {formatDate(job.scheduled_date)}
          </p>
          <p>
            <span className="font-medium text-slate-800">Estimate:</span>{" "}
            {formatAmount(job.estimated_amount)}
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium text-slate-800">Address:</span>{" "}
            {job.address || "Not set"}
          </p>
        </div>
        {job.description ? (
          <p className="mt-3 text-sm text-slate-600">{job.description}</p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5">
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Edit job
          </summary>
          <div className="mt-4">
            <JobForm
              action={updateJobWithId}
              customers={customers}
              job={job}
              submitLabel="Save changes"
            />
          </div>
        </details>

        <details className="rounded-lg border border-red-200 bg-red-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-800">
            Delete job
          </summary>
          <form action={deleteJobWithId} className="mt-4">
            <p className="mb-3 text-sm text-red-700">
              This permanently removes {job.title}.
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

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [jobsResult, customersResult] = await Promise.all([
    supabase
      .from("jobs")
      .select(
        "id,customer_id,title,description,address,status,priority,estimated_amount,scheduled_date,created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id,name,company_name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
  ]);

  const jobs = (jobsResult.data ?? []) as Job[];
  const customers = (customersResult.data ?? []) as CustomerOption[];
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Jobs
        </h1>
        <p className="mt-2 text-slate-600">
          Manage job details, status, scheduling, and customer links.
        </p>
      </div>

      {params.error ? <Message message={params.error} tone="error" /> : null}
      {params.success ? (
        <Message message={params.success} tone="success" />
      ) : null}
      {jobsResult.error ? (
        <Message message={jobsResult.error.message} tone="error" />
      ) : null}
      {customersResult.error ? (
        <Message message={customersResult.error.message} tone="error" />
      ) : null}

      <CardSection
        description="Track a lead, scheduled visit, or active job."
        title="Add job"
      >
        <JobForm
          action={createJob}
          customers={customers}
          submitLabel="Create job"
        />
      </CardSection>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              customers={customers}
              customersById={customersById}
              job={job}
              key={job.id}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
