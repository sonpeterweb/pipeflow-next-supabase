import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  FilePlus2,
  FileText,
  Receipt,
  Users,
  Wrench,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  calculateDashboardMetrics,
  formatCurrency,
  type DashboardInvoiceMetricRow,
  type DashboardJobMetricRow,
} from "@/lib/dashboard/metrics";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { cn } from "@/lib/utils";

function MetricCard({
  description,
  icon,
  label,
  tone = "blue",
  trend,
  value,
}: {
  description?: string;
  icon: React.ReactNode;
  label: string;
  tone?: "blue" | "green" | "slate" | "amber";
  trend?: {
    direction: "up" | "down";
    label: string;
  };
  value: string;
}) {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    blue: "bg-brand-primary-light text-brand-primary dark:bg-blue-950 dark:text-blue-300",
    green: "bg-green-50 text-green-700 dark:bg-green-950/70 dark:text-green-300",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  };
  const TrendIcon = trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            toneClasses[tone],
          )}
        >
          {icon}
        </div>
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      {trend ? (
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            trend.direction === "down"
              ? "bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300"
              : "bg-green-50 text-green-700 dark:bg-green-950/70 dark:text-green-300",
          )}
        >
          <TrendIcon aria-hidden="true" className="size-3.5" />
          {trend.label}
        </div>
      ) : null}
    </article>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
      {message}
    </p>
  );
}

