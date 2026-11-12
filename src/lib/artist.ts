/**
 * Agregações da página do artista: entram reproduções, saem os números de cada bloco.
 * Sem fetch, sem store: a página escolhe os dados, estas funções só contam.
 */

import { normalizeName } from "@/lib/filters";
import type {
  ArtistAlbum,
  ArtistPosition,
  ArtistSummary,
  MonthlyPoint,
  RankingItem,
  Scrobble,
  SimilarArtist,
} from "@/types";

/** Divide uma lista separada por vírgulas em nomes, sem espaços nas pontas. */
export function separarLista(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Reproduções de um artista, comparando sem maiúsculas nem espaços nas pontas. */
export function scrobblesDoArtista(
  rows: Scrobble[],
  artista: string,
): Scrobble[] {
  const chave = normalizeName(artista);
  if (!chave) return [];
  return rows.filter((row) => normalizeName(row.artist_name) === chave);
}

/**
 * Posição do artista no histórico completo, por reproduções.
 * Empates desfeitos pelo nome normalizado, para a posição não depender da ordem dos dados.
 */
export function posicaoDoArtista(
  rows: Scrobble[],
  artista: string,
): ArtistPosition | null {
  const chave = normalizeName(artista);
  if (!chave) return null;

  const contagens = new Map<string, number>();
  for (const row of rows) {
    const nome = normalizeName(row.artist_name);
    contagens.set(nome, (contagens.get(nome) ?? 0) + 1);
  }

  const total = contagens.get(chave);
  if (!total) return null;

  let position = 1;
  for (const [nome, count] of contagens) {
    if (count > total || (count === total && nome < chave)) position += 1;
  }

  return { position, totalArtists: contagens.size };
}

interface GrupoDeFaixas {
  row: Scrobble;
  count: number;
  last: number;
}

/** Resumo all-time: total, peso no histórico, favoritas e as pontas da linha temporal. */
export function resumoDoArtista(
  rows: Scrobble[],
  totalDoHistorico: number,
): ArtistSummary {
  let primeiro: number | null = null;
  let ultimo: number | null = null;
  const favoritas = new Set<string>();

  for (const row of rows) {
    if (row.date_uts !== null) {
      primeiro =
        primeiro === null || row.date_uts < primeiro ? row.date_uts : primeiro;
      ultimo = ultimo === null || row.date_uts > ultimo ? row.date_uts : ultimo;
    }
    if (row.loved === 1) favoritas.add(normalizeName(row.track_name));
  }

  return {
    totalScrobbles: rows.length,
    percentOfTotal:
      totalDoHistorico > 0 ? (rows.length / totalDoHistorico) * 100 : 0,
    favouriteTracks: favoritas.size,
    firstPlayed: primeiro === null ? null : new Date(primeiro * 1000),
    lastPlayed: ultimo === null ? null : new Date(ultimo * 1000),
  };
}

/** Faixas mais ouvidas do artista, agrupadas por nome; a capa vem da reprodução mais recente. */
export function topMusicasDoArtista(
  rows: Scrobble[],
  limite = 10,
): RankingItem[] {
  const grupos = new Map<string, GrupoDeFaixas>();

  for (const row of rows) {
    const key = normalizeName(row.track_name);
    if (!key) continue;
    const last = row.date_uts ?? Number.POSITIVE_INFINITY;
    const hit = grupos.get(key);
    if (!hit) {
      grupos.set(key, { row, count: 1, last });
      continue;
    }
    hit.count += 1;
    if (last > hit.last) {
      hit.row = row;
      hit.last = last;
    }
  }

  return [...grupos]
    .map(([key, { row, count }]) => ({
      key,
      name: row.track_name,
      subtitle: row.album_name.trim() || undefined,
      image: row.image_url,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limite);
}

interface GrupoDeAlbum {
  album: ArtistAlbum;
  faixas: Set<string>;
  last: number;
}

/** Álbuns do artista por reproduções, com as faixas distintas de cada um. */
export function albunsDoArtista(rows: Scrobble[], limite = 8): ArtistAlbum[] {
  const grupos = new Map<string, GrupoDeAlbum>();

  for (const row of rows) {
    const nome = row.album_name.trim();
    if (!nome) continue;
    const faixa = normalizeName(row.track_name);
    const last = row.date_uts ?? Number.POSITIVE_INFINITY;
    const chave = normalizeName(nome);
    const hit = grupos.get(chave);

    if (!hit) {
      grupos.set(chave, {
        album: {
          name: nome,
          scrobbles: 1,
          distinctTracks: 0,
          image: row.image_url,
        },
        faixas: new Set([faixa]),
        last,
      });
      continue;
    }

    hit.album.scrobbles += 1;
    hit.faixas.add(faixa);
    if (last > hit.last) {
      hit.album.image = row.image_url;
      hit.last = last;
    }
  }

  return [...grupos.values()]
    .map(({ album, faixas }) => ({ ...album, distinctTracks: faixas.size }))
    .sort((a, b) => b.scrobbles - a.scrobbles)
    .slice(0, limite);
}

function mesDe(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Reproduções por mês, em UTC, numa série contínua que acaba no último mês com dados. */
export function scrobblesPorMes(rows: Scrobble[], meses = 24): MonthlyPoint[] {
  let ultimo: number | null = null;
  const contagens = new Map<string, number>();

  for (const row of rows) {
    if (!row.date_uts) continue;
    if (ultimo === null || row.date_uts > ultimo) ultimo = row.date_uts;
    const chave = mesDe(new Date(row.date_uts * 1000));
    contagens.set(chave, (contagens.get(chave) ?? 0) + 1);
  }

  if (ultimo === null) return [];

  const fim = new Date(ultimo * 1000);
  const pontos: MonthlyPoint[] = [];
  for (let i = meses - 1; i >= 0; i -= 1) {
    const chave = mesDe(
      new Date(Date.UTC(fim.getUTCFullYear(), fim.getUTCMonth() - i, 1)),
    );
    pontos.push({ month: chave, count: contagens.get(chave) ?? 0 });
  }
  return pontos;
}

/** Últimas reproduções, da mais recente; a reprodução em curso não tem data e vem primeiro. */
export function ultimasReproducoes(rows: Scrobble[], limite = 10): Scrobble[] {
  return [...rows]
    .sort((a, b) => {
      const da = a.date_uts ?? Number.POSITIVE_INFINITY;
      const db = b.date_uts ?? Number.POSITIVE_INFINITY;
      return da === db ? 0 : db > da ? 1 : -1;
    })
    .slice(0, limite);
}

/** Artistas semelhantes, marcando os que já aparecem no histórico. */
export function artistasSemelhantes(
  similar: string,
  rows: Scrobble[],
): SimilarArtist[] {
  const ouvidos = new Set(rows.map((row) => normalizeName(row.artist_name)));
  return separarLista(similar).map((name) => ({
    name,
    listened: ouvidos.has(normalizeName(name)),
  }));
}
