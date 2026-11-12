import Link from "next/link";
import { Artwork } from "@/components/dashboard/artwork";
import { SectionCard } from "@/components/dashboard/section-card";
import { CardContent } from "@/components/glaze/ui/card";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/glaze/ui/item";
import type { SimilarArtist } from "@/types";

/** Artistas semelhantes: só os que já foram ouvidos levam link e aspeto de linha ativa. */
export function SimilarArtistsCard({
  artistas,
}: {
  artistas: SimilarArtist[];
}) {
  return (
    <SectionCard
      title="Artistas semelhantes"
      description="Os que já ouviste abrem a página"
    >
      <CardContent flush>
        {artistas.length === 0 ? (
          <p className="p-3 type-body text-text-2">
            A API não devolveu artistas semelhantes.
          </p>
        ) : (
          <ItemGroup variant="plain" aria-label="Artistas semelhantes">
            {artistas.map((artista) => (
              <Item key={artista.name}>
                <ItemMedia>
                  <Artwork name={artista.name} shape="circle" />
                </ItemMedia>
                <ItemContent>
                  <div
                    className={
                      artista.listened
                        ? "min-w-0 truncate type-heading-sm text-text-1"
                        : "min-w-0 truncate type-heading-sm text-text-3"
                    }
                  >
                    {artista.listened ? (
                      <Link
                        href={`/artistas/${encodeURIComponent(artista.name)}`}
                        data-slot="item-link"
                        data-control=""
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {artista.name}
                      </Link>
                    ) : (
                      artista.name
                    )}
                  </div>
                  {artista.listened ? null : (
                    <p className="type-caption text-text-3">Ainda não ouvido</p>
                  )}
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </SectionCard>
  );
}
