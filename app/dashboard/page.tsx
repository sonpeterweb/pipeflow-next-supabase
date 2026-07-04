import { redirect } from "next/navigation";

import {
  calculateDashboardMetrics,
  formatCurrency,
  type DashboardInvoiceMetricRow,
  type DashboardJobMetricRow,
} from "@/lib/dashboard/metrics";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

function MetricCard({
  description,
  label,
  value,
}: {
  description?: string;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
      </CardContent>
    </Card>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [customersResult, jobsResult, invoicesResult] = await Promise.all([
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("jobs")
      .select("status,estimated_amount")
      .eq("user_id", user.id),
    supabase
      .from("invoices")
      .select("status,amount")
      .eq("user_id", user.id),
  ]);

  const metrics = calculateDashboardMetrics({
    invoices: (invoicesResult.data ?? []) as DashboardInvoiceMetricRow[],
    jobs: (jobsResult.data ?? []) as DashboardJobMetricRow[],
    totalCustomers: customersResult.count ?? 0,
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Live overview of your customers, jobs, invoices, and revenue.
        </p>
      </div>

      {customersResult.error ? (
        <ErrorMessage message={customersResult.error.message} />
      ) : null}
      {jobsResult.error ? (
        <ErrorMessage message={jobsResult.error.message} />
      ) : null}
      {invoicesResult.error ? (
        <ErrorMessage message={invoicesResult.error.message} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total Customers"
          value={String(metrics.totalCustomers)}
        />
        <MetricCard label="Active Jobs" value={String(metrics.activeJobs)} />
        <MetricCard
          label="Completed Jobs"
          value={String(metrics.completedJobs)}
        />
        <MetricCard
          description={`${metrics.outstandingInvoiceCount} invoice${
            metrics.outstandingInvoiceCount === 1 ? "" : "s"
          } sent or overdue`}
          label="Outstanding Invoices"
          value={formatCurrency(metrics.outstandingInvoices)}
        />
        <MetricCard
          description="Non-cancelled job estimates"
          label="Estimated Revenue"
          value={formatCurrency(metrics.estimatedRevenue)}
        />
        <MetricCard
          description="Paid invoice total"
          label="Paid Revenue"
          value={formatCurrency(metrics.paidRevenue)}
        />
      </div>
    </section>
  );
}
