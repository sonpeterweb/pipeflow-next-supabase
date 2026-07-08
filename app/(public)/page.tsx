import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  Hammer,
  Receipt,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { AppLogo } from "@/components/app-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ClipboardList,
    title: "Job Management",
    description:
      "Track leads, scheduled work, active jobs, and completed visits without losing context.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Keep contact details, site notes, and customer history organized in one workspace.",
  },
  {
    icon: FileText,
    title: "Quotes",
    description:
      "Create draft and sent quotes that stay connected to the right customer or job.",
  },
  {
    icon: Receipt,
    title: "Invoices",
    description:
      "Monitor sent, overdue, paid, and draft invoices so cash flow is easier to manage.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description:
      "See active work, outstanding invoices, and revenue signals from a focused dashboard.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Use PipeFlow on site, in the van, or back at the office with responsive screens.",
  },
];

const benefits = [
  "Save hours every week by replacing scattered spreadsheets and paperwork.",
  "Reduce admin mistakes with customer, job, quote, and invoice records connected.",
  "Invoice faster by keeping financial follow-up visible alongside work status.",
  "Make better decisions with a clear view of jobs, customers, and revenue.",
];

const process = [
  {
    icon: Users,
    title: "Add Customers",
    description: "Create customer and site records once, then reuse them across jobs.",
  },
  {
    icon: Hammer,
    title: "Manage Jobs",
    description: "Track status, priority, schedule, and notes from first lead to paid work.",
  },
  {
    icon: Receipt,
    title: "Get Paid Faster",
    description: "Turn operational work into quotes and invoices you can follow up.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary dark:text-blue-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof ClipboardList;
  title: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700">
      <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary-light text-brand-primary dark:bg-blue-950 dark:text-blue-300">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </article>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-green-400" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            PipeFlow workspace
          </p>
        </div>
        <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-6 space-y-2">
              {["Dashboard", "Customers", "Jobs", "Quotes", "Invoices"].map(
                (item, index) => (
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium",
                      index === 0
                        ? "bg-brand-primary-light text-brand-primary dark:bg-blue-950 dark:text-blue-300"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary dark:text-blue-300">
                  Dashboard
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                  Business overview
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Live view of jobs, customers, invoices, and revenue signals.
                </p>
              </div>
              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200 dark:bg-green-950/70 dark:text-green-300 dark:ring-green-900">
                Live data
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Active Jobs", "12"],
                ["Outstanding", "$8.4k"],
                ["Paid Revenue", "$24.8k"],
              ].map(([label, value]) => (
                <div
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  key={label}
                >
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              {[
                ["Hot water repair", "Scheduled", "Mount Eden"],
                ["Leak inspection", "In progress", "Auckland Central"],
                ["Bathroom quote", "Draft", "Ponsonby"],
              ].map(([title, status, area]) => (
                <div
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800"
                  key={title}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                      {title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {area}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
                    {status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <AppLogo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400 md:flex">
            <a className="hover:text-slate-950 dark:hover:text-slate-100" href="#features">
              Features
            </a>
            <a className="hover:text-slate-950 dark:hover:text-slate-100" href="#benefits">
              Benefits
            </a>
            <a className="hover:text-slate-950 dark:hover:text-slate-100" href="#how-it-works">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "hidden h-10 px-3 sm:inline-flex",
              })}
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className={buttonVariants({ className: "h-10 px-4" })}
              href="/signup"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-5 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-brand-primary-light px-3 py-1 text-sm font-semibold text-brand-primary dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                <Sparkles aria-hidden="true" className="size-4" />
                Built for plumbing businesses
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl">
                Run your plumbing business without the paperwork.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                PipeFlow helps plumbing teams manage jobs, customers, quotes,
                and invoices from one modern workspace.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className={buttonVariants({
                    className: "h-12 w-full gap-2 px-6 text-base sm:w-auto",
                  })}
                  href="/signup"
                >
                  Start Free Trial
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-12 w-full px-6 text-base sm:w-auto",
                  })}
                  href="/dashboard"
                >
                  View Demo
                </Link>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-3">
                {["No spreadsheets", "One workspace", "Built for trades"].map(
                  (item) => (
                    <div className="flex items-center gap-2" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-4 text-green-600 dark:text-green-400"
                      />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section
          className="border-y border-slate-200 bg-slate-50 px-5 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20"
          id="features"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Features"
              title="Everything your plumbing workflow needs in one place."
              description="PipeFlow keeps the operational pieces connected so your team can move from first call to paid invoice with less admin."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:py-20" id="benefits">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary dark:text-blue-300">
                Business value
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
                Less admin, faster follow-up, clearer decisions.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                PipeFlow is designed around the daily reality of plumbing work:
                changing schedules, customer details, quotes, invoices, and
                follow-up all competing for attention.
              </p>
            </div>
            <div className="grid gap-3">
              {benefits.map((benefit) => (
                <div
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  key={benefit}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400"
                  />
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="border-y border-slate-200 bg-slate-50 px-5 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20"
          id="how-it-works"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="How it works"
              title="A simple operating system for plumbing work."
              description="Start with your customers, organize the work, and keep financial follow-up visible."
            />
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {process.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                    key={step.title}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary-light text-brand-primary dark:bg-blue-950 dark:text-blue-300">
                        <Icon aria-hidden="true" className="size-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-slate-100">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-10">
            <div className="mx-auto flex w-fit gap-1 text-amber-500" aria-label="Five stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star aria-hidden="true" className="size-5 fill-current" key={index} />
              ))}
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
              Trusted by plumbing businesses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Customer stories and company logos can be added here once real
              production testimonials are available.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Customer testimonial", "Company logo", "Case study"].map((item) => (
                <div
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl rounded-2xl bg-slate-950 p-8 text-white shadow-md dark:bg-slate-900 sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ready to simplify your plumbing business?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Bring jobs, customers, quotes, invoices, and dashboard insights
                  into one calm workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className={buttonVariants({
                    className: "h-12 bg-white px-6 text-base text-slate-950 hover:bg-slate-100 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100",
                  })}
                  href="/signup"
                >
                  Start Free Trial
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-12 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10",
                  })}
                  href="/dashboard"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AppLogo />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Modern business management for plumbing teams.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a className="hover:text-slate-950 dark:hover:text-slate-100" href="#features">
              Features
            </a>
            <a className="hover:text-slate-950 dark:hover:text-slate-100" href="#benefits">
              Benefits
            </a>
            <Link className="hover:text-slate-950 dark:hover:text-slate-100" href="/login">
              Sign In
            </Link>
            <Link className="hover:text-slate-950 dark:hover:text-slate-100" href="/signup">
              Start Free Trial
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 PipeFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
