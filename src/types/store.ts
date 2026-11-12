import type { AlbumProfile, ArtistProfile, Scrobble } from "./api";
import type { Entry } from "./domain";

/** Parte da store que é estado persistido. */
export interface StoreState {
  scrobbles: Entry<Scrobble[]>;
  /** Chave: nome normalizado do artista. */
  artists: Record<string, Entry<ArtistProfile>>;
  /** Chave: artista e álbum normalizados. */
  albums: Record<string, Entry<AlbumProfile>>;
}

/** Ações que alteram a store e disparam pedidos. */
export interface StoreActions {
  loadScrobbles: (force?: boolean) => Promise<void>;
  loadArtist: (name: string, force?: boolean) => Promise<void>;
  loadAlbum: (artist: string, album: string, force?: boolean) => Promise<void>;
}

/** Contrato completo da store Zustand. */
export type AppStore = StoreState & StoreActions;

/** Entrada tal como fica guardada na cache: apenas dados, sem estado transitório. */
export interface CachedEntry<T> {
  data: T;
  updatedAt: number | null;
}

/** Forma persistida no IndexedDB. */
export interface PersistedStore {
  /** Endpoint usado quando os scrobbles foram guardados. */
  scrobblesEndpoint: string;
  scrobbles: CachedEntry<Scrobble[]> | null;
  artists: Record<string, CachedEntry<ArtistProfile>>;
  albums: Record<string, CachedEntry<AlbumProfile>>;
}
