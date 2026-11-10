"use client";

import { ArrowRightIcon } from "@solar-icons/react/linear/arrow-right";
import { MoonStarsIcon } from "@solar-icons/react/linear/moon-stars";
import { SunIcon } from "@solar-icons/react/linear/sun";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Checkbox,
  Input,
  Select,
  Switch,
  Textarea,
} from "@/components/ui/form-controls";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";

const colorGroups = [
  {
    name: "Neutros",
    tokens: [
      "neutral-0",
      "neutral-50",
      "neutral-100",
      "neutral-200",
      "neutral-300",
      "neutral-400",
      "neutral-500",
      "neutral-600",
      "neutral-700",
      "neutral-800",
      "neutral-900",
    ],
  },
  {
    name: "Expressivos",
    tokens: [
      "violet-strong",
      "violet-mid",
      "violet-light",
      "blue-strong",
      "blue-mid",
      "blue-light",
      "coral-strong",
      "coral-mid",
      "coral-light",
    ],
  },
  { name: "Estados", tokens: ["success", "warning", "error", "info"] },
];

const spaces = ["1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20"];
const radii = ["sm", "md", "lg", "xl", "2xl", "full"];
const shadowTokens = ["soft", "float"];

function DotSignal({ tone = "light" }: { tone?: "light" | "mixed" }) {
  const heights = [
    2, 3, 2, 4, 3, 5, 4, 6, 4, 3, 5, 7, 5, 4, 3, 6, 4, 5, 3, 4, 2, 5, 3, 2,
  ];
  return (
    <svg
      aria-hidden="true"
      className="h-16 w-full"
      fill="none"
      viewBox="0 0 240 64"
    >
      {heights.map((height, column) =>
        Array.from({ length: height }, (_, row) => {
          const warm = tone === "mixed" && row < Math.max(1, height / 2);
          return (
            <circle
              cx={column * 10 + 4}
              cy={60 - row * 8}
              fill={warm ? "var(--coral-light)" : "rgb(255 255 255 / 72%)"}
              key={`${column * 10 + 4}-${60 - row * 8}`}
              r="1.8"
            />
          );
        }),
      )}
    </svg>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] md:items-end">
      <h2 className="text-heading-xl font-medium tracking-[-0.035em]">
        {title}
      </h2>
      <p className="max-w-[54ch] text-body leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function Showcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);

  return (
    <div
      className="ds-page min-h-screen bg-background text-foreground"
      data-theme={theme}
    >
      <div className="ds-shell box-border w-full mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <header className="flex min-h-20 items-center justify-between border-b border-border">
          <a
            aria-label="FMData, design system"
            className="flex items-center gap-3 text-label font-semibold tracking-[-0.02em]"
            href="#top"
          >
            <span aria-hidden="true" className="grid size-8 grid-cols-2 gap-1">
              <i className="rounded-sm bg-primary" />
              <i className="rounded-sm bg-accent" />
              <i className="rounded-sm bg-neutral-400" />
              <i className="rounded-sm bg-neutral-700" />
            </span>
            <span>
              FMData{" "}
              <span className="font-normal text-muted-foreground">
                / Sistema visual
              </span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-label text-muted-foreground sm:inline">
              Tema {theme === "light" ? "claro" : "escuro"}
            </span>
            <Button
              aria-label={
                theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"
              }
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              size="icon"
              variant="outline"
            >
              {theme === "light" ? (
                <MoonStarsIcon aria-hidden="true" size={19} />
              ) : (
                <SunIcon aria-hidden="true" size={19} />
              )}
            </Button>
          </div>
        </header>

        <main id="top">
          <section className="grid gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-end md:py-24 lg:gap-20">
            <h1 className="max-w-[10ch] text-display-lg font-medium leading-[0.98] tracking-[-0.045em]">
              Uma linguagem visual clara, em cada detalhe.
            </h1>
            <div className="max-w-[36rem] pb-2">
              <p className="text-body-lg leading-relaxed text-muted-foreground">
                Uma base partilhada para construir interfaces consistentes:
                neutros serenos, dados com presença e superfícies com luz
                própria.
              </p>
              <nav
                aria-label="Nesta página"
                className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-label"
              >
                <a
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                  href="#cores"
                >
                  Cores
                </a>
                <a
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                  href="#tipografia"
                >
                  Tipografia
                </a>
                <a
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                  href="#materiais"
                >
                  Materiais
                </a>
                <a
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                  href="#componentes"
                >
                  Componentes
                </a>
              </nav>
            </div>
          </section>

          <section className="border-t border-border py-14 md:py-20" id="cores">
            <SectionHeading
              description="A base mantém-se neutra. Violeta, azul e coral assinalam informação ou criam superfícies de destaque; as cores de estado comunicam significado."
              title="Cor, com intenção."
            />
            <div className="grid gap-8">
              {colorGroups.map((group) => (
                <div
                  className="grid gap-4 md:grid-cols-[10rem_1fr] md:items-start"
                  key={group.name}
                >
                  <h3 className="pt-2 text-label font-medium">{group.name}</h3>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
                    {group.tokens.map((token) => (
                      <div className="min-w-0" key={token}>
                        <div
                          className="mb-2 h-16 rounded-md border border-border/60"
                          style={{ backgroundColor: `var(--${token})` }}
                        />
                        <span className="block truncate text-caption text-muted-foreground">
                          {token}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-success-soft px-4 py-3 text-label font-medium text-success">
                Concluído
              </div>
              <div className="rounded-md bg-warning-soft px-4 py-3 text-label font-medium text-warning">
                Atenção
              </div>
              <div className="rounded-md bg-error-soft px-4 py-3 text-label font-medium text-error">
                Requer ação
              </div>
              <div className="rounded-md bg-info-soft px-4 py-3 text-label font-medium text-info">
                Informação
              </div>
            </div>
          </section>

          <section
            className="border-t border-border py-14 md:py-20"
            id="tipografia"
          >
            <SectionHeading
              description="Geist Sans mantém uma voz única entre títulos e interface. Os números usam algarismos tabulares; a escala distingue títulos, leitura e metadados."
              title="Tipografia sem ruído."
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
              <div className="space-y-7">
                <p className="text-display-xl font-medium leading-[0.9] tracking-[-0.045em]">
                  Aa 0123
                </p>
                <p className="text-heading-xl font-medium tracking-[-0.035em]">
                  A forma acompanha a função.
                </p>
                <p className="max-w-[65ch] text-body-lg leading-relaxed text-muted-foreground">
                  A leitura permanece confortável, com hierarquia marcada pelo
                  tamanho, pelo peso e pelo espaço — nunca por etiquetas
                  decorativas.
                </p>
              </div>
              <dl className="divide-y divide-border border-y border-border">
                {[
                  ["Display", "clamp(56px, 8vw, 112px)"],
                  ["Título", "clamp(32px, 3vw, 48px)"],
                  ["Texto", "16–18px / 1.6"],
                  ["Rótulo", "14px / 1.4"],
                  ["Dados", "Geist Mono · tabular"],
                ].map(([name, value]) => (
                  <div
                    className="flex justify-between gap-4 py-4 text-label"
                    key={name}
                  >
                    <dt className="text-muted-foreground">{name}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="border-t border-border py-14 md:py-20">
            <SectionHeading
              description="Uma escala compacta mantém espaçamento e geometria previsíveis entre componentes."
              title="Ritmo e proporção."
            />
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 text-label font-medium">
                  Espaçamento · base de 4 px
                </h3>
                <div className="space-y-3">
                  {spaces.map((space) => (
                    <div
                      className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3"
                      key={space}
                    >
                      <span className="text-caption text-muted-foreground">
                        {space}
                      </span>
                      <div
                        className="h-2 rounded-full bg-primary/75"
                        style={{ width: `var(--space-${space})` }}
                      />
                      <span className="text-right font-mono text-caption text-muted-foreground">
                        {Number(space) * 4}px
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">
                  Raios · suaves e concêntricos
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {radii.map((radius) => (
                    <div
                      className="flex aspect-square items-center justify-center border border-border bg-card text-caption text-muted-foreground"
                      key={radius}
                      style={{ borderRadius: `var(--ds-radius-${radius})` }}
                    >
                      {radius}
                    </div>
                  ))}
                </div>
                <h3 className="mb-5 mt-10 text-label font-medium">
                  Elevação · sombra difusa
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  {shadowTokens.map((shadow) => (
                    <div
                      className="rounded-lg bg-card p-5 text-label"
                      key={shadow}
                      style={{ boxShadow: `var(--ds-shadow-${shadow})` }}
                    >
                      {shadow === "soft" ? "Superfície" : "Elemento flutuante"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className="border-t border-border py-14 md:py-20"
            id="materiais"
          >
            <SectionHeading
              description="A luz aparece apenas em superfícies que precisam de destaque. A camada translúcida reserva-se a informação independente e mantém contraste elevado."
              title="Superfícies com presença."
            />
            <div className="grid gap-5 lg:grid-cols-[1.35fr_0.8fr_0.8fr]">
              <Card className="min-h-72" padding="lg" variant="glass">
                <CardHeader>
                  <div>
                    <p className="text-label text-white/80">
                      Amostra · vidro violeta
                    </p>
                    <CardTitle className="mt-2 text-white">Ritmo</CardTitle>
                  </div>
                  <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-caption text-white">
                    Valores ilustrativos
                  </span>
                </CardHeader>
                <div className="mt-8 flex items-end gap-3">
                  <span className="text-metric-xl font-medium leading-none tracking-[-0.045em]">
                    48
                  </span>
                  <span className="pb-1 text-body text-white">
                    eventos no período
                  </span>
                </div>
                <div className="mt-8">
                  <DotSignal />
                </div>
              </Card>
              <Card
                className="flex min-h-72 flex-col justify-between"
                padding="md"
                variant="income"
              >
                <CardHeader>
                  <div>
                    <p className="text-label text-white/80">Amostra</p>
                    <CardTitle className="mt-2 text-white">Entradas</CardTitle>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-full bg-white/20"
                  >
                    <ArrowRightIcon className="-rotate-45" size={19} />
                  </span>
                </CardHeader>
                <div>
                  <p className="text-metric font-medium leading-none tracking-[-0.04em]">
                    32 023
                  </p>
                  <p className="mt-2 text-label text-white">
                    valor ilustrativo
                  </p>
                </div>
              </Card>
              <Card
                className="flex min-h-72 flex-col justify-between"
                padding="md"
                variant="expense"
              >
                <CardHeader>
                  <div>
                    <p className="text-label text-white/80">Amostra</p>
                    <CardTitle className="mt-2 text-white">Saídas</CardTitle>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-full bg-white/20"
                  >
                    <ArrowRightIcon className="-rotate-45" size={19} />
                  </span>
                </CardHeader>
                <div>
                  <p className="text-metric font-medium leading-none tracking-[-0.04em]">
                    12 408
                  </p>
                  <p className="mt-2 text-label text-white">
                    valor ilustrativo
                  </p>
                </div>
              </Card>
              <Card className="lg:col-span-3" padding="md">
                <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-center">
                  <div>
                    <p className="text-label text-muted-foreground">
                      Superfície neutra
                    </p>
                    <CardTitle className="mt-2">Fluxo de atividade</CardTitle>
                    <CardDescription className="mt-2">
                      Uma base clara para informação e gráficos.
                    </CardDescription>
                    <p className="mt-6 text-heading-xl font-medium tracking-[-0.035em]">
                      +19,4%
                    </p>
                  </div>
                  <DotSignal tone="mixed" />
                </div>
              </Card>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-border bg-glass-fill p-4 backdrop-blur-[var(--glass-blur)]">
                <span className="text-label font-medium">Vidro</span>
                <p className="mt-1 text-caption text-muted-foreground">
                  Transparência e desfoque moderados.
                </p>
              </div>
              <div className="rounded-md border border-border bg-gradient-ambient p-4">
                <span className="text-label font-medium">Luz ambiente</span>
                <p className="mt-1 text-caption text-muted-foreground">
                  Um halo localizado, sem competir com o conteúdo.
                </p>
              </div>
              <div className="rounded-md bg-card p-4 shadow-soft">
                <span className="text-label font-medium">Elevação</span>
                <p className="mt-1 text-caption text-muted-foreground">
                  Sombra com deslocamento e difusão.
                </p>
              </div>
            </div>
          </section>

          <section
            className="border-t border-border py-14 md:py-20"
            id="componentes"
          >
            <SectionHeading
              description="Controlos com altura, estados e foco consistentes. Os exemplos são funcionais e usam elementos familiares do navegador sempre que possível."
              title="Peças para compor."
            />
            <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 text-label font-medium">Botões</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primário</Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="outline">Contorno</Button>
                  <Button variant="dark">Escuro</Button>
                  <Button aria-label="Abrir" size="icon" variant="outline">
                    <ArrowRightIcon aria-hidden="true" size={18} />
                  </Button>
                  <Button disabled>Desativado</Button>
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">Estados</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Neutro</Badge>
                  <Badge variant="success">Concluído</Badge>
                  <Badge variant="warning">Atenção</Badge>
                  <Badge variant="error">Erro</Badge>
                  <Badge variant="info">Informação</Badge>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar initials="ML" />
                  <Avatar initials="AR" size="sm" />
                  <Avatar initials="JS" size="lg" />
                  <Separator className="mx-2 h-8" orientation="vertical" />
                  <Tooltip content="Informação adicional">
                    <Button variant="ghost">Passe ou foque aqui</Button>
                  </Tooltip>
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">Campos</h3>
                <div className="grid gap-4">
                  <label
                    className="grid gap-2 text-label"
                    htmlFor="sample-name"
                  >
                    Nome
                    <Input id="sample-name" placeholder="Escreva um nome" />
                  </label>
                  <label
                    className="grid gap-2 text-label"
                    htmlFor="sample-category"
                  >
                    Categoria
                    <Select defaultValue="" id="sample-category">
                      <option disabled value="">
                        Escolha uma opção
                      </option>
                      <option>Opção A</option>
                      <option>Opção B</option>
                    </Select>
                  </label>
                  <label
                    className="grid gap-2 text-label"
                    htmlFor="sample-notes"
                  >
                    Notas
                    <Textarea
                      id="sample-notes"
                      placeholder="Adicione uma nota"
                    />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                  <label
                    className="flex items-center gap-3 text-label"
                    htmlFor="sample-check"
                  >
                    <Checkbox
                      checked={checked}
                      id="sample-check"
                      onChange={(event) => setChecked(event.target.checked)}
                    />{" "}
                    Aceito esta opção
                  </label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={switchOn}
                      label="Ativar notificações de exemplo"
                      onCheckedChange={setSwitchOn}
                    />
                    <span className="text-label">Notificações</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">
                  Separadores e menus
                </h3>
                <Tabs
                  items={[
                    {
                      id: "visao",
                      label: "Visão geral",
                      content: "O conteúdo acompanha o separador selecionado.",
                    },
                    {
                      id: "detalhe",
                      label: "Detalhe",
                      content:
                        "Uma segunda vista, mantendo o mesmo espaço e hierarquia.",
                    },
                    {
                      id: "historico",
                      label: "Histórico",
                      content:
                        "Estados alternativos permanecem legíveis e previsíveis.",
                    },
                  ]}
                />
                <div className="mt-5">
                  <DropdownMenu label="Explorar">
                    <a
                      className="flex min-h-10 items-center rounded-sm px-3 text-label hover:bg-muted"
                      href="#cores"
                    >
                      Cores
                    </a>
                    <a
                      className="flex min-h-10 items-center rounded-sm px-3 text-label hover:bg-muted"
                      href="#materiais"
                    >
                      Materiais
                    </a>
                    <a
                      className="flex min-h-10 items-center rounded-sm px-3 text-label hover:bg-muted"
                      href="#componentes"
                    >
                      Componentes
                    </a>
                  </DropdownMenu>
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">Diálogo</h3>
                <Dialog title="Pré-visualização" triggerLabel="Abrir diálogo">
                  <p className="text-body leading-relaxed text-muted-foreground">
                    Os diálogos usam a semântica nativa de modal, com foco
                    contido e fecho por teclado.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <form method="dialog">
                      <Button type="submit">Compreendi</Button>
                    </form>
                  </div>
                </Dialog>
              </div>
              <div>
                <h3 className="mb-5 text-label font-medium">Cartão composto</h3>
                <Card padding="sm">
                  <CardHeader>
                    <div>
                      <CardTitle>Resumo</CardTitle>
                      <CardDescription className="mt-1">
                        Título, contexto e ação numa estrutura reutilizável.
                      </CardDescription>
                    </div>
                    <Badge variant="success">Atualizado</Badge>
                  </CardHeader>
                  <Separator className="my-5" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-label text-muted-foreground">
                      Estado da amostra
                    </span>
                    <Button size="sm" variant="ghost">
                      Ver detalhe
                      <ArrowRightIcon aria-hidden="true" size={16} />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col gap-3 border-t border-border py-8 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>FMData · Sistema visual</span>
          <span>Tokens partilhados, interfaces mais consistentes.</span>
        </footer>
      </div>
    </div>
  );
}
