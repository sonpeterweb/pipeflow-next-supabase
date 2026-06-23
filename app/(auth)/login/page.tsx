import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Access the PipeFlow demo dashboard.
        </p>
      </div>

      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            placeholder="you@example.com"
            type="email"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            placeholder="••••••••"
            type="password"
          />
        </label>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New to PipeFlow?{" "}
        <Link className="font-semibold text-emerald-700" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
