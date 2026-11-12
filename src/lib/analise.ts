/**
 * Análise única do dashboard: quem ficou pelo caminho.
 * Divide o histórico ao meio pelo tempo e procura o artista que perdia reproduções, ou deixou de aparecer.
 */

import { normalizeName } from "@/lib/filters";
import type { Scrobble } from "@/types";

export interface ArtistaEsquecido {
  artista: string;
  /** Reproduções na primeira metade do histórico. */
  antes: number;
  /** Reproduções na segunda metade do histórico. */
  depois: number;
  /** Última reprodução, em segundos Unix. */
  ultimaVez: number;
  /** Dias sem ouvir, contados até à última reprodução do histórico. */
  diasSem: number;
}

export function artistaEsquecido(rows: Scrobble[]): ArtistaEsquecido | null {
  const comData = rows.filter((row) => row.date_uts);
  if (comData.length < 2) return null;

  const instantes = comData.map((row) => row.date_uts as number);
  const inicio = Math.min(...instantes);
  const fim = Math.max(...instantes);
  const meio = (inicio + fim) / 2;

  const porArtista = new Map<
    string,
    { artista: string; antes: number; depois: number; ultimaVez: number }
  >();
  for (const row of comData) {
    const chave = normalizeName(row.artist_name);
    const atual = porArtista.get(chave);
    const instante = row.date_uts as number;
    porArtista.set(chave, {
      artista: atual?.artista ?? row.artist_name,
      antes: (atual?.antes ?? 0) + (instante < meio ? 1 : 0),
      depois: (atual?.depois ?? 0) + (instante < meio ? 0 : 1),
      ultimaVez: Math.max(atual?.ultimaVez ?? 0, instante),
    });
  }

  /** Quem se calou por completo ganha a quem apenas abrandou. */
  const forca = (item: { antes: number; depois: number }) =>
    (item.depois === 0 ? 1_000 : 0) + item.antes - item.depois;

  let escolhido: ArtistaEsquecido | null = null;
  for (const item of porArtista.values()) {
    // Uma reprodução na primeira metade é ruído, não um hábito perdido.
    if (item.antes < 2) continue;
    if (escolhido && forca(item) <= forca(escolhido)) continue;
    escolhido = {
      ...item,
      // Dias de calendário em UTC, para bater com a data mostrada ao lado.
      diasSem: Math.floor(fim / 86_400) - Math.floor(item.ultimaVez / 86_400),
    };
  }
  return escolhido;
}
