import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/(auth)/actions";
import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-full bg-slate-50">
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
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-4 lg:hidden">
            <Button className="h-10 w-full" type="submit" variant="outline">
              Log out
            </Button>
          </form>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="hidden border-b border-slate-200 bg-white px-8 py-4 lg:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  PipeFlow Workspace
                </p>
                <p className="text-sm text-slate-700">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                  href="/"
                >
                  View public site
                </Link>
                <form action={logout}>
                  <Button className="h-9 px-4" type="submit" variant="outline">
                    Log out
                  </Button>
                </form>
              </div>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 sm:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
