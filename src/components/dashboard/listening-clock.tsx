"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { FiltroDePeriodo } from "@/components/dashboard/period-filter";
import { SectionCard } from "@/components/dashboard/section-card";
import { formatNumber, formatScrobbles } from "@/lib/format";

interface PontoDaHora {
  hora: number;
  total: number;
}

/** Ângulo igual para todas as horas: o que varia é o comprimento da fatia, não a abertura. */
const FATIA = 1;
/** Buraco central e anel disponível, em percentagem do raio máximo. */
const BURACO = 34;
const ANEL = 100 - BURACO;

function TooltipDaHora({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: PontoDaHora }[];
}) {
  if (!active || !payload?.length) return null;
  const { hora, total } = payload[0].payload;
  return (
    <div className="rounded-tag border border-line bg-paper px-2 py-1 type-caption text-text-1">
      {String(hora).padStart(2, "0")}h UTC · {formatScrobbles(total)}
    </div>
  );
}

/** Reproduções por hora do dia (UTC) num mostrador de 24 fatias; a hora de pico é a mais comprida. */
export function ListeningClock({
  porHora,
  pico,
  title = "A que horas ouves",
  description = "Cada fatia é uma hora, em UTC",
  filter,
}: {
  porHora: number[];
  pico: number | null;
  title?: string;
  description?: string;
  filter?: FiltroDePeriodo;
}) {
  const horas: (PontoDaHora & { fatia: number })[] = porHora.map(
    (total, hora) => ({ hora, total, fatia: FATIA }),
  );
  const picoTotal = pico === null ? 0 : porHora[pico];

  if (pico === null) {
    return (
      <SectionCard title={title} description={description} filter={filter}>
        <p className="py-4 type-body text-text-2">
          Sem reproduções com data neste período.
        </p>
      </SectionCard>
    );
  }

  /** Comprimento da fatia: a hora sem reproduções fica no buraco, o pico no fim do anel. */
  const raio = (ponto: { total?: number }) =>
    `${BURACO + (ANEL * (ponto.total ?? 0)) / picoTotal}%`;

  return (
    <SectionCard title={title} description={description} filter={filter}>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div
          role="img"
          aria-label={`Reproduções por hora, em UTC. Pico às ${pico}h, com ${formatScrobbles(picoTotal)}.`}
          className="relative size-52 shrink-0 text-text-3 sm:size-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer={false}>
              <Tooltip content={<TooltipDaHora />} />
              <Pie
                data={horas}
                dataKey="fatia"
                startAngle={90}
                endAngle={-270}
                innerRadius={`${BURACO}%`}
                outerRadius="100%"
                stroke="var(--paper)"
                strokeWidth={1}
                isAnimationActive={false}
                rootTabIndex={-1}
              >
                {horas.map(({ hora }) => (
                  <Cell key={hora} className="fill-field" />
                ))}
              </Pie>
              <Pie
                data={horas}
                dataKey="fatia"
                startAngle={90}
                endAngle={-270}
                innerRadius={`${BURACO}%`}
                outerRadius={raio}
                stroke="var(--paper)"
                strokeWidth={1}
                isAnimationActive={false}
                rootTabIndex={-1}
              >
                {horas.map(({ hora, total }) => (
                  <Cell
                    key={hora}
                    className={total > 0 ? "fill-ink" : "fill-none"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Pontos cardeais do mostrador: decorativos, a legenda ao lado diz o resto. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div className="grid w-14 grid-cols-3 place-items-center type-caption text-text-3">
              <span />
              <span>00</span>
              <span />
              <span>18</span>
              <span />
              <span>06</span>
              <span />
              <span>12</span>
              <span />
            </div>
          </div>
        </div>

        <dl className="flex min-w-0 flex-col gap-5">
          <div>
            <dt className="type-caption text-text-2">Hora de pico</dt>
            <dd className="type-title text-text-1 tabular-nums">{pico}:00</dd>
          </div>
          <div>
            <dt className="type-caption text-text-2">Scrobbles nessa hora</dt>
            <dd className="type-heading text-text-1 tabular-nums">
              {formatNumber(picoTotal)}
            </dd>
          </div>
        </dl>
      </div>
    </SectionCard>
  );
}
