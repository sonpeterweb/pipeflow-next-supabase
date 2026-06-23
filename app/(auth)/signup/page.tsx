import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Create account
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start setting up a plumbing business workspace.
        </p>
      </div>

      <form className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Business name
          </span>
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            placeholder="Auckland Plumbing Co."
            type="text"
          />
        </label>
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
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-emerald-700" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
