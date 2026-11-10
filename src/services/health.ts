import type { ApiResult, HealthResponse } from "@/types";
import { getJson } from "./http";

export function checkHealth(
  signal?: AbortSignal,
): Promise<ApiResult<HealthResponse>> {
  return getJson<HealthResponse>("/health", undefined, signal);
}
