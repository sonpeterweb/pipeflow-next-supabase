"use client";

import { useActionState } from "react";

import { signup, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, initialState);

  return (
    <form action={action} className="space-y-4">
      <label className="block" htmlFor="companyName">
        <span className="text-sm font-medium text-slate-700">
          Business name
        </span>
        <input
          autoComplete="organization"
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          id="companyName"
          name="companyName"
          placeholder="Auckland Plumbing Co."
          required
          type="text"
        />
      </label>
      <label className="block" htmlFor="email">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </label>
      <label className="block" htmlFor="password">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <input
          autoComplete="new-password"
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          id="password"
          minLength={6}
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
      </label>
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.message}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
