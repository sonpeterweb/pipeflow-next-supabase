import Link from "next/link";

export function AppLogo() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white">
        PF
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-950">
        PipeFlow
      </span>
    </Link>
  );
}
