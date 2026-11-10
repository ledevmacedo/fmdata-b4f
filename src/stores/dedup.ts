/**
 * Deduplicação de pedidos.
 * Duas chamadas com a mesma chave enquanto o primeiro pedido corre devolvem a mesma promessa.
 */

const inFlight = new Map<string, Promise<void>>();

export function dedupe(key: string, run: () => Promise<void>): Promise<void> {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      await run();
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  return request;
}
