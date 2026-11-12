"use client";

import { useMemo, useState } from "react";

import { filtrarPorPeriodo } from "@/lib/filters";
import type { Period, Scrobble } from "@/types";

/** Filtro de período de um cartão: a escolha e as reproduções que ela deixa passar. */
export function usePeriodoLocal(rows: Scrobble[]) {
  const [period, setPeriod] = useState<Period>("all");
  const filtradas = useMemo(
    () => filtrarPorPeriodo(rows, period),
    [rows, period],
  );
  return { period, setPeriod, rows: filtradas };
}
