"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, Suspense, useMemo } from "react";
import { AlbumsTable } from "@/components/artist/albums-table";
import { ArtistHeader } from "@/components/artist/artist-header";
import { ArtistStats } from "@/components/artist/artist-stats";
import { AuditionsCard } from "@/components/artist/auditions-card";
import { MonthsCard } from "@/components/artist/months-card";
import { SimilarArtistsCard } from "@/components/artist/similar-artists-card";
import { ListeningClock } from "@/components/dashboard/listening-clock";
import { RankingCard } from "@/components/dashboard/ranking-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { ArrowLeft, Icon } from "@/components/glaze/icon";
import { Button, buttonVariants } from "@/components/glaze/ui/button";
import { CardContent } from "@/components/glaze/ui/card";
import { BlockState } from "@/components/ui/block-state";
import { useArtistInfo } from "@/hooks/use-artist-info";
import { useScrobbles } from "@/hooks/use-scrobbles";
import {
  albunsDoArtista,
  artistasSemelhantes,
  posicaoDoArtista,
  resumoDoArtista,
  scrobblesDoArtista,
  scrobblesPorMes,
  topMusicasDoArtista,
  ultimasReproducoes,
} from "@/lib/artist";
import { horaDePico, scrobblesPorHora } from "@/lib/stats";

/** O parâmetro pode chegar codificado; um "%" solto faria `decodeURIComponent` rebentar. */
function descodificar(valor: string): string {
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

function SemReproducoes({ title }: { title: string }) {
  return (
    <SectionCard title={title}>
      <CardContent>
        <BlockState
          kind="empty"
          title="Sem reproduções deste artista no histórico."
        />
      </CardContent>
    </SectionCard>
  );
}

/** Moldura da página: o link de volta e o conteúdo, iguais no carregamento e depois dele. */
function Pagina({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 type-label text-text-2 hover:text-text-1"
      >
        <Icon icon={ArrowLeft} size={14} />
        Dashboard
      </Link>
      {children}
    </main>
  );
}

/** `useParams` suspende durante o prerender, por isso o conteúdo vive dentro de um Suspense. */
export default function Artista() {
  return (
    <Suspense
      fallback={
        <Pagina>
          <BlockState kind="loading" title="A carregar o artista…" />
        </Pagina>
      }
    >
      <ArtistaDetalhe />
    </Suspense>
  );
}

/** Página do artista, sempre all-time: o período do dashboard não se aplica aqui. */
function ArtistaDetalhe() {
  const params = useParams<{ nome: string }>();
  const nome = descodificar(params.nome);
  const historico = useScrobbles();
  const perfil = useArtistInfo(nome);

  const doArtista = useMemo(
    () => scrobblesDoArtista(historico.data, nome),
    [historico.data, nome],
  );
  const resumo = useMemo(
    () => resumoDoArtista(doArtista, historico.data.length),
    [doArtista, historico.data.length],
  );
  const posicao = useMemo(
    () => posicaoDoArtista(historico.data, nome),
    [historico.data, nome],
  );
  const topMusicas = useMemo(() => topMusicasDoArtista(doArtista), [doArtista]);
  const albuns = useMemo(() => albunsDoArtista(doArtista), [doArtista]);
  const meses = useMemo(() => scrobblesPorMes(doArtista), [doArtista]);
  const porHora = useMemo(() => scrobblesPorHora(doArtista), [doArtista]);
  const recentes = useMemo(() => ultimasReproducoes(doArtista), [doArtista]);
  const semelhantes = useMemo(
    () =>
      perfil.data
        ? artistasSemelhantes(perfil.data.similar_artists, historico.data)
        : [],
    [perfil.data, historico.data],
  );

  const carregar = () => {
    perfil.reload();
    historico.reload();
  };

  let estado: ReactNode = null;
  if (perfil.status === "not-found") {
    estado = (
      <BlockState
        kind="not-found"
        title="Artista não encontrado"
        description={`A API não devolveu perfil para "${nome}".`}
        action={
          <Link
            href="/"
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Voltar ao dashboard
          </Link>
        }
      />
    );
  } else if (perfil.status === "error" || historico.status === "error") {
    estado = (
      <BlockState
        kind="error"
        title="Não foi possível carregar o artista"
        description={perfil.error ?? historico.error ?? undefined}
        action={
          <Button variant="secondary" size="sm" onClick={carregar}>
            Tentar de novo
          </Button>
        }
      />
    );
  } else if (
    !perfil.data ||
    (historico.status !== "success" && !historico.data.length)
  ) {
    estado = <BlockState kind="loading" title="A carregar o artista…" />;
  }

  const dados = perfil.data;
  const pico = horaDePico(porHora);

  return (
    <Pagina>
      {estado ??
        (dados ? (
          <>
            <ArtistHeader profile={dados} />
            <ArtistStats resumo={resumo} posicao={posicao} />

            {topMusicas.length ? (
              <RankingCard
                title="Músicas mais ouvidas"
                description="Top 10 deste artista"
                items={topMusicas}
                ranked
              />
            ) : (
              <SemReproducoes title="Músicas mais ouvidas" />
            )}

            {albuns.length ? (
              <AlbumsTable artist={dados.name} albuns={albuns} />
            ) : (
              <SemReproducoes title="Álbuns" />
            )}

            <MonthsCard pontos={meses} />

            <ListeningClock
              porHora={porHora}
              pico={pico}
              title="A que horas ouves este artista"
            />

            <AuditionsCard rows={recentes} />

            <SimilarArtistsCard artistas={semelhantes} />
          </>
        ) : null)}
    </Pagina>
  );
}
