"use client";

import { useEffect, useState } from "react";

import { useAppStoreApi } from "@/providers/app-store-provider";
import type { AppStoreApi } from "@/stores/app-store";

/** Uma hidratação por instância de store, mesmo com vários componentes a pedir. */
const hydrations = new WeakMap<AppStoreApi, Promise<void>>();

/** true depois de a cache persistida estar carregada no cliente. */
export function useHydrated(): boolean {
  const store = useAppStoreApi();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    let request = hydrations.get(store);

    if (!request) {
      request = Promise.resolve(
        store.persist.hasHydrated() ? undefined : store.persist.rehydrate(),
      );
      hydrations.set(store, request);
    }

    request.then(() => {
      if (active) setHydrated(true);
    });

    return () => {
      active = false;
    };
  }, [store]);

  return hydrated;
}
