/**
 * Filtros e normalização de texto.
 * As funções de filtragem por período entram na etapa seguinte.
 */

/** Chave estável para comparações e caches: sem espaços nas pontas e em minúsculas. */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}
