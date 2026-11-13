"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { removerSemData } from "@/lib/filters";
import { useAppStore } from "@/providers/app-store-provider";
import type { Scrobble, Status } from "@/types";

/** Referência estável para evitar recalcular consumidores sem dados. */
const EMPTY_SCROBBLES: Scrobble[] = [];

export interface UseScrobblesResult {
  data: Scrobble[];
  /** A reprodução em curso, quando a API a devolve; fica fora de `data` e das contas. */
  nowPlaying: Scrobble | null;
  status: Status;
  error: string | null;
  updatedAt: number | null;
  reload: () => void;
}

/** Histórico sem "a tocar agora". A filtragem por período é feita fora da cache. */
export function useScrobbles(): UseScrobblesResult {
  const hydrated = useHydrated();
  const scrobbles = useAppStore((state) => state.scrobbles);
  const loadScrobbles = useAppStore((state) => state.loadScrobbles);

  useEffect(() => {
    if (!hydrated) return;
    void loadScrobbles();
  }, [hydrated, loadScrobbles]);

  const data = useMemo(
    () => (scrobbles.data ? removerSemData(scrobbles.data) : EMPTY_SCROBBLES),
    [scrobbles.data],
  );

  const nowPlaying = useMemo(
    () => scrobbles.data?.find((row) => row.nowplaying) ?? null,
    [scrobbles.data],
  );

  const reload = useCallback(() => {
    void loadScrobbles(true);
  }, [loadScrobbles]);

  return {
    data,
    nowPlaying,
    status: scrobbles.status,
    error: scrobbles.error,
    updatedAt: scrobbles.updatedAt,
    reload,
  };
}
