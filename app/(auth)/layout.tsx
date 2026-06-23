import Link from "next/link";
import { redirect } from "next/navigation";

import { AppLogo } from "@/components/app-logo";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full bg-slate-50 px-5 py-8">
      <main className="mx-auto flex w-full max-w-md flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <AppLogo />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
        <Link
          className="mt-6 text-center text-sm font-medium text-slate-600 hover:text-slate-950"
          href="/"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
