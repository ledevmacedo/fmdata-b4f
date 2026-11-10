import type { AlbumProfile, ArtistProfile, Scrobble } from "./api";

/** Períodos disponíveis no filtro global do dashboard. */
export type Period = "all" | "30d" | "14d" | "7d" | "24h";

/** Estado de qualquer dado que vem da rede. */
export type Status = "idle" | "loading" | "success" | "error" | "not-found";

/** Envelope comum para dados remotos, cache e persistência. */
export interface Entry<T> {
  data: T | null;
  status: Status;
  error: string | null;
  updatedAt: number | null;
}

/** Item de um ranking (artistas, músicas ou álbuns). */
export interface RankingItem {
  /** Identificador único, por exemplo "artista::faixa". */
  key: string;
  /** Nome apresentado ao utilizador. */
  name: string;
  /** Contexto opcional, por exemplo o artista de uma faixa. */
  subtitle?: string;
  count: number;
  image?: string | null;
}

/** Ponto de um gráfico mensal. */
export interface MonthlyPoint {
  /** Ano e mês em UTC, no formato "2024-03". */
  month: string;
  count: number;
}

/** Ponto de um gráfico de 24 horas, em UTC. */
export interface HourPoint {
  /** Hora do dia em UTC (0–23). */
  hour: number;
  count: number;
}

/** Artista semelhante com indicação se já foi ouvido. */
export interface SimilarArtist {
  name: string;
  listened: boolean;
}

/** Resumo all-time de um artista. */
export interface ArtistSummary {
  totalScrobbles: number;
  /** Percentagem do histórico completo, entre 0 e 100. */
  percentOfTotal: number;
  /** Faixas distintas marcadas como favoritas. */
  favouriteTracks: number;
  firstPlayed: Date | null;
  lastPlayed: Date | null;
}

/** Álbum de um artista, com as faixas distintas que já foram ouvidas. */
export interface ArtistAlbum {
  name: string;
  scrobbles: number;
  distinctTracks: number;
  image?: string | null;
}

/** Resultado da contagem de géneros/tags. */
export interface GenreCount {
  genre: string;
  count: number;
}

export type ScrobblesEntry = Entry<Scrobble[]>;
export type ArtistEntry = Entry<ArtistProfile>;
export type AlbumEntry = Entry<AlbumProfile>;
