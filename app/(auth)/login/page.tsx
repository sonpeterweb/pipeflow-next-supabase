import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

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

      <LoginForm />

      <p className="mt-6 text-center text-sm text-slate-600">
        New to PipeFlow?{" "}
        <Link className="font-semibold text-emerald-700" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
