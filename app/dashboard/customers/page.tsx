import { redirect } from "next/navigation";

import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/app/dashboard/customers/actions";
import { Button } from "@/components/ui/button";
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
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <p className={`rounded-md border px-4 py-3 text-sm font-medium ${classes}`}>
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
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function NotesField({ defaultValue }: { defaultValue?: string }) {
  return (
    <label className="block sm:col-span-2">
      <span className="text-sm font-medium text-slate-700">Notes</span>
      <textarea
        className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
        defaultValue={defaultValue}
        name="notes"
      />
    </label>
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
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium text-slate-700">Address</span>
        <input
          className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          defaultValue={fieldValue(customer?.address ?? null)}
          name="address"
          type="text"
        />
      </label>
      <NotesField defaultValue={fieldValue(customer?.notes ?? null)} />
      <div className="sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">No customers yet</h2>
      <p className="mt-2 text-sm text-slate-600">
        Add your first customer to start tracking trade work in PipeFlow.
      </p>
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const deleteCustomerWithId = deleteCustomer.bind(null, customer.id);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {customer.name}
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
            <p>
              <span className="font-medium text-slate-800">Company:</span>{" "}
              {customer.company_name || "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-800">Email:</span>{" "}
              {customer.email || "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-800">Phone:</span>{" "}
              {customer.phone || "Not set"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium text-slate-800">Address:</span>{" "}
              {customer.address || "Not set"}
            </p>
            <p>
              <span className="font-medium text-slate-800">Created:</span>{" "}
              {formatDate(customer.created_at)}
            </p>
          </div>
          {customer.notes ? (
            <p className="mt-3 text-sm text-slate-600">{customer.notes}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5">
        <details className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Edit customer
          </summary>
          <div className="mt-4">
            <CustomerForm
              action={updateCustomerWithId}
              customer={customer}
              submitLabel="Save changes"
            />
          </div>
        </details>

        <details className="rounded-md border border-red-200 bg-red-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-800">
            Delete customer
          </summary>
          <form action={deleteCustomerWithId} className="mt-4">
            <p className="mb-3 text-sm text-red-700">
              This removes {customer.name}. Existing linked records may keep a
              blank customer reference.
            </p>
            <Button type="submit" variant="secondary">
              Confirm delete
            </Button>
          </form>
        </details>
      </div>
    </article>
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

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Customers
        </h1>
        <p className="mt-2 text-slate-600">
          Manage customer details for your plumbing and trade jobs.
        </p>
      </div>

      {params.error ? <Message message={params.error} tone="error" /> : null}
      {params.success ? (
        <Message message={params.success} tone="success" />
      ) : null}
      {error ? <Message message={error.message} tone="error" /> : null}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Add customer</h2>
        <p className="mt-1 text-sm text-slate-600">
          Store contact details for a customer or site.
        </p>
        <div className="mt-5">
          <CustomerForm action={createCustomer} submitLabel="Create customer" />
        </div>
      </div>

      <div className="space-y-4">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <CustomerCard customer={customer} key={customer.id} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
