/**
 * Store global do dashboard.
 * Os pedidos são deduplicados e a cache só guarda dados, nunca estados transitórios.
 */

import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { normalizeName } from "@/lib/filters";
import { getAlbumInfo } from "@/services/albums";
import { getArtistInfo } from "@/services/artists";
import { getScrobbles, SCROBBLES_ENDPOINT } from "@/services/scrobbles";
import type { AppStore, PersistedStore, Scrobble } from "@/types";
import { mergePersisted, toCachedEntry, toCachedMap } from "./cache";
import { dedupe } from "./dedup";
import { emptyEntry, entryFromResult, loadingEntry } from "./entry";
import { storage } from "./indexed-db-storage";

const STORAGE_KEY = "fmdata-store:v1";
const STORAGE_VERSION = 1;

export function createAppStore() {
  return createStore<AppStore>()(
    persist<AppStore, [], [], PersistedStore>(
      (set, get) => ({
        scrobbles: emptyEntry<Scrobble[]>(),
        artists: {},
        albums: {},

        loadScrobbles: (force = false) => {
          const current = get().scrobbles;
          if (!force && current.status === "success" && current.data) {
            return Promise.resolve();
          }

          return dedupe("scrobbles", async () => {
            set((state) => ({ scrobbles: loadingEntry(state.scrobbles) }));

            const result = await getScrobbles();

            set((state) => ({
              scrobbles: entryFromResult(result, state.scrobbles),
            }));
          });
        },

        loadArtist: (name, force = false) => {
          const key = normalizeName(name);
          if (!key) return Promise.resolve();

          const current = get().artists[key];
          if (!force && current?.status === "success" && current.data) {
            return Promise.resolve();
          }

          return dedupe(`artist:${key}`, async () => {
            set((state) => ({
              artists: {
                ...state.artists,
                [key]: loadingEntry(state.artists[key]),
              },
            }));

            const result = await getArtistInfo(name);

            set((state) => ({
              artists: {
                ...state.artists,
                [key]: entryFromResult(result, state.artists[key]),
              },
            }));
          });
        },

        loadAlbum: (artist, album, force = false) => {
          const artistKey = normalizeName(artist);
          const albumKey = normalizeName(album);
          if (!artistKey || !albumKey) return Promise.resolve();

          const key = `${artistKey}::${albumKey}`;
          const current = get().albums[key];
          if (!force && current?.status === "success" && current.data) {
            return Promise.resolve();
          }

          return dedupe(`album:${key}`, async () => {
            set((state) => ({
              albums: {
                ...state.albums,
                [key]: loadingEntry(state.albums[key]),
              },
            }));

            const result = await getAlbumInfo(artist, album);

            set((state) => ({
              albums: {
                ...state.albums,
                [key]: entryFromResult(result, state.albums[key]),
              },
            }));
          });
        },
      }),
      {
        name: STORAGE_KEY,
        version: STORAGE_VERSION,
        storage: createJSONStorage(() => storage),
        skipHydration: true,
        partialize: (state): PersistedStore => ({
          scrobblesEndpoint: SCROBBLES_ENDPOINT,
          scrobbles: toCachedEntry(state.scrobbles),
          artists: toCachedMap(state.artists),
          albums: toCachedMap(state.albums),
        }),
        merge: (persisted, current) =>
          mergePersisted(persisted, current, SCROBBLES_ENDPOINT),
      },
    ),
  );
}

export type AppStoreApi = ReturnType<typeof createAppStore>;
