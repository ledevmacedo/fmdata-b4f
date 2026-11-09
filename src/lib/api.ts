export interface HealthResponse {
  status: "ok";
}

export interface AlbumImageResponse {
  album: string;
  artist: string;
  image_url: string;
}

export interface AlbumImageParams {
  artist: string;
  album: string;
}

export interface TrackImage {
  size: string;
  url: string;
}

export interface TrackImageResponse {
  album: string;
  artist: string;
  track: string;
  images: TrackImage[];
}

export interface TrackImageParams {
  artist: string;
  album: string;
  track: string;
}

function isHealthResponse(data: unknown): data is HealthResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "status" in data &&
    data.status === "ok"
  );
}

export function isAlbumImageResponse(
  data: unknown,
): data is AlbumImageResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "album" in data &&
    typeof data.album === "string" &&
    "artist" in data &&
    typeof data.artist === "string" &&
    "image_url" in data &&
    typeof data.image_url === "string"
  );
}

function isTrackImage(data: unknown): data is TrackImage {
  return (
    typeof data === "object" &&
    data !== null &&
    "size" in data &&
    typeof data.size === "string" &&
    "url" in data &&
    typeof data.url === "string"
  );
}

export function isTrackImageResponse(
  data: unknown,
): data is TrackImageResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "album" in data &&
    typeof data.album === "string" &&
    "artist" in data &&
    typeof data.artist === "string" &&
    "track" in data &&
    typeof data.track === "string" &&
    "images" in data &&
    Array.isArray(data.images) &&
    data.images.every(isTrackImage)
  );
}

async function fetchApi(
  path: string,
  signal: AbortSignal,
  params?: URLSearchParams,
): Promise<unknown> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("A variável NEXT_PUBLIC_API_URL não está configurada.");
  }

  const url = new URL(path, `${apiUrl.replace(/\/+$/, "")}/`);
  if (params) url.search = params.toString();

  const response = await fetch(url, { signal, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`A API respondeu com o erro ${response.status}.`);
  }

  return response.json();
}

export async function getHealth(signal: AbortSignal) {
  const data = await fetchApi("health", signal);
  if (!isHealthResponse(data)) {
    throw new Error("A API devolveu uma resposta de estado inválida.");
  }

  return data;
}

export async function getAlbumImage(
  album: AlbumImageParams,
  signal: AbortSignal,
) {
  const params = new URLSearchParams({
    artist: album.artist,
    album: album.album,
  });
  const data = await fetchApi("album-image", signal, params);

  if (!isAlbumImageResponse(data)) {
    throw new Error("A API devolveu uma resposta de álbum inválida.");
  }

  return data;
}

export async function getTrackImage(
  track: TrackImageParams,
  signal: AbortSignal,
) {
  const params = new URLSearchParams({
    artist: track.artist,
    album: track.album,
    track: track.track,
  });
  const data = await fetchApi("track-image", signal, params);

  if (!isTrackImageResponse(data)) {
    throw new Error("A API devolveu uma resposta de faixa inválida.");
  }

  return data;
}
