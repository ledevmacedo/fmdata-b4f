import type { AlbumProfile, ArtistProfile, Scrobble } from "./api";
import type { Entry, Periodo } from "./domain";

/** Parte da store que é estado persistido. */
export interface StoreState {
  periodo: Periodo;
  scrobbles: Entry<Scrobble[]>;
  /** Chave: nome normalizado do artista. */
  artistas: Record<string, Entry<ArtistProfile>>;
  /** Chave: artista e álbum normalizados. */
  albuns: Record<string, Entry<AlbumProfile>>;
}

/** Ações que alteram a store e disparam pedidos. */
export interface StoreActions {
  setPeriodo: (periodo: Periodo) => void;
  carregarScrobbles: (force?: boolean) => Promise<void>;
  carregarArtista: (nome: string, force?: boolean) => Promise<void>;
  carregarAlbum: (
    artista: string,
    album: string,
    force?: boolean,
  ) => Promise<void>;
}

/** Contrato completo da store Zustand. */
export type AppStore = StoreState & StoreActions;
