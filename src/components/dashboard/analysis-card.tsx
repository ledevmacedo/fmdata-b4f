import { SectionCard } from "@/components/dashboard/section-card";
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
      {esquecido ? (
        <div className="flex flex-col gap-5">
          <p className="type-display-sm text-text-1">{esquecido.artista}</p>
          <p className="max-w-measure type-body text-text-2">
            {formatScrobbles(esquecido.antes)} na primeira metade do histórico,{" "}
            {esquecido.depois === 0
              ? "nenhuma na segunda"
              : `${formatScrobbles(esquecido.depois)} na segunda`}
            .
          </p>
          <p className="border-t border-line-faint pt-3 type-caption text-text-3">
            Última reprodução a {formatDia(esquecido.ultimaVez)}, há{" "}
            {esquecido.diasSem} dias.
          </p>
        </div>
      ) : (
        <p className="py-4 type-body text-text-2">
          Continuas a ouvir todos os artistas do histórico.
        </p>
      )}
    </SectionCard>
  );
}
