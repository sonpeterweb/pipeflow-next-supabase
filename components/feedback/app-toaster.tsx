"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-slate-200 bg-white text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
          description: "text-slate-600 dark:text-slate-400",
        },
      }}
    />
  );
}
