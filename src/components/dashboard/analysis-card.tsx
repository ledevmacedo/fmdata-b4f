import { SectionCard } from "@/components/dashboard/section-card";
import { CardContent } from "@/components/glaze/ui/card";
import type { ArtistaEsquecido } from "@/lib/analise";
import { formatDia, formatScrobbles } from "@/lib/format";

/** Análise única: o artista que ouvia mais cedo no histórico e depois se calou. */
export function AnalysisCard({
  esquecido,
}: {
  esquecido: ArtistaEsquecido | null;
}) {
  return (
    <SectionCard title="Quem deixaste de ouvir?">
      <CardContent className="gap-1">
        {esquecido ? (
          <>
            <p className="type-title text-text-1">{esquecido.artista}</p>
            <p className="type-body text-text-2">
              {formatScrobbles(esquecido.antes)} na primeira metade do
              histórico,{" "}
              {esquecido.depois === 0
                ? "nenhuma na segunda"
                : `${formatScrobbles(esquecido.depois)} na segunda`}
              .
            </p>
            <p className="type-caption text-text-3">
              Última reprodução a {formatDia(esquecido.ultimaVez)}, há{" "}
              {esquecido.diasSem} dias.
            </p>
          </>
        ) : (
          <p className="type-body text-text-2">
            Continuas a ouvir todos os artistas do histórico.
          </p>
        )}
      </CardContent>
    </SectionCard>
  );
}
