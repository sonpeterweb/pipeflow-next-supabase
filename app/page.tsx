import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">PipeFlow</span>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Simple job management for plumbing businesses
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            PipeFlow helps Kiwi plumbers manage customers, jobs, quotes, and
            invoices from one simple dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              View Demo
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
