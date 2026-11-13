"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionCard } from "@/components/dashboard/section-card";
import { BlockState } from "@/components/ui/block-state";
import { formatNumber, formatScrobbles } from "@/lib/format";
import type { MonthlyPoint } from "@/types";

const mesLongo = new Intl.DateTimeFormat("pt-PT", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const mesCurto = new Intl.DateTimeFormat("pt-PT", {
  month: "short",
  timeZone: "UTC",
});

/** "2025-11" → 1 de novembro de 2025, em UTC. */
function dataDoMes(mes: string): Date {
  const [ano, numero] = mes.split("-").map(Number);
  return new Date(Date.UTC(ano, numero - 1, 1));
}

function TooltipDoMes({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: MonthlyPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const { month, count } = payload[0].payload;
  return (
    <div className="rounded-tag border border-line bg-paper px-2 py-1 type-caption text-text-1">
      {mesLongo.format(dataDoMes(month))} · {formatScrobbles(count)}
    </div>
  );
}

/** Reproduções por mês numa linha; a série já vem contínua, do primeiro ao último mês. */
export function MonthsCard({ pontos }: { pontos: MonthlyPoint[] }) {
  const total = pontos.reduce((soma, ponto) => soma + ponto.count, 0);
  const pico = pontos.reduce((maior, ponto) => Math.max(maior, ponto.count), 0);

  return (
    <SectionCard
      title="Evolução mensal"
      description={`Últimos ${pontos.length} meses`}
    >
      {total === 0 ? (
        <BlockState
          kind="empty"
          title="Sem reproduções com data neste artista."
        />
      ) : (
        <>
          <dl className="mb-5 flex flex-wrap gap-x-10 gap-y-3">
            <div>
              <dt className="type-caption text-text-2">Total</dt>
              <dd className="type-heading-sm text-text-1 tabular-nums">
                {formatNumber(total)}
              </dd>
            </div>
            <div>
              <dt className="type-caption text-text-2">Melhor mês</dt>
              <dd className="type-heading-sm text-text-1 tabular-nums">
                {formatNumber(pico)}
              </dd>
            </div>
          </dl>
          <div
            role="img"
            aria-label={`Reproduções por mês nos últimos ${pontos.length} meses. O mês mais ouvido teve ${formatScrobbles(pico)}.`}
            className="h-48 sm:h-56"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={pontos}
                margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                accessibilityLayer={false}
              >
                <XAxis
                  dataKey="month"
                  interval={5}
                  tickFormatter={(mes: string) =>
                    `${mesCurto.format(dataDoMes(mes))} ${mes.slice(2, 4)}`
                  }
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--ink-60)", fontSize: 12 }}
                />
                <YAxis
                  width={28}
                  tickCount={3}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--ink-60)", fontSize: 12 }}
                />
                <Tooltip
                  content={<TooltipDoMes />}
                  cursor={{ stroke: "var(--line)" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--ink)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </SectionCard>
  );
}
