import Image from "next/image";
import type { TrackImageResponse } from "@/lib/api";

export function FeaturedTrack({
  track,
}: {
  track: { data: TrackImageResponse | null; error: string | null };
}) {
  const image = track.data?.images[0];

  return (
    <section
      aria-labelledby="track-heading"
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:flex"
    >
      {image ? (
        <Image
          src={image.url}
          alt={`Capa da faixa ${track.data?.track}, de ${track.data?.artist}`}
          width={300}
          height={300}
          className="aspect-square w-full object-cover sm:w-64"
        />
      ) : null}
      <div className="flex min-h-56 flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
          Faixa guardada
        </p>
        <h2 id="track-heading" className="mt-2 text-2xl font-bold">
          {track.data?.track ?? "Faixa"}
        </h2>
        {track.data ? (
          <>
            <p className="mt-1 text-slate-300">
              {track.data.artist} · {track.data.album}
            </p>
            {track.error ? (
              <p role="alert" className="mt-3 text-rose-300">
                Não foi possível atualizar a faixa: {track.error}
              </p>
            ) : null}
          </>
        ) : track.error ? (
          <p role="alert" className="mt-3 text-rose-300">
            Não foi possível carregar a faixa: {track.error}
          </p>
        ) : (
          <output className="mt-3 block text-slate-400">
            A carregar a faixa…
          </output>
        )}
      </div>
    </section>
  );
}
