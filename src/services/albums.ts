import type { AlbumImageResponse, AlbumProfile, ApiResult } from "@/types";
import { getJson, missingParameter } from "./http";

export async function getAlbumInfo(
  artist: string,
  album: string,
  signal?: AbortSignal,
): Promise<ApiResult<AlbumProfile>> {
  const artistName = artist.trim();
  const albumName = album.trim();
  if (!artistName) return missingParameter("artist");
  if (!albumName) return missingParameter("album");

  return getJson<AlbumProfile>(
    "/album-info",
    { artist: artistName, album: albumName },
    signal,
  );
}

export async function getAlbumImage(
  artist: string,
  album: string,
  signal?: AbortSignal,
): Promise<ApiResult<AlbumImageResponse>> {
  const artistName = artist.trim();
  const albumName = album.trim();
  if (!artistName) return missingParameter("artist");
  if (!albumName) return missingParameter("album");

  return getJson<AlbumImageResponse>(
    "/album-image",
    { artist: artistName, album: albumName },
    signal,
  );
}
