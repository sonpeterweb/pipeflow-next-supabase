type MoneyValue = number | string | null;

export type DashboardJobMetricRow = {
  estimated_amount: MoneyValue;
  status: string;
};

export type DashboardInvoiceMetricRow = {
  amount: MoneyValue;
  status: string;
};

export type DashboardMetrics = {
  activeJobs: number;
  completedJobs: number;
  estimatedRevenue: number;
  outstandingInvoiceCount: number;
  outstandingInvoices: number;
  paidRevenue: number;
  totalCustomers: number;
};

const activeJobStatuses = new Set([
  "lead",
  "quoted",
  "scheduled",
  "in_progress",
]);

function toNumber(value: MoneyValue) {
  if (value === null) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateDashboardMetrics({
  invoices,
  jobs,
  totalCustomers,
}: {
  invoices: DashboardInvoiceMetricRow[];
  jobs: DashboardJobMetricRow[];
  totalCustomers: number;
}): DashboardMetrics {
  return {
    activeJobs: jobs.filter((job) => activeJobStatuses.has(job.status)).length,
    completedJobs: jobs.filter((job) => job.status === "completed").length,
    estimatedRevenue: jobs
      .filter((job) => job.status !== "cancelled")
      .reduce((total, job) => total + toNumber(job.estimated_amount), 0),
    outstandingInvoiceCount: invoices.filter((invoice) =>
      ["sent", "overdue"].includes(invoice.status),
    ).length,
    outstandingInvoices: invoices
      .filter((invoice) => ["sent", "overdue"].includes(invoice.status))
      .reduce((total, invoice) => total + toNumber(invoice.amount), 0),
    paidRevenue: invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((total, invoice) => total + toNumber(invoice.amount), 0),
    totalCustomers,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NZ", {
    currency: "NZD",
    style: "currency",
  }).format(value);
}
