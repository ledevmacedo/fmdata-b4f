import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
}) {
  if (orientation === "horizontal") {
    return (
      <hr
        className={cn("h-px w-full border-0 bg-border", className)}
        {...props}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("h-full w-px shrink-0 bg-border", className)}
      {...props}
    />
  );
}
