import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function DropdownMenu({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group relative inline-block", className)}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-4 text-label marker:hidden hover:bg-muted focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {label}
        <AltArrowDownIcon aria-hidden="true" size={16} />
      </summary>
      <div className="absolute right-0 top-full z-30 mt-2 min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-soft [&_button]:flex [&_button]:min-h-10 [&_button]:w-full [&_button]:items-center [&_button]:rounded-sm [&_button]:px-3 [&_button]:text-left [&_button]:text-label hover:[&_button]:bg-muted">
        {children}
      </div>
    </details>
  );
}
