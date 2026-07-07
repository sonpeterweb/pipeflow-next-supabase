"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  FileText,
  Gauge,
  Receipt,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems: Array<{
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/jobs", label: "Jobs", icon: Wrench },
  { href: "/dashboard/quotes", label: "Quotes", icon: FileText },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard navigation"
      className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              "items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-950",
              active &&
                "bg-brand-primary-light text-brand-primary shadow-sm hover:bg-brand-primary-light hover:text-brand-primary dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
