import type { ApiResult, Scrobble } from "@/types";
import { getJson } from "./http";

/**
 * Endpoint do histórico de reproduções.
 * Quando o histórico completo estiver disponível, trocar para "/scrobbles".
 */
export const SCROBBLES_ENDPOINT = "/scrobbles/amostra";

export function getScrobbles(
  signal?: AbortSignal,
): Promise<ApiResult<Scrobble[]>> {
  return getJson<Scrobble[]>(SCROBBLES_ENDPOINT, undefined, signal);
}
