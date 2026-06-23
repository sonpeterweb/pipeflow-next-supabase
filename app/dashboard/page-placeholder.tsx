export function PagePlaceholder({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          UI shell only. Functionality will be added in a later ticket.
        </p>
      </div>
    </section>
  );
}
