/** GIF animado: o Next já o serve como veio, mas `unoptimized` garante que a animação nunca se perde. */
export function isGif(src?: string | null): boolean {
  return Boolean(src && /\.gif(?:[?#]|$)/i.test(src));
}
