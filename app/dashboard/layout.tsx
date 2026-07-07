import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/(auth)/actions";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AppLogo } from "@/components/app-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

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
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[272px_1fr]">
        <aside className="border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <AppLogo />
            <Link
              className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 lg:hidden"
              href="/"
            >
              Home
            </Link>
          </div>
          <DashboardNav />
          <form action={logout} className="mt-4 lg:hidden">
            <Button className="h-10 w-full" type="submit" variant="outline">
              Log out
            </Button>
          </form>
        </aside>
        <div className="flex min-w-0 flex-col">
          <header className="hidden border-b border-slate-200 bg-white/95 px-8 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500">
                  PipeFlow Workspace
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-950"
                  href="/"
                >
                  View public site
                </Link>
                <div
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {user.email?.slice(0, 1).toUpperCase() ?? "P"}
                </div>
                <form action={logout}>
                  <Button className="h-9 px-4" type="submit" variant="outline">
                    Log out
                  </Button>
                </form>
              </div>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
