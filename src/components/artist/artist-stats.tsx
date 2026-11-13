import { Reveal } from "@/components/motion/reveal";
import { formatData, formatNumber } from "@/lib/format";
import type { ArtistPosition, ArtistSummary } from "@/types";

const percentFormat = new Intl.NumberFormat("pt-PT", {
  maximumFractionDigits: 1,
});

const uts = (date: Date | null) =>
  date ? formatData(date.getTime() / 1000) : "—";

/** Números all-time do artista numa banda de figuras, sem caixa à volta. */
export function ArtistStats({
  resumo,
  posicao,
}: {
  resumo: ArtistSummary;
  /** Posição no ranking all-time por reproduções; null quando o artista não tem reproduções. */
  posicao: ArtistPosition | null;
}) {
  const itens = [
    {
      label: "Scrobbles",
      value: formatNumber(resumo.totalScrobbles),
      lead: true,
    },
    {
      label: "Posição no histórico",
      value: posicao
        ? `#${formatNumber(posicao.position)} de ${formatNumber(posicao.totalArtists)}`
        : "—",
      lead: false,
    },
    {
      label: "Do histórico",
      value: `${percentFormat.format(resumo.percentOfTotal)}%`,
      lead: false,
    },
    {
      label: "Faixas favoritas",
      value: formatNumber(resumo.favouriteTracks),
      lead: false,
    },
    {
      label: "Primeira reprodução",
      value: uts(resumo.firstPlayed),
      lead: false,
    },
    {
      label: "Última reprodução",
      value: uts(resumo.lastPlayed),
      lead: false,
    },
  ];

  return (
    <Reveal
      as="dl"
      className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6"
    >
      {itens.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="type-caption text-text-2">{item.label}</dt>
          <dd
            className={
              item.lead
                ? "type-title text-text-1 tabular-nums"
                : "type-heading-sm text-text-1 tabular-nums"
            }
          >
            {item.value}
          </dd>
        </div>
      ))}
    </Reveal>
  );
}
