import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { isTrackImageResponse, type TrackImageResponse } from "@/lib/api";

export interface TrackCoverStoreState {
  trackImage: TrackImageResponse | null;
  hasHydrated: boolean;
  setTrackImage: (trackImage: TrackImageResponse) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export function createTrackCoverStore() {
  return createStore<TrackCoverStoreState>()(
    persist(
      (set) => ({
        trackImage: null,
        hasHydrated: false,
        setTrackImage: (trackImage) => set({ trackImage }),
        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      }),
      {
        name: "fmdata-track-image",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ trackImage: state.trackImage }),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          if (
            typeof persistedState !== "object" ||
            persistedState === null ||
            !("trackImage" in persistedState) ||
            !isTrackImageResponse(persistedState.trackImage)
          ) {
            return currentState;
          }

          return {
            ...currentState,
            trackImage: persistedState.trackImage,
          };
        },
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.error("Não foi possível restaurar a capa em cache.", error);
          }
          state?.setHasHydrated(true);
        },
      },
    ),
  );
}

export type TrackCoverStore = ReturnType<typeof createTrackCoverStore>;
