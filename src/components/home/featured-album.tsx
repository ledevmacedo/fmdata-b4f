import Image from "next/image";
import type { AlbumImageResponse } from "@/lib/api";

export function FeaturedAlbum({
  album,
}: {
  album: { data: AlbumImageResponse | null; error: string | null };
}) {
  return (
    <section
      aria-labelledby="album-heading"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:flex"
    >
      {album.data ? (
        <Image
          src={album.data.image_url}
          alt={`Capa do álbum ${album.data.album}, de ${album.data.artist}`}
          width={300}
          height={300}
          className="aspect-square w-full object-cover sm:w-64"
        />
      ) : null}
      <div className="flex min-h-56 flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
          Em destaque
        </p>
        <h2 id="album-heading" className="mt-2 text-2xl font-bold">
          {album.data?.album ?? "Álbum"}
        </h2>
        {album.data ? (
          <>
            <p className="mt-1 text-slate-300">{album.data.artist}</p>
            {album.error ? (
              <p role="alert" className="mt-3 text-rose-300">
                Não foi possível atualizar o álbum: {album.error}
              </p>
            ) : null}
          </>
        ) : album.error ? (
          <p role="alert" className="mt-3 text-rose-300">
            Não foi possível carregar o álbum: {album.error}
          </p>
        ) : (
          <output className="mt-3 block text-slate-400">
            A carregar o álbum…
          </output>
        )}
      </div>
    </section>
  );
}
