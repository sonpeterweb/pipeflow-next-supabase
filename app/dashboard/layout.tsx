import Link from "next/link";

import { AppLogo } from "@/components/app-logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-slate-100">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-5 py-4 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <AppLogo />
            <Link
              className="text-sm font-medium text-slate-600 hover:text-slate-950 lg:hidden"
              href="/"
            >
              Home
            </Link>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="hidden border-b border-slate-200 bg-white px-8 py-4 lg:block">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                PipeFlow Demo Workspace
              </p>
              <Link
                className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                href="/"
              >
                View public site
              </Link>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 sm:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
