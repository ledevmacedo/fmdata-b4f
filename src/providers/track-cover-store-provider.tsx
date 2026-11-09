"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore } from "zustand";
import {
  createTrackCoverStore,
  type TrackCoverStore,
  type TrackCoverStoreState,
} from "@/stores/track-cover-store";

const TrackCoverStoreContext = createContext<TrackCoverStore | null>(null);

export function TrackCoverStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<TrackCoverStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createTrackCoverStore();
  }

  const store = storeRef.current;

  useEffect(() => {
    void store.persist.rehydrate();
  }, [store]);

  return (
    <TrackCoverStoreContext.Provider value={store}>
      {children}
    </TrackCoverStoreContext.Provider>
  );
}

export function useTrackCoverStore<T>(
  selector: (state: TrackCoverStoreState) => T,
) {
  const store = useContext(TrackCoverStoreContext);

  if (!store) {
    throw new Error(
      "useTrackCoverStore deve ser usado dentro de TrackCoverStoreProvider.",
    );
  }

  return useStore(store, selector);
}
