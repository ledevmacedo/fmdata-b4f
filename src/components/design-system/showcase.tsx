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
  CardFooter,
  CardHeader,
  CardMeta,
  CardTitle,
} from "@/components/glaze/ui/card";
import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@/components/glaze/ui/data-list";
import { Status } from "@/components/glaze/ui/status";

/** Amostras do sistema Glaze: tokens, tipos de letra, ações e os componentes usados no FMData. */
export function Showcase() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="type-title text-text-1">Sistema de design</h1>
        <p className="type-body text-text-2">
          Tokens e componentes Glaze usados no FMData.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading text-text-1">Cor</h2>

        <h3 className="type-label text-text-2">Superfícies</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-page" />
            <code className="text-text-2">bg-page</code>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-paper" />
            <code className="text-text-2">bg-paper</code>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-shell" />
            <code className="text-text-2">bg-shell</code>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-field" />
            <code className="text-text-2">bg-field</code>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-code-surface" />
            <code className="text-text-2">bg-code-surface</code>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-12 rounded-tag border border-line bg-hover" />
            <code className="text-text-2">bg-hover</code>
          </div>
        </div>

        <h3 className="type-label text-text-2">Texto</h3>
        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="type-body text-text-1">Texto principal</span>
            <code className="text-text-2">text-1</code>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="type-body text-text-2">Texto secundário</span>
            <code className="text-text-2">text-2</code>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="type-body text-text-3">Texto terciário</span>
            <code className="text-text-2">text-3</code>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="type-body text-text-disabled">Desativado</span>
            <code className="text-text-2">text-disabled</code>
          </div>
        </div>

        <h3 className="type-label text-text-2">Linhas</h3>
        <div className="grid gap-2">
          <div className="flex items-center gap-3">
            <div className="h-0 flex-1 border-t border-line-faint" />
            <code className="text-text-2">line-faint</code>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-0 flex-1 border-t border-line" />
            <code className="text-text-2">line</code>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-0 flex-1 border-t border-line-control" />
            <code className="text-text-2">line-control</code>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-0 flex-1 border-t border-line-strong" />
            <code className="text-text-2">line-strong</code>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="type-heading text-text-1">Tipografia</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-title text-text-1">Título de página</span>
            <code className="text-text-2">type-title</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-heading text-text-1">Secção</span>
            <code className="text-text-2">type-heading</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-heading-sm text-text-1">
              Título de cartão
            </span>
            <code className="text-text-2">type-heading-sm</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-body text-text-1">Parágrafo de corpo</span>
            <code className="text-text-2">type-body</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-body-sm text-text-1">Descrição densa</span>
            <code className="text-text-2">type-body-sm</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-label text-text-1">Etiqueta de controlo</span>
            <code className="text-text-2">type-label</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-faint pb-2">
            <span className="type-caption text-text-2">
              Nota ao lado de um valor
            </span>
            <code className="text-text-2">type-caption</code>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="type-code text-text-1">run_8f2a91</span>
            <code className="text-text-2">type-code</code>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading text-text-1">Ações</h2>

        <h3 className="type-label text-text-2">Variantes</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">primary</code>
            <Button>Guardar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">destructive</code>
            <Button variant="destructive">Eliminar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">confirm</code>
            <Button variant="confirm">Aprovar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">secondary</code>
            <Button variant="secondary">Cancelar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">ghost</code>
            <Button variant="ghost">Fechar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">disabled</code>
            <Button variant="secondary" disabled>
              Indisponível
            </Button>
          </div>
        </div>

        <h3 className="type-label text-text-2">Tamanhos</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">sm</code>
            <Button size="sm">Recarregar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">default</code>
            <Button>Recarregar</Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <code className="text-text-2">lg</code>
            <Button size="lg">Recarregar</Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading text-text-1">Estados</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Status status="idle">Inativo</Status>
          <Status status="queued">Em fila</Status>
          <Status status="running">Em curso</Status>
          <Status status="ok">Concluído</Status>
          <Status status="warn">Aviso</Status>
          <Status status="fail">Falhou</Status>
          <Status status="waiting">À espera de ti</Status>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="type-heading text-text-1">Mensagens</h2>
        <Alert status="neutral" announce={false}>
          <AlertTitle>Amostra limitada</AlertTitle>
          <AlertDescription>
            Os dados de exemplo mostram apenas as primeiras 100 audições.
          </AlertDescription>
        </Alert>
        <Alert status="ok" announce={false}>
          <AlertTitle>Histórico atualizado</AlertTitle>
          <AlertDescription>A cache foi atualizada agora.</AlertDescription>
        </Alert>
        <Alert status="warn" announce={false}>
          <AlertTitle>API lenta</AlertTitle>
          <AlertDescription>
            O servidor gratuito pode demorar a responder.
          </AlertDescription>
        </Alert>
        <Alert status="fail" announce={false}>
          <AlertTitle>Histórico indisponível</AlertTitle>
          <AlertDescription>
            Não foi possível contactar a API. Tenta novamente.
          </AlertDescription>
        </Alert>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading text-text-1">Dados</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Card>
              <CardHeader>
                <CardTitle>Última audição</CardTitle>
              </CardHeader>
              <CardContent>
                <DataList>
                  <DataListItem>
                    <DataListLabel>Faixa</DataListLabel>
                    <DataListValue>All I Ask</DataListValue>
                  </DataListItem>
                  <DataListItem>
                    <DataListLabel>Artista</DataListLabel>
                    <DataListValue>Adele</DataListValue>
                  </DataListItem>
                  <DataListItem>
                    <DataListLabel>Álbum</DataListLabel>
                    <DataListValue>25</DataListValue>
                  </DataListItem>
                </DataList>
              </CardContent>
              <CardFooter>
                <CardMeta>Exemplo</CardMeta>
                <Button size="sm" variant="secondary">
                  Ver artista
                </Button>
                <Button size="sm">Abrir histórico</Button>
              </CardFooter>
            </Card>
            <code className="text-text-2">Card</code>
          </div>

          <div className="flex flex-col gap-2">
            <DataList variant="panel">
              <DataListItem>
                <DataListLabel>Registos</DataListLabel>
                <DataListValue>128</DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>Estado</DataListLabel>
                <DataListValue>
                  <Status status="ok" size="sm">
                    Concluído
                  </Status>
                </DataListValue>
              </DataListItem>
              <DataListItem>
                <DataListLabel>Cache atualizada</DataListLabel>
                <DataListValue>11/11/26, 15:34</DataListValue>
              </DataListItem>
            </DataList>
            <code className="text-text-2">DataList variant="panel"</code>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading text-text-1">Forma</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-start gap-2">
            <div className="h-16 w-24 rounded-tag border border-line bg-paper" />
            <code className="text-text-2">rounded-tag</code>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-16 w-24 rounded-panel border border-line bg-paper" />
            <code className="text-text-2">rounded-panel</code>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-16 w-24 rounded-shell border border-line bg-paper" />
            <code className="text-text-2">rounded-shell</code>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="h-16 w-24 rounded-pill border border-line bg-paper" />
            <code className="text-text-2">rounded-pill</code>
          </div>
        </div>
      </section>
    </main>
  );
}