function percent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function ProgressRow({
  color,
  label,
  value,
  width,
}: {
  color: string;
  label: string;
  value: string;
  width: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="font-semibold text-slate-950 dark:text-slate-100">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${Math.max(width, 4)}%` }}
        />
      </div>
    </div>
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
  const totalJobCount = metrics.activeJobs + metrics.completedJobs;
  const totalRevenueSignal =
    metrics.outstandingInvoices + metrics.estimatedRevenue + metrics.paidRevenue;
  const activityItems = [
    {
      icon: <Users aria-hidden="true" className="size-4" />,
      title: `${metrics.totalCustomers} customer${
        metrics.totalCustomers === 1 ? "" : "s"
      } in workspace`,
      description: "Customer records are synced from your Supabase data.",
      timestamp: "Live",
    },
    {
      icon: <Wrench aria-hidden="true" className="size-4" />,
      title: `${metrics.activeJobs} active job${
        metrics.activeJobs === 1 ? "" : "s"
      } need attention`,
      description: "Includes leads, quoted, scheduled, and in-progress work.",
      timestamp: "Updated now",
    },
    {
      icon: <Receipt aria-hidden="true" className="size-4" />,
      title: `${metrics.outstandingInvoiceCount} outstanding invoice${
        metrics.outstandingInvoiceCount === 1 ? "" : "s"
      }`,
      description: `${formatCurrency(
        metrics.outstandingInvoices,
      )} currently sent or overdue.`,
      timestamp: "Finance",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
            Business overview
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Live overview of customers, jobs, invoices, and revenue signals for
            your PipeFlow workspace.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "w-full gap-2 sm:w-auto",
            })}
            href="/dashboard/customers"
          >
            <Users aria-hidden="true" className="size-4" />
            New Customer
          </Link>
          <Link
            className={buttonVariants({ className: "w-full gap-2 sm:w-auto" })}
            href="/dashboard/jobs"
          >
            <FilePlus2 aria-hidden="true" className="size-4" />
            New Job
          </Link>
        </div>
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
          icon={<Users aria-hidden="true" className="size-5" />}
          label="Total Customers"
          tone="blue"
          trend={{ direction: "up", label: "Ready for jobs" }}
          value={String(metrics.totalCustomers)}
        />
        <MetricCard
          icon={<Wrench aria-hidden="true" className="size-5" />}
          label="Active Jobs"
          tone="amber"
          trend={{ direction: "up", label: "In pipeline" }}
          value={String(metrics.activeJobs)}
        />
        <MetricCard
          icon={<CheckCircle2 aria-hidden="true" className="size-5" />}
          label="Completed Jobs"
          tone="green"
          trend={{ direction: "up", label: "Completed" }}
          value={String(metrics.completedJobs)}
        />
        <MetricCard
          description={`${metrics.outstandingInvoiceCount} invoice${
            metrics.outstandingInvoiceCount === 1 ? "" : "s"
          } sent or overdue`}
          icon={<Receipt aria-hidden="true" className="size-5" />}
          label="Outstanding Invoices"
          tone="slate"
          value={formatCurrency(metrics.outstandingInvoices)}
        />
        <MetricCard
          description="Non-cancelled job estimates"
          icon={<FileText aria-hidden="true" className="size-5" />}
          label="Estimated Revenue"
          tone="blue"
          value={formatCurrency(metrics.estimatedRevenue)}
        />
        <MetricCard
          description="Paid invoice total"
          icon={<Banknote aria-hidden="true" className="size-5" />}
          label="Paid Revenue"
          tone="green"
          value={formatCurrency(metrics.paidRevenue)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <DashboardCard
          icon={<Banknote aria-hidden="true" className="size-5" />}
          subtitle="Revenue distribution across active work and invoicing."
          title="Revenue pipeline"
        >
          <div className="space-y-5">
            <ProgressRow
              color="bg-brand-primary"
              label="Estimated revenue"
              value={formatCurrency(metrics.estimatedRevenue)}
              width={percent(metrics.estimatedRevenue, totalRevenueSignal)}
            />
            <ProgressRow
              color="bg-amber-500 dark:bg-amber-400"
              label="Outstanding invoices"
              value={formatCurrency(metrics.outstandingInvoices)}
              width={percent(metrics.outstandingInvoices, totalRevenueSignal)}
            />
            <ProgressRow
              color="bg-green-600"
              label="Paid revenue"
              value={formatCurrency(metrics.paidRevenue)}
              width={percent(metrics.paidRevenue, totalRevenueSignal)}
            />
          </div>
        </DashboardCard>

        <DashboardCard
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          subtitle="Operational split between open and completed jobs."
          title="Job mix"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Active share
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                {percent(metrics.activeJobs, totalJobCount)}%
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-brand-primary"
                  style={{ width: `${percent(metrics.activeJobs, totalJobCount)}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Completion share
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                {percent(metrics.completedJobs, totalJobCount)}%
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${percent(metrics.completedJobs, totalJobCount)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        <DashboardCard
          icon={<FilePlus2 aria-hidden="true" className="size-5" />}
          subtitle="Common workspace actions."
          title="Quick actions"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              className={buttonVariants({
                className: "h-11 justify-start gap-2",
                variant: "outline",
              })}
              href="/dashboard/jobs"
            >
              <Wrench aria-hidden="true" className="size-4" />
              New Job
            </Link>
            <Link
              className={buttonVariants({
                className: "h-11 justify-start gap-2",
                variant: "outline",
              })}
              href="/dashboard/customers"
            >
              <Users aria-hidden="true" className="size-4" />
              New Customer
            </Link>
            <Link
              className={buttonVariants({
                className: "h-11 justify-start gap-2",
                variant: "outline",
              })}
              href="/dashboard/invoices"
            >
              <Receipt aria-hidden="true" className="size-4" />
              Create Invoice
            </Link>
            <Link
              className={buttonVariants({
                className: "h-11 justify-start gap-2",
                variant: "outline",
              })}
              href="/dashboard/jobs"
            >
              <CalendarClock aria-hidden="true" className="size-4" />
              View Schedule
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard
          action={
            <Link
              className={buttonVariants({
                className: "h-9 px-3",
                variant: "ghost",
              })}
              href="/dashboard/jobs"
            >
              View jobs
            </Link>
          }
          icon={<CalendarClock aria-hidden="true" className="size-5" />}
          subtitle="A concise feed generated from current workspace metrics."
          title="Activity"
        >
          <div className="space-y-4">
            {activityItems.map((item) => (
              <div className="flex gap-3" key={item.title}>
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-950 dark:text-slate-100">{item.title}</p>
                    <time className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {item.timestamp}
                    </time>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}
