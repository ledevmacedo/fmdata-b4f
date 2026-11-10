/**
 * Construção das entradas da store a partir do resultado de um pedido.
 */

import type { ApiResult, Entry } from "@/types";

/** Entrada vazia: ainda sem pedido. */
export function emptyEntry<T>(): Entry<T> {
  return { data: null, status: "idle", error: null, updatedAt: null };
}

/** Mantém os dados antigos visíveis enquanto o pedido corre. */
export function loadingEntry<T>(previous: Entry<T> | undefined): Entry<T> {
  return {
    data: previous?.data ?? null,
    status: "loading",
    error: null,
    updatedAt: previous?.updatedAt ?? null,
  };
}

/** Converte o resultado do pedido na entrada guardada na store. */
export function entryFromResult<T>(
  result: ApiResult<T>,
  previous: Entry<T> | undefined,
): Entry<T> {
  if (result.ok) {
    return {
      data: result.data,
      status: "success",
      error: null,
      updatedAt: Date.now(),
    };
  }

  return {
    data: previous?.data ?? null,
    status: result.status === 404 ? "not-found" : "error",
    error: result.status === 404 ? null : result.message,
    updatedAt: previous?.updatedAt ?? null,
  };
}
