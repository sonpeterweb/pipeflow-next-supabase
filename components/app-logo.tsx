import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function AppLogo({
  className,
  variant = "auto",
}: {
  className?: string;
  variant?: "auto" | "dark" | "light";
}) {
  const imageClassName = "h-12 w-auto";

  return (
    <Link
      aria-label="PipeFlow home"
      className={cn(
        "inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
        className,
      )}
      href="/"
    >
      {variant === "auto" ? (
        <>
          <Image
            alt="PipeFlow"
            className={cn(imageClassName, "dark:hidden")}
            height={40}
            priority
            src="/logo.png"
            width={120}
          />
          <Image
            alt="PipeFlow"
            className={cn(imageClassName, "hidden dark:block")}
            height={40}
            priority
            src="/logo-dark.png"
            width={120}
          />
        </>
      ) : (
        <Image
          alt="PipeFlow"
          className={imageClassName}
          height={40}
          priority
          src={variant === "dark" ? "/logo-dark.png" : "/logo.png"}
          width={120}
        />
      )}
    </Link>
  );
}
