import type { ApiResult, HourCount } from "@/types";
import { getJson } from "./http";

export function getListeningClock(
  signal?: AbortSignal,
): Promise<ApiResult<HourCount[]>> {
  return getJson<HourCount[]>("/stats/listening-clock", undefined, signal);
}
