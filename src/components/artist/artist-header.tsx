import Image from "next/image";
import { initials } from "@/components/dashboard/artwork";
import { External, Icon } from "@/components/glaze/icon";
import { Reveal } from "@/components/motion/reveal";
import { separarLista } from "@/lib/artist";
import { isGif } from "@/lib/images";
import type { ArtistProfile } from "@/types";

/** Abertura da página do artista: nome em escala editorial e retrato em prato cheio. */
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
    <Reveal
      as="section"
      className="grid gap-8 border-b border-line-faint pb-10 pt-6 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-14 lg:pt-10"
    >
      <div className="order-2 flex min-w-0 flex-col gap-6 lg:order-1 lg:col-span-7">
        <div className="flex flex-col gap-4">
          <h1 className="type-display text-text-1 [overflow-wrap:anywhere]">
            {profile.name}
          </h1>
          {tags.length ? (
            <ul className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill border border-line-faint px-2.5 py-0.5 type-caption text-text-2"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {profile.bio_summary ? (
          <p className="max-w-measure type-body whitespace-pre-line text-text-2">
            {profile.bio_summary}
          </p>
        ) : null}

        {links.length ? (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
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
                  <span className="sr-only"> (abre num separador novo)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="order-1 min-w-0 lg:order-2 lg:col-span-5">
        <div className="relative aspect-square overflow-hidden rounded-shell border border-line-faint bg-field">
          {profile.image_url ? (
            <Image
              src={profile.image_url}
              alt={`Retrato de ${profile.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 32vw, 100vw"
              unoptimized={isGif(profile.image_url)}
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="type-display text-text-3">
                {initials(profile.name)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
