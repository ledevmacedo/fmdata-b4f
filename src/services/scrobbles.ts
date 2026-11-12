import type { ApiResult, Scrobble } from "@/types";
import { getJson } from "./http";

/** Endpoint do histórico completo de reproduções. */
export const SCROBBLES_ENDPOINT = "/scrobbles";

export function getScrobbles(
  signal?: AbortSignal,
): Promise<ApiResult<Scrobble[]>> {
  return getJson<Scrobble[]>(SCROBBLES_ENDPOINT, undefined, signal);
}
