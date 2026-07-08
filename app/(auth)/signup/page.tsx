import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          Create account
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Create a demo workspace for a plumbing or trade business.
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link className="font-semibold text-brand-primary" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
