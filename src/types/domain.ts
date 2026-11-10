import type { AlbumProfile, ArtistProfile, Scrobble } from "./api";

/** Períodos disponíveis no filtro global do dashboard. */
export type Periodo = "tudo" | "30d" | "14d" | "7d" | "24h";

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
export interface ItemRanking {
  /** Identificador único, por exemplo "artista::faixa". */
  chave: string;
  /** Nome apresentado ao utilizador. */
  nome: string;
  /** Contexto opcional, por exemplo o artista de uma faixa. */
  subtitulo?: string;
  contagem: number;
  imagem?: string | null;
}

/** Ponto de um gráfico mensal. */
export interface PontoMensal {
  /** Ano e mês em UTC, no formato "2024-03". */
  mes: string;
  contagem: number;
}

/** Ponto de um gráfico de 24 horas, em UTC. */
export interface PontoHora {
  /** Hora do dia em UTC (0–23). */
  hora: number;
  contagem: number;
}

/** Artista semelhante com indicação se já foi ouvido. */
export interface ArtistaSemelhante {
  nome: string;
  ouvido: boolean;
}

/** Resumo all-time de um artista. */
export interface ResumoArtista {
  totalAudicoes: number;
  /** Percentagem do histórico completo, entre 0 e 100. */
  percentagemDoTotal: number;
  /** Faixas distintas marcadas como favoritas. */
  faixasFavoritas: number;
  primeiraReproducao: Date | null;
  ultimaReproducao: Date | null;
}

/** Álbum de um artista, com as faixas distintas que já foram ouvidas. */
export interface AlbumDoArtista {
  nome: string;
  audicoes: number;
  faixasDistintas: number;
  imagem?: string | null;
}

/** Resultado da contagem de géneros/tags. */
export interface GeneroContagem {
  genero: string;
  contagem: number;
}

export type ScrobblesEntry = Entry<Scrobble[]>;
export type ArtistEntry = Entry<ArtistProfile>;
export type AlbumEntry = Entry<AlbumProfile>;
