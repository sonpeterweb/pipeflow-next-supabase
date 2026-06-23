"use client";

import { useActionState } from "react";

import { login, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4">
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
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          id="password"
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
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
