"use client";

import { ChevronDown, Icon } from "@/components/glaze/icon";
import { Button } from "@/components/glaze/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/glaze/ui/dropdown-menu";
import type { Period } from "@/types";

const PERIODS: { value: Period; label: string }[] = [
  { value: "all", label: "Todo o tempo" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "14d", label: "Últimos 14 dias" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "24h", label: "Últimas 24 horas" },
];

/** Estado de um filtro de período controlado pelo cartão. */
export interface FiltroDePeriodo {
  value: Period;
  onChange: (period: Period) => void;
}

/** Filtro de período do cartão: só mostra a escolha, quem filtra é o cartão. */
export function PeriodFilter({
  label,
  value,
  onChange,
}: FiltroDePeriodo & { label: string }) {
  const current =
    PERIODS.find((period) => period.value === value) ?? PERIODS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Filtrar ${label} por período`}
          />
        }
      >
        {current.label}
        <Icon icon={ChevronDown} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" size="sm">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {PERIODS.map(({ value: option, label: texto }) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {texto}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
