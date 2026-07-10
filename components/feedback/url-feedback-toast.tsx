"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const keys = ["success", "error", "warning", "info"] as const;

export function UrlFeedbackToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let handled = false;

    for (const key of keys) {
      const message = params.get(key);

      if (!message) {
        continue;
      }

      toast[key](message);
      params.delete(key);
      handled = true;
    }

    if (handled) {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  return null;
}
