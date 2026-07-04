import Link from "next/link";

export function AppLogo() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-primary text-sm font-bold text-white shadow-sm">
        PF
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-950">
        PipeFlow
      </span>
    </Link>
  );
}
