"use client";

import { useCallback, useEffect } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { normalizeName } from "@/lib/filters";
import { useAppStore } from "@/providers/app-store-provider";
import type { AlbumProfile, Status } from "@/types";

export interface UseAlbumInfoResult {
  data: AlbumProfile | null;
  status: Status;
  error: string | null;
  reload: () => void;
}

/** Perfil do álbum a partir da cache; pede à API quando ainda não está lá. */
export function useAlbumInfo(
  artist: string,
  album: string,
): UseAlbumInfoResult {
  const hydrated = useHydrated();
  const key = `${normalizeName(artist)}::${normalizeName(album)}`;
  const entry = useAppStore((state) => state.albums[key]);
  const loadAlbum = useAppStore((state) => state.loadAlbum);

  useEffect(() => {
    if (!hydrated || key === "::") return;
    void loadAlbum(artist, album);
  }, [hydrated, key, artist, album, loadAlbum]);

  const reload = useCallback(() => {
    void loadAlbum(artist, album, true);
  }, [loadAlbum, artist, album]);

  return {
    data: entry?.data ?? null,
    status: entry?.status ?? "idle",
    error: entry?.error ?? null,
    reload,
  };
}
