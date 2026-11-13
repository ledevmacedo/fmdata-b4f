/**
 * Agregação do dashboard a partir do histórico de reproduções.
 * A página passa as linhas da store; não há dados de exemplo.
 */

import { type ArtistaEsquecido, artistaEsquecido } from "@/lib/analise";
import { normalizeName } from "@/lib/filters";
import type { RankingItem, Scrobble } from "@/types";

export interface DashboardSummary {
  /** Imagem de fundo do perfil; os dados locais não trazem capa, usa a arte do artista mais ouvido. */
  cover: string | null;
  topTrack: RankingItem | null;
  /** Total de reproduções no histórico local. */
  totalScrobbles: number;
  /** Artistas distintos no histórico local. */
  uniqueArtists: number;
  /** Álbuns distintos no histórico local; linhas sem álbum não contam. */
  uniqueAlbums: number;
  /** Reprodução mais antiga e mais recente com data, em segundos Unix. */
  firstScrobble: number | null;
  lastScrobble: number | null;
  esquecido: ArtistaEsquecido | null;
}

type Group = { row: Scrobble; count: number; last: number };

/** Agrupa por chave normalizada e guarda a reprodução mais recente de cada grupo. */
function groupBy(rows: Scrobble[], keyOf: (row: Scrobble) => string) {
  const groups = new Map<string, Group>();
  for (const row of rows) {
    const key = keyOf(row);
    if (!key) continue;
    // A reprodução em curso não tem data e passa à frente de todas as outras.
    const last = row.date_uts ?? Number.POSITIVE_INFINITY;
    const hit = groups.get(key);
    if (!hit) {
      groups.set(key, { row, count: 1, last });
      continue;
    }
    hit.count += 1;
    if (last > hit.last) {
      hit.row = row;
      hit.last = last;
    }
  }
  return [...groups];
}

type ItemOf = (
  row: Scrobble,
) => Pick<RankingItem, "name" | "subtitle" | "image" | "href">;

function rank(
  rows: Scrobble[],
  keyOf: (row: Scrobble) => string,
  itemOf: ItemOf,
  limit: number,
) {
  return (
    groupBy(rows, keyOf)
      .map(([key, { row, count }]) => ({ key, ...itemOf(row), count }))
      // Empates pelo nome, como em `posicaoDoArtista`, para a ordem não variar entre renders.
      .sort((a, b) => b.count - a.count || (a.key < b.key ? -1 : 1))
      .slice(0, limit)
  );
}

const artistKey = (row: Scrobble) => normalizeName(row.artist_name);
const trackKey = (row: Scrobble) =>
  `${normalizeName(row.artist_name)}::${normalizeName(row.track_name)}`;
const albumKey = (row: Scrobble) =>
  row.album_name.trim()
    ? `${normalizeName(row.artist_name)}::${normalizeName(row.album_name)}`
    : "";

const artistItem: ItemOf = (row) => ({
  name: row.artist_name,
  image: row.image_url,
  href: `/artistas/${encodeURIComponent(row.artist_name)}`,
});
const trackItem: ItemOf = (row) => ({
  name: row.track_name,
  subtitle: row.artist_name,
  image: row.image_url,
});
const albumItem: ItemOf = (row) => ({
  name: row.album_name,
  subtitle: row.artist_name,
  image: row.image_url,
});

export function buildDashboard(rows: Scrobble[]): DashboardSummary {
  const artists = topArtistas(rows, 1);
  const tracks = topMusicas(rows, 1);
  let firstScrobble: number | null = null;
  let lastScrobble: number | null = null;

  for (const row of rows) {
    if (row.date_uts === null) continue;
    if (firstScrobble === null || row.date_uts < firstScrobble) {
      firstScrobble = row.date_uts;
    }
    if (lastScrobble === null || row.date_uts > lastScrobble) {
      lastScrobble = row.date_uts;
    }
  }

  return {
    cover: artists[0]?.image ?? null,
    topTrack: tracks[0] ?? null,
    totalScrobbles: rows.length,
    uniqueArtists: new Set(rows.map(artistKey)).size,
    uniqueAlbums: new Set(rows.map(albumKey).filter(Boolean)).size,
    firstScrobble,
    lastScrobble,
    esquecido: artistaEsquecido(rows),
  };
}

/** Artistas mais ouvidos no período. */
export function topArtistas(rows: Scrobble[], limite = 20): RankingItem[] {
  return rank(rows, artistKey, artistItem, limite);
}

/** Faixas mais ouvidas no período. */
export function topMusicas(rows: Scrobble[], limite = 10): RankingItem[] {
  return rank(rows, trackKey, trackItem, limite);
}

/** Álbuns mais ouvidos no período. */
export function topAlbuns(rows: Scrobble[], limite = 8): RankingItem[] {
  return rank(rows, albumKey, albumItem, limite);
}
