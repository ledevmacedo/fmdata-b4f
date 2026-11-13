import type { ReactNode } from "react";
import {
  type FiltroDePeriodo,
  PeriodFilter,
} from "@/components/dashboard/period-filter";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/glaze/utils";

interface SectionCardProps {
  id?: string;
  title: string;
  description?: string;
  /** Filtro de período local; os cartões que não têm período próprio omitem-no. */
  filter?: FiltroDePeriodo;
  className?: string;
  children: ReactNode;
}

/**
 * A section of the report: heading, optional period filter, then content.
 * Flat on the page, closed by a hairline, so the data is not boxed into cards.
 */
export function SectionCard({
  id,
  title,
  description,
  filter,
  className,
  children,
}: SectionCardProps) {
  return (
    <Reveal
      as="section"
      id={id}
      className={cn("scroll-mt-20 border-t border-line-faint pt-6", className)}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="min-w-0 type-heading text-text-1 [overflow-wrap:anywhere]">
            {title}
          </h2>
          {description ? (
            <p className="type-body-sm text-text-2">{description}</p>
          ) : null}
        </div>
        {filter ? <PeriodFilter label={title} {...filter} /> : null}
      </div>
      {children}
    </Reveal>
  );
}
