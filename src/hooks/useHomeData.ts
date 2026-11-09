"use client";

import { useEffect, useState } from "react";
import {
  type AlbumImageParams,
  type AlbumImageResponse,
  getAlbumImage,
  getHealth,
  getTrackImage,
  type HealthResponse,
  type TrackImageParams,
} from "@/lib/api";
import { useTrackCoverStore } from "@/providers/track-cover-store-provider";

interface RequestState<T> {
  data: T | null;
  error: string | null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}

export function useHomeData(
  albumParams: AlbumImageParams,
  trackParams: TrackImageParams,
) {
  const [health, setHealth] = useState<RequestState<HealthResponse>>({
    data: null,
    error: null,
  });
  const [album, setAlbum] = useState<RequestState<AlbumImageResponse>>({
    data: null,
    error: null,
  });
  const [trackError, setTrackError] = useState<string | null>(null);
  const trackImage = useTrackCoverStore((state) => state.trackImage);
  const hasHydrated = useTrackCoverStore((state) => state.hasHydrated);
  const setTrackImage = useTrackCoverStore((state) => state.setTrackImage);

  const { artist: albumArtist, album: albumName } = albumParams;
  const { artist: trackArtist, album: trackAlbum, track } = trackParams;

  useEffect(() => {
    const controller = new AbortController();

    getHealth(controller.signal)
      .then((data) => setHealth({ data, error: null }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setHealth({ data: null, error: getErrorMessage(error) });
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setAlbum({ data: null, error: null });
    getAlbumImage({ artist: albumArtist, album: albumName }, controller.signal)
      .then((data) => setAlbum({ data, error: null }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAlbum({ data: null, error: getErrorMessage(error) });
        }
      });

    return () => controller.abort();
  }, [albumArtist, albumName]);

  useEffect(() => {
    if (!hasHydrated) return;

    const controller = new AbortController();

    setTrackError(null);
    getTrackImage(
      { artist: trackArtist, album: trackAlbum, track },
      controller.signal,
    )
      .then(setTrackImage)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setTrackError(getErrorMessage(error));
        }
      });

    return () => controller.abort();
  }, [trackArtist, trackAlbum, track, hasHydrated, setTrackImage]);

  const persistedTrack =
    trackImage?.artist === trackArtist &&
    trackImage.album === trackAlbum &&
    trackImage.track === track
      ? trackImage
      : null;

  return {
    health,
    album,
    track: { data: persistedTrack, error: trackError },
  };
}
