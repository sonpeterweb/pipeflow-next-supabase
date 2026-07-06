import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Wrench } from "lucide-react";

import { createJob, deleteJob, updateJob } from "@/app/dashboard/jobs/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card";
import {
  ActionPanel,
  ActionSummary,
  CrudPageHeader,
  CrudToolbar,
  DetailGrid,
  DetailItem,
  RecordCard,
  StatusBadge,
} from "@/components/ui/crud";
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
    q?: string;
    status?: string;
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

const statusTones: Record<
  (typeof jobStatuses)[number],
  "blue" | "green" | "amber" | "red" | "slate"
> = {
  cancelled: "red",
  completed: "green",
  in_progress: "blue",
  lead: "slate",
  paid: "green",
  quoted: "amber",
  scheduled: "blue",
};

const priorityTones: Record<
  (typeof jobPriorities)[number],
  "blue" | "green" | "amber" | "red" | "slate"
> = {
  high: "amber",
  low: "slate",
  medium: "blue",
  urgent: "red",
};

function fieldValue(value: string | null) {
  return value ?? "";
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function jobMatchesSearch(
  job: Job,
  customersById: Map<string, CustomerOption>,
  query: string,
) {
  if (!query) {
    return true;
  }

  return [
    job.title,
    job.description,
    job.address,
    getCustomerName(job.customer_id, customersById),
  ].some((value) => normalize(value).includes(query));
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
      action={{ href: "#new-job", label: "Create job" }}
      icon={<Wrench aria-hidden="true" size={20} />}
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
    <RecordCard
      eyebrow={
        <>
          <StatusBadge tone={statusTones[job.status]}>
            {statusLabels[job.status]}
          </StatusBadge>
          {job.priority ? (
            <StatusBadge tone={priorityTones[job.priority]}>
              {priorityLabels[job.priority]} priority
            </StatusBadge>
          ) : null}
        </>
      }
      meta={getCustomerName(job.customer_id, customersById)}
      title={job.title}
    >
      <DetailGrid>
        <DetailItem label="Scheduled" value={formatDate(job.scheduled_date)} />
        <DetailItem label="Estimate" value={formatAmount(job.estimated_amount)} />
        <DetailItem
          className="sm:col-span-2"
          label="Address"
          value={job.address || "Not set"}
        />
      </DetailGrid>
      {job.description ? (
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          {job.description}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5">
        <ActionPanel>
          <ActionSummary>Edit job</ActionSummary>
          <div className="mt-4">
            <JobForm
              action={updateJobWithId}
              customers={customers}
              job={job}
              submitLabel="Save changes"
            />
          </div>
        </ActionPanel>

        <ActionPanel tone="danger">
          <ActionSummary tone="danger">Delete job</ActionSummary>
          <form action={deleteJobWithId} className="mt-4">
            <p className="mb-3 text-sm text-red-700">
              This permanently removes {job.title}.
            </p>
            <Button type="submit" variant="destructive">
              Confirm delete
            </Button>
          </form>
        </ActionPanel>
      </div>
    </RecordCard>
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
  const search = params.q ?? "";
  const normalizedSearch = normalize(search);
  const status =
    params.status && jobStatuses.includes(params.status as (typeof jobStatuses)[number])
      ? (params.status as (typeof jobStatuses)[number])
      : "";
  const visibleJobs = jobs.filter(
    (job) =>
      jobMatchesSearch(job, customersById, normalizedSearch) &&
      (!status || job.status === status),
  );

  return (
    <section className="space-y-6">
      <CrudPageHeader
        action={
          <Link className={buttonVariants({ className: "gap-2" })} href="#new-job">
            <Plus aria-hidden="true" className="size-4" />
            New Job
          </Link>
        }
        description="Manage job details, status, scheduling, and customer links."
        eyebrow="Operations"
        title="Jobs"
      />

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
        className="scroll-mt-6"
        description="Track a lead, scheduled visit, or active job."
        title="Add job"
      >
        <div id="new-job">
          <JobForm
            action={createJob}
            customers={customers}
            submitLabel="Create job"
          />
        </div>
      </CardSection>

      <CrudToolbar
        clearHref="/dashboard/jobs"
        resultLabel={`${visibleJobs.length} of ${jobs.length} jobs shown`}
        search={search}
        searchPlaceholder="Search jobs, customers, descriptions, or addresses"
        status={status}
        statusOptions={jobStatuses.map((jobStatus) => ({
          label: statusLabels[jobStatus],
          value: jobStatus,
        }))}
      />

      <div className="space-y-4">
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job) => (
            <JobCard
              customers={customers}
              customersById={customersById}
              job={job}
              key={job.id}
            />
          ))
        ) : jobs.length > 0 ? (
          <EmptyStateView
            description="Try clearing search or status filters to see all job records."
            title="No jobs match your filters"
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
