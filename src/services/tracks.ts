import type { ApiResult, TrackImageResponse } from "@/types";
import { getJson, missingParameter } from "./http";

export async function getTrackImage(
  artist: string,
  album: string,
  track: string,
  signal?: AbortSignal,
): Promise<ApiResult<TrackImageResponse>> {
  const artistName = artist.trim();
  const albumName = album.trim();
  const trackName = track.trim();
  if (!artistName) return missingParameter("artist");
  if (!albumName) return missingParameter("album");
  if (!trackName) return missingParameter("track");

  return getJson<TrackImageResponse>(
    "/track-image",
    { artist: artistName, album: albumName, track: trackName },
    signal,
  );
}
