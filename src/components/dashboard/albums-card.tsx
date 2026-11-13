import Image from "next/image";
import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { SectionCard } from "@/components/dashboard/section-card";
import { CardContent } from "@/components/glaze/ui/card";
import { formatScrobbles } from "@/lib/format";
import { isGif } from "@/lib/images";
import type { RankingItem } from "@/types";

/** Grelha de álbuns: quadrados colados, arte como fundo, com artista, álbum e total. */
export function AlbumsCard({
  id,
  items,
  filter,
}: {
  id?: string;
  items: RankingItem[];
  filter?: FiltroDePeriodo;
}) {
  return (
    <SectionCard
      id={id}
      title="Álbuns mais ouvidos"
      description="Top 8"
      filter={filter}
    >
      <CardContent flush>
        {items.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {items.map((item) => (
              <article
                key={item.key}
                className="group relative aspect-square overflow-hidden bg-field"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    unoptimized={isGif(item.image)}
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-scrim transition-opacity duration-500 ease-out group-hover:opacity-0" />
                <div className="absolute inset-0 flex flex-col justify-end gap-1 p-2">
                  <p className="truncate type-body-sm text-text-inverse">
                    {item.subtitle}
                  </p>
                  <p className="line-clamp-2 type-label text-text-inverse">
                    {item.name}
                  </p>
                  <p className="type-caption text-text-inverse">
                    {formatScrobbles(item.count)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-4 type-body text-text-2">
            Sem reproduções neste período.
          </p>
        )}
      </CardContent>
    </SectionCard>
  );
}
