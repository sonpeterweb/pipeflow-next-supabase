import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm",
        className,
      )}
    >
      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
        {icon ?? <Inbox aria-hidden="true" size={20} />}
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
      {action && (
        <Button className="mt-5" onClick={action.onClick} type="button">
          {action.label}
        </Button>
      )}
    </div>
  );
}
