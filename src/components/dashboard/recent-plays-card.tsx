import { Artwork } from "@/components/dashboard/artwork";
import { SectionCard } from "@/components/dashboard/section-card";
import { Icon, Play } from "@/components/glaze/icon";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/glaze/ui/item";
import { formatDia } from "@/lib/format";
import type { Scrobble } from "@/types";

/**
 * As reproduções mais recentes. Quando a API devolve a reprodução em curso,
 * ela abre a secção num bloco próprio, com o estado "a ouvir agora".
 */
export function RecentPlaysCard({
  nowPlaying,
  rows,
}: {
  nowPlaying: Scrobble | null;
  rows: Scrobble[];
}) {
  return (
    <SectionCard title="Reproduções recentes" description="Últimas 10">
      {nowPlaying ? (
        <div className="-mx-3 flex items-center gap-4 border-y border-line-faint bg-field px-3 py-4">
          <Artwork
            name={nowPlaying.track_name}
            src={nowPlaying.image_url}
            size="lg"
          />
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 type-caption text-text-2">
              <Icon icon={Play} size={12} weight="fill" />A ouvir agora
            </span>
            <p className="mt-1 min-w-0 truncate type-heading-sm text-text-1">
              {nowPlaying.track_name}
            </p>
            <p className="min-w-0 truncate type-caption text-text-2">
              {nowPlaying.artist_name}
              {nowPlaying.album_name ? ` · ${nowPlaying.album_name}` : ""}
            </p>
          </div>
        </div>
      ) : null}

      {rows.length ? (
        <ItemGroup
          variant="plain"
          aria-label="Reproduções recentes"
          className="-mx-3 border-b border-line-faint"
        >
          {rows.map((row, index) => (
            <Item
              key={`${row.artist_name}-${row.track_name}-${row.date_uts ?? index}`}
            >
              <ItemMedia>
                <Artwork name={row.track_name} src={row.image_url} />
              </ItemMedia>
              <ItemContent>
                <div className="min-w-0 truncate type-heading-sm text-text-1">
                  {row.track_name}
                </div>
                <p className="min-w-0 truncate type-body text-text-2">
                  {row.artist_name}
                  {row.album_name ? ` · ${row.album_name}` : ""}
                </p>
              </ItemContent>
              <span className="shrink-0 type-caption text-text-3 tabular-nums">
                {row.date_uts ? formatDia(row.date_uts) : "—"}
              </span>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <p className="py-4 type-body text-text-2">
          Sem reproduções no histórico.
        </p>
      )}
    </SectionCard>
  );
}
