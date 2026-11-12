import type { ReactNode } from "react";
import {
  type FiltroDePeriodo,
  PeriodFilter,
} from "@/components/dashboard/period-filter";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
} from "@/components/glaze/ui/card";

interface SectionCardProps {
  title: string;
  description?: string;
  /** Filtro de período local; os cartões que não têm período próprio omitem-no. */
  filter?: FiltroDePeriodo;
  children: ReactNode;
}

/** Cartão de secção: título, descrição e, quando o cartão filtra, o filtro de período. */
export function SectionCard({
  title,
  description,
  filter,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader>
        {/* CardTitle fixa type-label (13px), menor do que os títulos das linhas; a secção usa o papel de heading. */}
        <h2 className="col-start-1 min-w-0 type-heading text-text-1">
          {title}
        </h2>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {filter ? (
          <CardAction>
            <PeriodFilter label={title} {...filter} />
          </CardAction>
        ) : null}
      </CardHeader>
      {children}
    </Card>
  );
}
