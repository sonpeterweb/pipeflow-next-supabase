"use client";

import { useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

function ConfirmSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="destructive">
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          Deleting...
        </span>
      ) : (
        label
      )}
    </Button>
  );
}

export function ConfirmationDialog({
  action,
  cancelLabel = "Cancel",
  confirmLabel,
  description,
  title,
  triggerLabel,
}: {
  action: () => void | Promise<void>;
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  title: string;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button" variant="destructive">
        {triggerLabel}
      </Button>
      {open ? (
        <div
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <h2
              className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100"
              id={titleId}
            >
              {title}
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"
              id={descriptionId}
            >
              {description}
            </p>
            <form action={action} className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                {cancelLabel}
              </Button>
              <ConfirmSubmitButton label={confirmLabel} />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
