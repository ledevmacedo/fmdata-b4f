import { Card, CardContent } from "@/components/glaze/ui/card";
import { formatData, formatNumber } from "@/lib/format";
import type { ArtistPosition, ArtistSummary } from "@/types";

const percentFormat = new Intl.NumberFormat("pt-PT", {
  maximumFractionDigits: 1,
});

const uts = (date: Date | null) =>
  date ? formatData(date.getTime() / 1000) : "—";

/** Números all-time do artista num só cartão. */
export function ArtistStats({
  resumo,
  posicao,
}: {
  resumo: ArtistSummary;
  /** Posição no ranking all-time por reproduções; null quando o artista não tem reproduções. */
  posicao: ArtistPosition | null;
}) {
  const itens = [
    { label: "Scrobbles", value: formatNumber(resumo.totalScrobbles) },
    {
      label: "Posição no histórico",
      value: posicao
        ? `#${formatNumber(posicao.position)} de ${formatNumber(posicao.totalArtists)}`
        : "—",
    },
    {
      label: "Do histórico",
      value: `${percentFormat.format(resumo.percentOfTotal)}%`,
    },
    { label: "Faixas favoritas", value: formatNumber(resumo.favouriteTracks) },
    { label: "Primeira reprodução", value: uts(resumo.firstPlayed) },
    { label: "Última reprodução", value: uts(resumo.lastPlayed) },
  ];

  return (
    <Card>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {itens.map((item) => (
            <div key={item.label}>
              <dt className="type-caption text-text-2">{item.label}</dt>
              <dd className="type-heading-sm text-text-1 tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
