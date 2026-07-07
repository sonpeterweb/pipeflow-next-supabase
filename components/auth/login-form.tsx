"use client";

import { useActionState } from "react";

import { login, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, Input } from "@/components/ui/form-controls";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4">
      <Field htmlFor="email">
        <FieldLabel>Email</FieldLabel>
        <Input
          autoComplete="email"
          className="h-11"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </Field>
      <Field htmlFor="password">
        <FieldLabel>Password</FieldLabel>
        <Input
          autoComplete="current-password"
          className="h-11"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
      </Field>
      {state.message ? (
        <p className="rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300">
          {state.message}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
