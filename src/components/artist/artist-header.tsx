import { Artwork } from "@/components/dashboard/artwork";
import { External, Icon } from "@/components/glaze/icon";
import { Card, CardContent } from "@/components/glaze/ui/card";
import { separarLista } from "@/lib/artist";
import type { ArtistProfile } from "@/types";

/** Cabeçalho da página do artista: foto, nome, tags, links externos e biografia curta. */
export function ArtistHeader({ profile }: { profile: ArtistProfile }) {
  const tags = separarLista(profile.tags);
  const links = [
    { href: profile.url_lastfm, label: "Last.fm" },
    { href: profile.url_wikipedia, label: "Wikipedia" },
    { href: profile.url_musicbrainz, label: "MusicBrainz" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );

  return (
    <Card>
      <CardContent className="gap-4">
        <div className="flex items-start gap-4">
          <Artwork
            name={profile.name}
            src={profile.image_url}
            shape="circle"
            size="xl"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h1 className="min-w-0 type-heading text-text-1 [overflow-wrap:anywhere]">
              {profile.name}
            </h1>
            {tags.length ? (
              <ul className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-pill border border-line-faint px-2 type-caption text-text-2"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            {links.length ? (
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 type-label text-text-1 underline-offset-2 hover:underline"
                    >
                      {link.label}
                      <Icon icon={External} size={12} />
                      <span className="sr-only">
                        {" "}
                        (abre num separador novo)
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        {profile.bio_summary ? (
          <p className="type-body whitespace-pre-line text-text-2">
            {profile.bio_summary}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
