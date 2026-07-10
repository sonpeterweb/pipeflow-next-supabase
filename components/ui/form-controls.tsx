import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export const controlClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900 dark:disabled:text-slate-500";

export function Field({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block space-y-2", className)} {...props} />;
}

export function FieldLabel({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "block text-sm font-medium leading-5 text-slate-700 dark:text-slate-300",
        className,
      )}
      {...props}
    />
  );
}

export function FieldHint({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-5 text-slate-500 dark:text-slate-400", className)} {...props} />
  );
}

export function FieldError({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm font-medium leading-5 text-red-700 dark:text-red-300", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-10", controlClassName, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-24 py-2", controlClassName, className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn("h-10", controlClassName, className)} {...props}>
      {children}
    </select>
  );
}
