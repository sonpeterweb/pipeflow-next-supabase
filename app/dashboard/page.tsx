const metrics = [
  { label: "Total Customers", value: "48" },
  { label: "Active Jobs", value: "12" },
  { label: "Completed Jobs", value: "136" },
  { label: "Outstanding Invoices", value: "$8.4k" },
];

export default function DashboardPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Overview of customers, jobs, quotes, and invoices.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={metric.label}
          >
            <p className="text-sm font-medium text-slate-500">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {metric.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
