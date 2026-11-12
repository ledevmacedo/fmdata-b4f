/**
 * Filtros e normalização de texto.
 */

import { dataDeReferencia, duracaoDoPeriodoMs } from "@/lib/dates";
import type { Period, Scrobble } from "@/types";

/** Chave estável para comparações e caches: sem espaços nas pontas e em minúsculas. */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

/** Descarta "a tocar agora" e linhas sem data; a API repete-as e não são reproduções. */
export function removerSemData(rows: Scrobble[]): Scrobble[] {
  return rows.filter(
    (row) => row.date_uts !== null && row.date_iso !== "nowplaying",
  );
}

/**
 * Reproduções do período pedido, contadas a partir da última reprodução do histórico.
 * "Todo o tempo" devolve as linhas tal como vieram, incluindo a reprodução em curso.
 */
export function filtrarPorPeriodo(
  rows: Scrobble[],
  period: Period,
): Scrobble[] {
  const duracao = duracaoDoPeriodoMs(period);
  if (duracao === null) return rows;

  const referencia = dataDeReferencia(rows);
  if (referencia === null) return [];

  const inicio = referencia - duracao;
  return rows.filter(
    (row) => row.date_uts !== null && row.date_uts * 1000 >= inicio,
  );
}
