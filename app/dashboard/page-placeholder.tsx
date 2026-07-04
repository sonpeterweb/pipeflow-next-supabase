import { EmptyState } from "@/components/ui/empty-state";

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
      <EmptyState
        description="Functionality will be added in a later ticket."
        title="UI shell only"
      />
    </section>
  );
}
