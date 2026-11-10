import type { ApiResult, ArtistImageResponse, ArtistProfile } from "@/types";
import { getJson, missingParameter } from "./http";

export async function getArtistInfo(
  artist: string,
  signal?: AbortSignal,
): Promise<ApiResult<ArtistProfile>> {
  const name = artist.trim();
  if (!name) return missingParameter("artist");

  return getJson<ArtistProfile>("/artist-info", { artist: name }, signal);
}

export async function getArtistImage(
  artist: string,
  signal?: AbortSignal,
): Promise<ApiResult<ArtistImageResponse>> {
  const name = artist.trim();
  if (!name) return missingParameter("artist");

  return getJson<ArtistImageResponse>(
    "/artist-image",
    { artist: name },
    signal,
  );
}
