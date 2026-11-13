import type { CSSProperties } from "react";
import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { SectionCard } from "@/components/dashboard/section-card";
import { formatNumber, formatScrobbles } from "@/lib/format";

/** Etiqueta mais frequente, com a fatia das reproduções do período que a têm. */
export function TopGenreCard({
  id,
  genero,
  total,
  filter,
}: {
  id?: string;
  genero: { genero: string; contagem: number } | null;
  /** Reproduções do período; o total all-time do perfil não serve aqui. */
  total: number;
  filter?: FiltroDePeriodo;
}) {
  const taxa =
    genero && total ? Math.round((genero.contagem / total) * 100) : 0;

  return (
    <SectionCard
      id={id}
      title="Género mais ouvido"
      description="Etiquetas das reproduções"
      filter={filter}
    >
      {genero ? (
        <div className="flex flex-col gap-6">
          <p className="type-display-sm text-text-1">{genero.genero}</p>

          <div className="flex items-end justify-between gap-4 border-t border-line-faint pt-3">
            <div className="min-w-0">
              <p className="type-caption text-text-2">
                Reproduções com esta etiqueta
              </p>
              <p className="type-body text-text-1">
                {formatScrobbles(genero.contagem)}
              </p>
            </div>
            <p className="type-figure shrink-0 text-text-1">
              {formatNumber(taxa)}%
            </p>
          </div>

          <div aria-hidden className="h-0.5 w-full overflow-hidden bg-field">
            <span
              className="bar-grow block h-full bg-ink/70"
              style={{ "--bar": `${taxa}%` } as CSSProperties}
            />
          </div>
        </div>
      ) : (
        <p className="py-4 type-body text-text-2">
          Sem etiquetas neste período.
        </p>
      )}
    </SectionCard>
  );
}
