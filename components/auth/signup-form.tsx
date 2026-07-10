"use client";

import { useActionState } from "react";

import { signup, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
} from "@/components/ui/form-controls";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, initialState);
  const companyNameError = state.fieldErrors?.companyName?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={action} className="space-y-4">
      <Field htmlFor="companyName">
        <FieldLabel>Business name</FieldLabel>
        <Input
          aria-describedby={companyNameError ? "company-name-error" : undefined}
          aria-invalid={Boolean(companyNameError)}
          autoComplete="organization"
          className="h-11"
          id="companyName"
          name="companyName"
          placeholder="Auckland Plumbing Co."
          required
          type="text"
        />
        {companyNameError ? (
          <FieldError id="company-name-error">{companyNameError}</FieldError>
        ) : null}
      </Field>
      <Field htmlFor="email">
        <FieldLabel>Email</FieldLabel>
        <Input
          aria-describedby={emailError ? "signup-email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          autoComplete="email"
          className="h-11"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        {emailError ? (
          <FieldError id="signup-email-error">{emailError}</FieldError>
        ) : null}
      </Field>
      <Field htmlFor="password">
        <FieldLabel>Password</FieldLabel>
        <Input
          aria-describedby={passwordError ? "signup-password-error" : undefined}
          aria-invalid={Boolean(passwordError)}
          autoComplete="new-password"
          className="h-11"
          id="password"
          minLength={6}
          name="password"
          placeholder="••••••••"
          required
          type="password"
        />
        {passwordError ? (
          <FieldError id="signup-password-error">{passwordError}</FieldError>
        ) : null}
      </Field>
      {state.message ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
