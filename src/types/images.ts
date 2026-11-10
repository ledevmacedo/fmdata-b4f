/**
 * Contratos dos endpoints de imagem.
 */

/** Tamanhos de imagem documentados pela API. */
export type ImageSize = "extralarge" | "large" | "medium" | "small";

/** Imagem num tamanho específico. */
export interface SizedImage {
  size: ImageSize;
  url: string;
}

/** Resposta de /artist-image. */
export interface ArtistImageResponse {
  artist: string;
  image_url: string;
}

/** Resposta de /album-image. */
export interface AlbumImageResponse {
  artist: string;
  album: string;
  image_url: string;
}

/** Resposta de /track-image. */
export interface TrackImageResponse {
  artist: string;
  album: string;
  track: string;
  images: SizedImage[];
}
