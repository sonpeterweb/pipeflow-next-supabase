import Link from "next/link";

import { AppLogo } from "@/components/app-logo";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <AppLogo />
          <nav className="flex items-center gap-2">
            <Link
              className={buttonVariants({
                variant: "ghost",
                className: "h-10 px-3",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center px-5 py-14 sm:py-20">
        <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary">
              Local business management SaaS
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Simple job management for plumbing businesses.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              PipeFlow helps Kiwi plumbers manage customers, jobs, quotes, and
              invoices from one protected dashboard built with Supabase.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className={buttonVariants({ className: "w-full sm:w-auto" })}
                href="/dashboard"
              >
                Open Dashboard
              </Link>
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full sm:w-auto",
                })}
                href="/login"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Demo workspace
                  </p>
                  <p className="text-2xl font-semibold text-slate-950">
                    Live data
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  Portfolio demo
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Leak inspection", "Auckland Central", "In progress"],
                  ["Hot water repair", "Mount Eden", "Scheduled"],
                  ["Quote follow-up", "Ponsonby", "Draft"],
                ].map(([title, area, status]) => (
                  <div
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                    key={title}
                  >
                    <div>
                      <p className="font-medium text-slate-950">{title}</p>
                      <p className="text-sm text-slate-500">{area}</p>
                    </div>
                    <p className="ml-4 whitespace-nowrap text-sm font-medium text-slate-700">
                      {status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
