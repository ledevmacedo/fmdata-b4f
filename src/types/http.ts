/**
 * Contratos genéricos de HTTP.
 * Todos os pedidos devolvem um destes três tipos; nunca lançam exceções.
 */

/** Códigos de erro documentados pela API. */
export type ApiErrorCode = "missing_parameter" | "not_found";

/** Pedido concluído com sucesso. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

/** Pedido falhado: erro da API, parâmetro em falta ou falha de rede. */
export interface ApiFailure {
  ok: false;
  /** Estado HTTP; 0 identifica falha de rede ou pedido cancelado. */
  status: number;
  /** Código devolvido pela API, ou null quando não existe corpo de erro. */
  code: ApiErrorCode | null;
  message: string;
}

/** Resultado de qualquer pedido à API. */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Detalhe de um erro devolvido pela API. */
export interface ApiErrorDetail {
  code: ApiErrorCode;
  message: string;
}

/** Corpo JSON de uma resposta de erro (400 ou 404). */
export interface ApiErrorResponse {
  error: ApiErrorDetail;
}
