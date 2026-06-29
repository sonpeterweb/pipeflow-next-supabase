import { describe, expect, it } from "vitest";

import { calculateDashboardMetrics, formatCurrency } from "@/lib/dashboard/metrics";

describe("calculateDashboardMetrics", () => {
  it("calculates user dashboard totals from job and invoice rows", () => {
    const metrics = calculateDashboardMetrics({
      invoices: [
        { amount: "200", status: "sent" },
        { amount: 300, status: "overdue" },
        { amount: 125, status: "paid" },
        { amount: 99, status: "draft" },
      ],
      jobs: [
        { estimated_amount: "1000", status: "lead" },
        { estimated_amount: 500, status: "in_progress" },
        { estimated_amount: 750, status: "completed" },
        { estimated_amount: 900, status: "cancelled" },
      ],
      totalCustomers: 4,
    });

    expect(metrics).toEqual({
      activeJobs: 2,
      completedJobs: 1,
      estimatedRevenue: 2250,
      outstandingInvoiceCount: 2,
      outstandingInvoices: 500,
      paidRevenue: 125,
      totalCustomers: 4,
    });
  });
});

describe("formatCurrency", () => {
  it("formats NZD currency", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});
