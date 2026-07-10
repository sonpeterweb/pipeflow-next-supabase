"use client";

import { useActionState } from "react";

import { login, type AuthFormState } from "@/app/(auth)/actions";
import { DemoLoginButton } from "@/components/auth/demo-login-button";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
} from "@/components/ui/form-controls";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <>
      <form action={action} className="space-y-4">
        <Field htmlFor="email">
          <FieldLabel>Email</FieldLabel>
          <Input
            aria-describedby={emailError ? "email-error" : undefined}
            aria-invalid={Boolean(emailError)}
            autoComplete="email"
            className="h-11"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          {emailError ? <FieldError id="email-error">{emailError}</FieldError> : null}
        </Field>
        <Field htmlFor="password">
          <FieldLabel>Password</FieldLabel>
          <Input
            aria-describedby={passwordError ? "password-error" : undefined}
            aria-invalid={Boolean(passwordError)}
            autoComplete="current-password"
            className="h-11"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
          {passwordError ? (
            <FieldError id="password-error">{passwordError}</FieldError>
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
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p className="mb-3 text-center text-sm text-slate-600 dark:text-slate-400">
          No sign-up required.
        </p>
        <DemoLoginButton
          className="w-full"
          label="Continue with Demo Account"
        />
      </div>
    </>
  );
}
