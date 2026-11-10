"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({
  items,
  className,
}: {
  items: TabItem[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const id = useId();

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = items.findIndex((item) => item.id === active);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (current + (event.key === "ArrowRight" ? 1 : items.length - 1)) %
            items.length;
    setActive(items[next]?.id ?? "");
    document.getElementById(`${id}-${items[next]?.id}`)?.focus();
  }

  const activeItem = items.find((item) => item.id === active);
  return (
    <div className={className}>
      <div
        aria-label="Exemplo de separadores"
        className="inline-flex rounded-full bg-secondary p-1"
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        {items.map((item) => (
          <button
            aria-controls={`${id}-panel`}
            aria-selected={active === item.id}
            className={cn(
              "min-h-10 rounded-full px-4 text-label transition-colors",
              active === item.id
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
            id={`${id}-${item.id}`}
            key={item.id}
            onClick={() => setActive(item.id)}
            role="tab"
            tabIndex={active === item.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`${id}-${active}`}
        className="mt-4 rounded-md bg-muted p-4 text-body leading-relaxed"
        id={`${id}-panel`}
        role="tabpanel"
      >
        {activeItem?.content}
      </div>
    </div>
  );
}
