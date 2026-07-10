"use client";

import { useActionState } from "react";

import { loginDemo, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {};

export function DemoLoginButton({
  className,
  formClassName,
  label = "Explore Demo",
  pendingLabel = "Opening demo...",
  showError = true,
  variant = "outline",
}: {
  className?: string;
  formClassName?: string;
  label?: string;
  pendingLabel?: string;
  showError?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
}) {
  const [state, action, pending] = useActionState(loginDemo, initialState);

  return (
    <form action={action} className={formClassName}>
      {showError && state.message ? (
        <p
          className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Button
        aria-label={pending ? pendingLabel : label}
        className={className}
        disabled={pending}
        type="submit"
        variant={variant}
      >
        {pending ? pendingLabel : label}
      </Button>
    </form>
  );
}
