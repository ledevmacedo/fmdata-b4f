import { Artwork } from "@/components/dashboard/artwork";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/glaze/ui/item";
import { formatDia } from "@/lib/format";
import type { Scrobble } from "@/types";

/** Últimas reproduções do artista, com a data à direita e a reprodução em curso sem data. */
export function AuditionsCard({ rows }: { rows: Scrobble[] }) {
  return (
    <SectionCard title="Últimas reproduções" description="Até 10">
      {rows.length === 0 ? (
        <p className="py-4 type-body text-text-2">
          Sem reproduções deste artista no histórico.
        </p>
      ) : (
        <ItemGroup
          variant="plain"
          aria-label="Últimas reproduções"
          className="-mx-3 border-b border-line-faint"
        >
          {rows.map((row, index) => (
            <Item key={`${row.track_name}-${row.date_uts ?? "agora"}-${index}`}>
              <ItemMedia>
                <Artwork name={row.track_name} src={row.image_url} size="sm" />
              </ItemMedia>
              <ItemContent>
                <div className="min-w-0 truncate type-label-lg text-text-1">
                  {row.track_name}
                </div>
                {row.album_name ? (
                  <p className="min-w-0 truncate type-body-sm text-text-2">
                    {row.album_name}
                  </p>
                ) : null}
              </ItemContent>
              <span className="shrink-0 type-caption text-text-3 tabular-nums">
                {row.date_uts ? formatDia(row.date_uts) : "a ouvir agora"}
              </span>
            </Item>
          ))}
        </ItemGroup>
      )}
    </SectionCard>
  );
}
