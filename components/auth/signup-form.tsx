"use client";

import { useActionState } from "react";

import { signup, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, Input } from "@/components/ui/form-controls";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, initialState);

  return (
    <form action={action} className="space-y-4">
      <Field htmlFor="companyName">
        <FieldLabel>Business name</FieldLabel>
        <Input
          autoComplete="organization"
          className="h-11"
          id="companyName"
          name="companyName"
          placeholder="Auckland Plumbing Co."
          required
          type="text"
        />
      </Field>
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
          autoComplete="new-password"
          className="h-11"
          id="password"
          minLength={6}
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
      </Field>
      {state.message ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.message}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
