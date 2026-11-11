"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/glaze/ui/alert";
import { Button } from "@/components/glaze/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/glaze/ui/card";
import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@/components/glaze/ui/data-list";
import {
  Status as StatusLine,
  type StatusValue,
} from "@/components/glaze/ui/status";
import { useScrobbles } from "@/hooks/use-scrobbles";
import type { Status } from "@/types";

/**
 * Painel temporário para validar pedidos, cache e reidratação.
 * É substituído pelo dashboard na etapa dos ecrãs.
 */

const STATUS_LABELS: Record<Status, { status: StatusValue; label: string }> = {
  idle: { status: "idle", label: "À espera" },
  loading: { status: "running", label: "A carregar" },
  success: { status: "ok", label: "Pronto" },
  error: { status: "fail", label: "Erro" },
  "not-found": { status: "warn", label: "Não encontrado" },
};

function formatDate(value: number | string | null): string {
  if (!value) return "Sem data";

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

export default function Home() {
  const { data, status, error, updatedAt, reload } = useScrobbles();
  const latest = data.find((scrobble) => scrobble.date_iso);
  const current = STATUS_LABELS[status];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-title text-text-1">Histórico de audições</h1>
        <Button variant="secondary" onClick={reload}>
          Recarregar
        </Button>
      </header>

      {error ? (
        <Alert status="fail">
          <AlertTitle>Histórico indisponível</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Estado do histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <DataList>
            <DataListItem>
              <DataListLabel>Registos</DataListLabel>
              <DataListValue>{data.length}</DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>Estado</DataListLabel>
              <DataListValue>
                <StatusLine status={current.status} size="sm" live>
                  {current.label}
                </StatusLine>
              </DataListValue>
            </DataListItem>
            <DataListItem>
              <DataListLabel>Cache atualizada</DataListLabel>
              <DataListValue>{formatDate(updatedAt)}</DataListValue>
            </DataListItem>
          </DataList>
        </CardContent>
      </Card>

      {latest ? (
        <Card>
          <CardHeader>
            <CardTitle>Reprodução mais recente</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList>
              <DataListItem>
                <DataListLabel>Faixa</DataListLabel>
                <DataListValue>{latest.track_name}</DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>Artista</DataListLabel>
                <DataListValue>{latest.artist_name}</DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>Álbum</DataListLabel>
                <DataListValue>{latest.album_name}</DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>Data</DataListLabel>
                <DataListValue>{formatDate(latest.date_iso)}</DataListValue>
              </DataListItem>
            </DataList>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
