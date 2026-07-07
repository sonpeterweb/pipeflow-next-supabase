import Link from "next/link";
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils";

export function CrudPageHeader({
  action,
  description,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary dark:text-blue-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
    </div>
  );
}

export function CrudToolbar({
  clearHref,
  resultLabel,
  search,
  searchPlaceholder,
  status,
  statusOptions,
}: {
  clearHref: string;
  resultLabel: string;
  search?: string;
  searchPlaceholder: string;
  status?: string;
  statusOptions?: Array<{ label: string; value: string }>;
}) {
  const hasFilters = Boolean(search || status);

  return (
    <Card className="p-4">
      <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]" method="get">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <Input
            className="pl-9"
            defaultValue={search}
            name="q"
            placeholder={searchPlaceholder}
            type="search"
          />
        </label>
        {statusOptions ? (
          <label>
            <span className="sr-only">Status</span>
            <Select defaultValue={status ?? ""} name="status">
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        ) : (
          <input name="status" type="hidden" value="" />
        )}
        <div className="flex gap-2">
          <button className={buttonVariants({ className: "w-full sm:w-auto" })} type="submit">
            Apply
          </button>
          {hasFilters ? (
            <Link
              className={buttonVariants({
                className: "w-full gap-2 sm:w-auto",
                variant: "outline",
              })}
              href={clearHref}
            >
              <X aria-hidden="true" className="size-4" />
              Clear
            </Link>
          ) : null}
        </div>
      </form>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {resultLabel}
      </p>
    </Card>
  );
}

export function StatusBadge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
}) {
  const classes = {
    amber:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900",
    blue:
      "bg-brand-primary-light text-brand-primary ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900",
    green:
      "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/70 dark:text-green-300 dark:ring-green-900",
    red:
      "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/70 dark:text-red-300 dark:ring-red-900",
    slate:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800",
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        classes[tone],
      )}
    >
      {children}
    </span>
  );
}

export function RecordCard({
  actions,
  children,
  eyebrow,
  meta,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="mb-3 flex flex-wrap gap-2">{eyebrow}</div> : null}
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            {title}
          </h2>
          {meta ? (
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {meta}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </article>
  );
}

export function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </dl>
  );
}

export function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-900", className)}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium text-slate-800 dark:text-slate-200">
        {value}
      </dd>
    </div>
  );
}

export function ActionPanel({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <details
      className={cn(
        "rounded-lg border p-4",
        tone === "danger"
          ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      {children}
    </details>
  );
}

export function ActionSummary({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <summary
      className={cn(
        "cursor-pointer text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        tone === "danger"
          ? "text-red-800 dark:text-red-300"
          : "text-slate-800 dark:text-slate-200",
      )}
    >
      {children}
    </summary>
  );
}
