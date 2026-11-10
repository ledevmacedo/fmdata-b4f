"use client";

import { Button } from "@/components/ui/button";
import { useScrobbles } from "@/hooks/use-scrobbles";
import type { Status } from "@/types";

/**
 * Painel temporário para validar pedidos, cache e reidratação.
 * É substituído pelo dashboard na etapa dos ecrãs.
 */

const STATUS_LABELS: Record<Status, string> = {
  idle: "À espera",
  loading: "A carregar",
  success: "Pronto",
  error: "Erro",
  "not-found": "Não encontrado",
};

function formatDate(value: number | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

export default function Home() {
  const { data, status, error, updatedAt, reload } = useScrobbles();
  const latest = data.find((scrobble) => scrobble.date_iso);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
            FMData
          </p>
          <h1 className="text-heading-xl">Histórico de audições</h1>
        </div>
        <Button onClick={reload} variant="outline">
          Recarregar
        </Button>
      </header>

      <section className="grid gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-caption text-muted-foreground">Registos</span>
          <span className="text-metric">{data.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-caption text-muted-foreground">Estado</span>
          <span className="text-body-lg">{STATUS_LABELS[status]}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-caption text-muted-foreground">
            Cache atualizada
          </span>
          <span className="text-body">{formatDate(updatedAt)}</span>
        </div>
      </section>

      {error ? (
        <p className="rounded-lg border border-error/40 bg-error-soft px-4 py-3 text-body text-foreground">
          {error}
        </p>
      ) : null}

      {latest ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
            Reprodução mais recente
          </h2>
          <p className="text-body-lg">
            {latest.track_name} · {latest.artist_name}
          </p>
          <p className="text-caption text-muted-foreground">
            {latest.album_name} — {latest.date_iso}
          </p>
        </section>
      ) : null}
    </main>
  );
}
