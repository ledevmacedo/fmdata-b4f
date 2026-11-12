/**
 * Períodos do filtro local: quanto tempo cada opção cobre e a partir de que instante se conta.
 * A âncora é a última reprodução do histórico, não o relógio, para os números não mudarem sozinhos.
 */

import type { Period, Scrobble } from "@/types";

const DIAS: Record<Period, number | null> = {
  all: null,
  "30d": 30,
  "14d": 14,
  "7d": 7,
  "24h": 1,
};

/** Duração do período em milissegundos; null quando não tem fim. */
export function duracaoDoPeriodoMs(period: Period): number | null {
  const dias = DIAS[period];
  return dias === null ? null : dias * 86_400_000;
}

/** Instante da última reprodução com data, em milissegundos; null quando nenhuma tem data. */
export function dataDeReferencia(rows: Scrobble[]): number | null {
  let ultimo: number | null = null;
  for (const row of rows) {
    if (row.date_uts === null) continue;
    if (ultimo === null || row.date_uts > ultimo) ultimo = row.date_uts;
  }
  return ultimo === null ? null : ultimo * 1000;
}
