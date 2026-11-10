"use client";

import { useCallback, useEffect } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { useAppStore } from "@/providers/app-store-provider";
import type { Scrobble, Status } from "@/types";

/** Referência estável para evitar recalcular consumidores sem dados. */
const EMPTY_SCROBBLES: Scrobble[] = [];

export interface UseScrobblesResult {
  data: Scrobble[];
  status: Status;
  error: string | null;
  updatedAt: number | null;
  reload: () => void;
}

/** Histórico cru. A filtragem por período é feita fora da cache. */
export function useScrobbles(): UseScrobblesResult {
  const hydrated = useHydrated();
  const scrobbles = useAppStore((state) => state.scrobbles);
  const loadScrobbles = useAppStore((state) => state.loadScrobbles);

  useEffect(() => {
    if (!hydrated) return;
    void loadScrobbles();
  }, [hydrated, loadScrobbles]);

  const reload = useCallback(() => {
    void loadScrobbles(true);
  }, [loadScrobbles]);

  return {
    data: scrobbles.data ?? EMPTY_SCROBBLES,
    status: scrobbles.status,
    error: scrobbles.error,
    updatedAt: scrobbles.updatedAt,
    reload,
  };
}
