"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { type AppStoreApi, createAppStore } from "@/stores/app-store";
import type { AppStore } from "@/types";

const AppStoreContext = createContext<AppStoreApi | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

/** Instância da store, para hidratação e chamadas imperativas. */
export function useAppStoreApi(): AppStoreApi {
  const store = useContext(AppStoreContext);

  if (!store) {
    throw new Error(
      "useAppStoreApi tem de ser usado dentro de AppStoreProvider.",
    );
  }

  return store;
}

/** Seleciona uma parte da store. */
export function useAppStore<T>(selector: (state: AppStore) => T): T {
  return useStore(useAppStoreApi(), selector);
}
