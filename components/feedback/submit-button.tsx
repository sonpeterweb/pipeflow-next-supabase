"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel,
  variant,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      className={className}
      disabled={pending}
      type="submit"
      variant={variant}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
