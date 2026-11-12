/**
 * Tradução entre o estado da store e a forma persistida no IndexedDB.
 * Só passam dados; status e error ficam sempre de fora.
 */

import type {
  AppStore,
  CachedEntry,
  Entry,
  PersistedStore,
  Scrobble,
} from "@/types";
import { emptyEntry } from "./entry";

export function toCachedEntry<T>(entry: Entry<T>): CachedEntry<T> | null {
  if (!entry.data) return null;
  return { data: entry.data, updatedAt: entry.updatedAt };
}

export function toCachedMap<T>(
  entries: Record<string, Entry<T>>,
): Record<string, CachedEntry<T>> {
  const cached: Record<string, CachedEntry<T>> = {};

  for (const [key, entry] of Object.entries(entries)) {
    const cachedEntry = toCachedEntry(entry);
    if (cachedEntry) cached[key] = cachedEntry;
  }

  return cached;
}

export function fromCachedEntry<T>(cached: CachedEntry<T>): Entry<T> {
  return {
    data: cached.data,
    status: "success",
    error: null,
    updatedAt: cached.updatedAt,
  };
}

export function fromCachedMap<T>(
  cached: Record<string, CachedEntry<T>> | undefined,
): Record<string, Entry<T>> {
  const entries: Record<string, Entry<T>> = {};
  if (!cached) return entries;

  for (const [key, cachedEntry] of Object.entries(cached)) {
    entries[key] = fromCachedEntry(cachedEntry);
  }

  return entries;
}

/**
 * Junta a cache guardada com o estado atual.
 * Scrobbles de outro endpoint são descartados; as restantes caches mantêm-se.
 */
export function mergePersisted(
  persisted: unknown,
  current: AppStore,
  scrobblesEndpoint: string,
): AppStore {
  const cached = persisted as Partial<PersistedStore> | undefined;
  if (!cached) return current;

  const scrobbles =
    cached.scrobbles && cached.scrobblesEndpoint === scrobblesEndpoint
      ? fromCachedEntry(cached.scrobbles)
      : emptyEntry<Scrobble[]>();

  return {
    ...current,
    scrobbles,
    artists: fromCachedMap(cached.artists),
    albums: fromCachedMap(cached.albums),
  };
}
