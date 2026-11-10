import { cloneElement, isValidElement, type ReactElement, useId } from "react";
import { cn } from "@/lib/cn";

export function Tooltip({
  children,
  content,
  className,
}: {
  children: ReactElement<{ "aria-describedby"?: string }>;
  content: string;
  className?: string;
}) {
  const id = useId();
  const describedChild = isValidElement(children)
    ? cloneElement(children, { "aria-describedby": id })
    : children;

  return (
    <span className={cn("group relative inline-flex", className)}>
      {describedChild}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-sm bg-foreground px-3 py-2 text-caption text-background opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        id={id}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
