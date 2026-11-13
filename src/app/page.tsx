"use client";

import { useMemo } from "react";
import { AlbumsCard } from "@/components/dashboard/albums-card";
import { AnalysisCard } from "@/components/dashboard/analysis-card";
import { DateColumnsCard } from "@/components/dashboard/date-columns-card";
import { Hero } from "@/components/dashboard/hero";
import { ListeningClock } from "@/components/dashboard/listening-clock";
import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { RankingCard } from "@/components/dashboard/ranking-card";
import { RecentPlaysCard } from "@/components/dashboard/recent-plays-card";
import { TopGenreCard } from "@/components/dashboard/top-genre-card";
import { Button } from "@/components/glaze/ui/button";
import { BlockState } from "@/components/ui/block-state";
import { usePeriodoLocal } from "@/hooks/use-periodo-local";
import { useScrobbles } from "@/hooks/use-scrobbles";
import { ultimasReproducoes } from "@/lib/artist";
import {
  buildDashboard,
  topAlbuns,
  topArtistas,
  topMusicas,
} from "@/lib/dashboard";
import { generoMaisOuvido, horaDePico, scrobblesPorHora } from "@/lib/stats";
import type { Scrobble } from "@/types";

/** Cada secção tem o seu período: só as linhas que ela deixa passar chegam às contas. */
function useFiltro(rows: Scrobble[]) {
  const { period, setPeriod, rows: filtradas } = usePeriodoLocal(rows);
  const filter: FiltroDePeriodo = { value: period, onChange: setPeriod };
  return { filtradas, filter };
}

function CartaoArtistas({ rows }: { rows: Scrobble[] }) {
  const { filtradas, filter } = useFiltro(rows);
  const items = useMemo(() => topArtistas(filtradas), [filtradas]);
  return (
    <RankingCard
      title="Artistas mais ouvidos"
      description="Top 20"
      items={items}
      shape="circle"
      ranked
      filter={filter}
    />
  );
}

function CartaoMusicas({ rows }: { rows: Scrobble[] }) {
  const { filtradas, filter } = useFiltro(rows);
  const items = useMemo(() => topMusicas(filtradas), [filtradas]);
  return (
    <RankingCard
      title="Músicas mais ouvidas"
      description="Top 10"
      items={items}
      ranked
      filter={filter}
    />
  );
}

function CartaoAlbuns({ rows }: { rows: Scrobble[] }) {
  const { filtradas, filter } = useFiltro(rows);
  const items = useMemo(() => topAlbuns(filtradas), [filtradas]);
  return <AlbumsCard id="albuns" items={items} filter={filter} />;
}

function CartaoGenero({ rows }: { rows: Scrobble[] }) {
  const { filtradas, filter } = useFiltro(rows);
  const genero = useMemo(() => generoMaisOuvido(filtradas), [filtradas]);
  return (
    <TopGenreCard genero={genero} total={filtradas.length} filter={filter} />
  );
}

function CartaoRelogio({ rows }: { rows: Scrobble[] }) {
  const { filtradas, filter } = useFiltro(rows);
  const porHora = useMemo(() => scrobblesPorHora(filtradas), [filtradas]);
  const pico = useMemo(() => horaDePico(porHora), [porHora]);
  return <ListeningClock porHora={porHora} pico={pico} filter={filter} />;
}

function CartaoReproducoes({
  rows,
  nowPlaying,
}: {
  rows: Scrobble[];
  nowPlaying: Scrobble | null;
}) {
  const recentes = useMemo(() => ultimasReproducoes(rows), [rows]);
  return <RecentPlaysCard nowPlaying={nowPlaying} rows={recentes} />;
}

/** Dashboard: o perfil e a análise são all-time; cada secção filtra o seu período. */
export default function Home() {
  const { data, nowPlaying, status, error, reload } = useScrobbles();
  const dashboard = useMemo(
    () => (data.length ? buildDashboard(data) : null),
    [data],
  );
  const albums = useMemo(() => topAlbuns(data, 4), [data]);

  return (
    <main className="mx-auto flex w-full max-w-(--page-width) flex-1 flex-col px-6 pb-16 sm:px-10 lg:px-16">
      {dashboard ? (
        <>
          <Hero profile={dashboard} albums={albums} />

          <CartaoReproducoes rows={data} nowPlaying={nowPlaying} />

          <div
            id="rankings"
            className="mt-12 flex scroll-mt-20 flex-col gap-12 lg:mt-16 lg:gap-16"
          >
            <CartaoArtistas rows={data} />

            <CartaoMusicas rows={data} />

            <CartaoAlbuns rows={data} />

            <div
              id="padroes"
              className="flex scroll-mt-20 flex-col gap-12 lg:gap-16"
            >
              <CartaoGenero rows={data} />

              <CartaoRelogio rows={data} />
            </div>

            <AnalysisCard esquecido={dashboard.esquecido} />

            <DateColumnsCard rows={data} />
          </div>
        </>
      ) : (
        <>
          <h1 className="sr-only">FMData</h1>
          <div className="flex min-h-96 items-center justify-center py-16">
            {status === "error" ? (
              <BlockState
                kind="error"
                title="Não foi possível carregar o histórico"
                description={error ?? undefined}
                action={
                  <Button variant="secondary" size="sm" onClick={reload}>
                    Tentar de novo
                  </Button>
                }
              />
            ) : status === "success" ? (
              <BlockState
                kind="empty"
                title="O histórico está vazio"
                description="A API não devolveu nenhuma reprodução."
              />
            ) : (
              <BlockState kind="loading" title="A carregar o histórico…" />
            )}
          </div>
        </>
      )}
    </main>
  );
}
