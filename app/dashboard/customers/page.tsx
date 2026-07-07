import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/app/dashboard/customers/actions";
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
} from "@/components/ui/crud";
import { EmptyState as EmptyStateView } from "@/components/ui/empty-state";
import {
  Field,
  FieldLabel,
  Input,
  Textarea,
} from "@/components/ui/form-controls";
import { createClient } from "@/lib/supabase/server";

type Customer = {
  id: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

type CustomersPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    success?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function fieldValue(value: string | null) {
  return value ?? "";
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function customerMatchesSearch(customer: Customer, query: string) {
  if (!query) {
    return true;
  }

  return [
    customer.name,
    customer.company_name,
    customer.email,
    customer.phone,
    customer.address,
  ].some((value) => normalize(value).includes(query));
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
      ? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
      : "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300";

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
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </Field>
  );
}

function NotesField({ defaultValue }: { defaultValue?: string }) {
  return (
    <Field className="sm:col-span-2">
      <FieldLabel>Notes</FieldLabel>
      <Textarea
        defaultValue={defaultValue}
        name="notes"
      />
    </Field>
  );
}

function CustomerForm({
  action,
  customer,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  customer?: Customer;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <TextField
        defaultValue={customer?.name}
        label="Name"
        name="name"
        required
      />
      <TextField
        defaultValue={fieldValue(customer?.company_name ?? null)}
        label="Company"
        name="company_name"
      />
      <TextField
        defaultValue={fieldValue(customer?.email ?? null)}
        label="Email"
        name="email"
        type="email"
      />
      <TextField
        defaultValue={fieldValue(customer?.phone ?? null)}
        label="Phone"
        name="phone"
        type="tel"
      />
      <Field className="sm:col-span-2">
        <FieldLabel>Address</FieldLabel>
        <Input
          defaultValue={fieldValue(customer?.address ?? null)}
          name="address"
          type="text"
        />
      </Field>
      <NotesField defaultValue={fieldValue(customer?.notes ?? null)} />
      <div className="sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function EmptyState() {
  return (
    <EmptyStateView
      action={{ href: "#new-customer", label: "Add customer" }}
      icon={<Users aria-hidden="true" size={20} />}
      description="Add your first customer to start tracking trade work in PipeFlow."
      title="No customers yet"
    />
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const deleteCustomerWithId = deleteCustomer.bind(null, customer.id);

  return (
    <RecordCard
      actions={
        customer.email ? (
          <Link
            className={buttonVariants({ className: "h-9 px-3", variant: "outline" })}
            href={`mailto:${customer.email}`}
          >
            Email
          </Link>
        ) : null
      }
      meta={customer.company_name || "No company set"}
      title={customer.name}
    >
      <DetailGrid>
        <DetailItem label="Email" value={customer.email || "Not set"} />
        <DetailItem label="Phone" value={customer.phone || "Not set"} />
        <DetailItem
          className="sm:col-span-2"
          label="Address"
          value={customer.address || "Not set"}
        />
        <DetailItem label="Created" value={formatDate(customer.created_at)} />
      </DetailGrid>

      {customer.notes ? (
        <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-900 p-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {customer.notes}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 border-t border-slate-200 dark:border-slate-800 pt-5">
        <ActionPanel>
          <ActionSummary>Edit customer</ActionSummary>
          <div className="mt-4">
            <CustomerForm
              action={updateCustomerWithId}
              customer={customer}
              submitLabel="Save changes"
            />
          </div>
        </ActionPanel>

        <ActionPanel tone="danger">
          <ActionSummary tone="danger">Delete customer</ActionSummary>
          <form action={deleteCustomerWithId} className="mt-4">
            <p className="mb-3 text-sm text-red-700 dark:text-red-300">
              This removes {customer.name}. Existing linked records may keep a
              blank customer reference.
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

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("customers")
    .select("id,name,company_name,email,phone,address,notes,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const customers = (data ?? []) as Customer[];
  const search = params.q ?? "";
  const normalizedSearch = normalize(search);
  const visibleCustomers = customers.filter((customer) =>
    customerMatchesSearch(customer, normalizedSearch),
  );

  return (
    <section className="space-y-6">
      <CrudPageHeader
        action={
          <Link className={buttonVariants({ className: "gap-2" })} href="#new-customer">
            <Plus aria-hidden="true" className="size-4" />
            New Customer
          </Link>
        }
        description="Manage customer details for your plumbing and trade jobs."
        eyebrow="CRM"
        title="Customers"
      />

      {params.error ? <Message message={params.error} tone="error" /> : null}
      {params.success ? (
        <Message message={params.success} tone="success" />
      ) : null}
      {error ? <Message message={error.message} tone="error" /> : null}

      <CardSection
        className="scroll-mt-6"
        description="Store contact details for a customer or site."
        title="Add customer"
      >
        <div id="new-customer">
          <CustomerForm action={createCustomer} submitLabel="Create customer" />
        </div>
      </CardSection>

      <CrudToolbar
        clearHref="/dashboard/customers"
        resultLabel={`${visibleCustomers.length} of ${customers.length} customers shown`}
        search={search}
        searchPlaceholder="Search customers, companies, email, phone, or address"
      />

      <div className="space-y-4">
        {visibleCustomers.length > 0 ? (
          visibleCustomers.map((customer) => (
            <CustomerCard customer={customer} key={customer.id} />
          ))
        ) : customers.length > 0 ? (
          <EmptyStateView
            description="Try clearing search filters to see all customer records."
            title="No customers match your filters"
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
