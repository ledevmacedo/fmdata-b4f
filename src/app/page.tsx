"use client";

import { FeaturedAlbum } from "@/components/home/featured-album";
import { FeaturedTrack } from "@/components/home/featured-track";
import { useHomeData } from "@/hooks/useHomeData";

export default function Home() {
  const { health, album, track } = useHomeData(
    { artist: "Adele", album: "21" },
    { artist: "Adele", album: "25", track: "Hello" },
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="w-full max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
            FMData
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Estado da API e música em destaque
          </h1>
          <p className="max-w-2xl text-slate-400">
            Capas carregadas diretamente da API FMData.
          </p>
        </header>
        <section
          aria-labelledby="health-heading"
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 id="health-heading" className="text-lg font-semibold">
            Estado do serviço
          </h2>
          {health.data ? (
            <p className="mt-3 flex items-center gap-2 text-emerald-300">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-emerald-400"
              />
              {health.data.status}
            </p>
          ) : health.error ? (
            <p role="alert" className="mt-3 text-rose-300">
              Não foi possível consultar o estado: {health.error}
            </p>
          ) : (
            <output className="mt-3 block text-slate-400">
              A verificar o serviço…
            </output>
          )}
        </section>
        <FeaturedAlbum album={album} />
        <FeaturedTrack track={track} />
      </div>
    </main>
  );
}
