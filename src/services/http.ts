/**
 * Base dos pedidos HTTP.
 * Só este ficheiro conhece o URL da API, a query dinâmica e o formato dos erros.
 */

import type { ApiErrorResponse, ApiFailure, ApiResult } from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fmdata-api.onrender.com";

/** Parâmetros de query; valores nulos, indefinidos ou vazios são ignorados. */
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Cria um resultado de falha sem repetir a forma do objeto. */
export function failure(
  status: number,
  code: ApiFailure["code"],
  message: string,
): ApiResult<never> {
  return { ok: false, status, code, message };
}

/** Falha local: nem chega a fazer pedido quando um parâmetro obrigatório está vazio. */
export function missingParameter(field: string): ApiResult<never> {
  return failure(
    400,
    "missing_parameter",
    `O parâmetro "${field}" é obrigatório.`,
  );
}

/** Constrói o URL final, codificando os parâmetros com URLSearchParams. */
export function buildUrl(path: string, params?: QueryParams): URL {
  const url = new URL(path, API_URL);
  if (!params) return url;

  for (const [field, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(field, String(value));
  }

  return url;
}

async function readErrorBody(
  response: Response,
): Promise<ApiErrorResponse | null> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return null;
  }
}

/** Executa um GET e devolve sempre um ApiResult. */
export async function getJson<T>(
  path: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<ApiResult<T>> {
  const url = buildUrl(path, params);

  let response: Response;

  try {
    response = await fetch(url, {
      signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return failure(0, null, "Pedido cancelado.");
    }
    return failure(
      0,
      null,
      "Não foi possível contactar a API. Tenta novamente.",
    );
  }

  if (!response.ok) {
    const body = await readErrorBody(response);
    return failure(
      response.status,
      body?.error.code ?? null,
      body?.error.message ?? `A API respondeu com o estado ${response.status}.`,
    );
  }

  try {
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return failure(
      response.status,
      null,
      "A API devolveu uma resposta que não é JSON válido.",
    );
  }
}
