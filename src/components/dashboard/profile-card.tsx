import Image from "next/image";
import { Card, CardContent } from "@/components/glaze/ui/card";
import type { DashboardSummary } from "@/lib/dashboard";
import { formatNumber, formatScrobbles } from "@/lib/format";
import { isGif } from "@/lib/images";

/** Cabeçalho do dashboard: capa do artista mais ouvido, totais e a música mais ouvida de sempre. */
export function ProfileCard({ profile }: { profile: DashboardSummary }) {
  const { cover, topTrack, totalScrobbles, uniqueArtists } = profile;

  return (
    <Card>
      <CardContent flush>
        <div>
          <div className="relative h-40">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                unoptimized={isGif(cover)}
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-ink/60" />

            {topTrack ? (
              <div className="absolute inset-x-3 top-3 flex items-center justify-end gap-3">
                {topTrack.image ? (
                  <Image
                    src={topTrack.image}
                    alt=""
                    width={56}
                    height={56}
                    unoptimized={isGif(topTrack.image)}
                    className="size-14 shrink-0 rounded-tag object-cover"
                  />
                ) : null}
                <div className="min-w-0 text-end">
                  <p className="type-caption text-text-inverse">
                    Música mais ouvida de sempre
                  </p>
                  <p className="truncate type-label text-text-inverse">
                    {topTrack.name}
                  </p>
                  <p className="truncate type-caption text-text-inverse">
                    {topTrack.subtitle} · {formatScrobbles(topTrack.count)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <p className="min-w-0 type-heading text-text-1">
              Histórico de reproduções
            </p>
            <dl className="flex shrink-0 gap-8">
              <div>
                <dt className="type-caption text-text-2">Scrobbles</dt>
                <dd className="type-title text-text-1 tabular-nums">
                  {formatNumber(totalScrobbles)}
                </dd>
              </div>
              <div>
                <dt className="type-caption text-text-2">Artistas únicos</dt>
                <dd className="type-title text-text-1 tabular-nums">
                  {formatNumber(uniqueArtists)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
