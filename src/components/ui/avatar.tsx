import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  initials: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  initials,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "size-8 text-caption",
    md: "size-10 text-label",
    lg: "size-12 text-body",
  };
  return (
    <span
      aria-label={`Avatar de ${initials}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground",
        sizes[size],
        className,
      )}
      role="img"
      {...props}
    >
      {initials}
    </span>
  );
}
