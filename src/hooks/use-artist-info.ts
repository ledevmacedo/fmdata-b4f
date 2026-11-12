"use client";

import { useCallback, useEffect } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { normalizeName } from "@/lib/filters";
import { useAppStore } from "@/providers/app-store-provider";
import type { ArtistProfile, Status } from "@/types";

export interface UseArtistInfoResult {
  data: ArtistProfile | null;
  status: Status;
  error: string | null;
  reload: () => void;
}

/** Perfil do artista a partir da cache; pede à API quando ainda não está lá. */
export function useArtistInfo(name: string): UseArtistInfoResult {
  const hydrated = useHydrated();
  const key = normalizeName(name);
  const entry = useAppStore((state) => state.artists[key]);
  const loadArtist = useAppStore((state) => state.loadArtist);

  useEffect(() => {
    if (!hydrated || !key) return;
    void loadArtist(name);
  }, [hydrated, key, name, loadArtist]);

  const reload = useCallback(() => {
    void loadArtist(name, true);
  }, [loadArtist, name]);

  return {
    data: entry?.data ?? null,
    status: entry?.status ?? "idle",
    error: entry?.error ?? null,
    reload,
  };
}
