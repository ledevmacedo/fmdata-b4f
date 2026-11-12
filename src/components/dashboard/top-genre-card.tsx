import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { SectionCard } from "@/components/dashboard/section-card";
import { CardContent } from "@/components/glaze/ui/card";
import { formatNumber, formatScrobbles } from "@/lib/format";

/** Etiqueta mais frequente, com a fatia das reproduções do período que a têm. */
export function TopGenreCard({
  genero,
  total,
  filter,
}: {
  genero: { genero: string; contagem: number } | null;
  /** Reproduções do período; o total all-time do perfil não serve aqui. */
  total: number;
  filter?: FiltroDePeriodo;
}) {
  const taxa =
    genero && total ? Math.round((genero.contagem / total) * 100) : 0;

  return (
    <SectionCard
      title="Género mais ouvido"
      description="Etiquetas das reproduções"
      filter={filter}
    >
      <CardContent className="flex-1 items-center justify-center">
        {genero ? (
          <>
            <p className="text-center type-heading text-text-1">
              {genero.genero}
            </p>
            <p className="type-body-sm text-text-2">
              {formatScrobbles(genero.contagem)} · {formatNumber(taxa)}% das
              reproduções
            </p>
          </>
        ) : (
          <p className="type-body text-text-2">Sem etiquetas neste período.</p>
        )}
      </CardContent>
    </SectionCard>
  );
}
