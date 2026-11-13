import Link from "next/link";
import type { CSSProperties } from "react";
import { Artwork } from "@/components/dashboard/artwork";
import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/glaze/ui/item";
import { formatScrobbles } from "@/lib/format";
import type { RankingItem } from "@/types";

interface RankingCardProps {
  title: string;
  description?: string;
  items: RankingItem[];
  /** Mostra a posição no ranking à esquerda do avatar. */
  ranked?: boolean;
  /** Redondo para pessoas (artistas), quadrado para capas de músicas. */
  shape?: "circle" | "square";
  /** Período local do cartão; a página do artista, sempre all-time, não o tem. */
  filter?: FiltroDePeriodo;
}

/** Lista de artistas, músicas ou álbuns, com miniatura, nome, artista e barra de proporção. */
export function RankingCard({
  title,
  description,
  items,
  ranked = false,
  shape = "square",
  filter,
}: RankingCardProps) {
  // A barra mede cada linha contra o total das linhas da tabela; o total não é mostrado.
  const max = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <SectionCard title={title} description={description} filter={filter}>
      {items.length ? (
        <ItemGroup
          variant="plain"
          aria-label={title}
          className="-mx-3 border-b border-line-faint"
        >
          {items.map((item, index) => {
            const pct = max ? (item.count / max) * 100 : 0;

            return (
              <Item key={item.key}>
                <ItemMedia className={ranked ? "gap-3" : undefined}>
                  {ranked ? (
                    <span className="w-5 shrink-0 type-caption text-text-3 tabular-nums">
                      {index + 1}
                    </span>
                  ) : null}
                  <Artwork name={item.name} src={item.image} shape={shape} />
                </ItemMedia>
                <ItemContent>
                  <div className="min-w-0 truncate type-heading-sm text-text-1">
                    {item.href ? (
                      <Link
                        href={item.href}
                        data-slot="item-link"
                        data-control=""
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </div>
                  {item.subtitle ? (
                    <p className="min-w-0 truncate type-body text-text-2">
                      {item.subtitle}
                    </p>
                  ) : null}
                </ItemContent>
                <div className="flex w-28 shrink-0 flex-col items-end gap-1.5 sm:w-36">
                  <span className="type-caption text-text-2 tabular-nums">
                    {formatScrobbles(item.count)}
                  </span>
                  <span
                    aria-hidden
                    className="h-0.5 w-full overflow-hidden bg-field"
                  >
                    <span
                      key={`${item.key}-${item.count}`}
                      className="bar-grow block h-full bg-ink/70"
                      style={{ "--bar": `${pct}%` } as CSSProperties}
                    />
                  </span>
                </div>
              </Item>
            );
          })}
        </ItemGroup>
      ) : (
        <p className="py-4 type-body text-text-2">
          Sem reproduções neste período.
        </p>
      )}
    </SectionCard>
  );
}
