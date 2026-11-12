/**
 * Agregações puras sobre scrobbles: contagens por hora e por etiqueta.
 * Sem fetch, sem store: entram reproduções, saem números.
 */

import { normalizeName } from "@/lib/filters";
import type { Scrobble } from "@/types";

/** Contagem por hora UTC (0–23); reproduções sem data ficam de fora. */
export function scrobblesPorHora(rows: Scrobble[]): number[] {
  const porHora = Array<number>(24).fill(0);
  for (const row of rows) {
    if (!row.date_uts) continue;
    porHora[new Date(row.date_uts * 1000).getUTCHours()] += 1;
  }
  return porHora;
}

/** Hora com mais reproduções, ou null quando não há nenhuma com data. */
export function horaDePico(porHora: number[]): number | null {
  const max = Math.max(...porHora);
  return max > 0 ? porHora.indexOf(max) : null;
}

/** Etiqueta mais frequente; compara sem maiúsculas nem espaços nas pontas. */
export function generoMaisOuvido(
  rows: Scrobble[],
): { genero: string; contagem: number } | null {
  const contagens = new Map<string, { genero: string; contagem: number }>();
  for (const row of rows) {
    for (const etiqueta of row.tags.split(",")) {
      const genero = etiqueta.trim();
      if (!genero) continue;
      const chave = normalizeName(genero);
      const atual = contagens.get(chave);
      contagens.set(chave, {
        genero: atual?.genero ?? genero,
        contagem: (atual?.contagem ?? 0) + 1,
      });
    }
  }

  let topo: { genero: string; contagem: number } | null = null;
  for (const item of contagens.values()) {
    if (!topo || item.contagem > topo.contagem) topo = item;
  }
  return topo;
}
