/* eslint-disable glaze/no-native-control */

import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Artwork } from "@/components/dashboard/artwork";
import { SectionCard } from "@/components/dashboard/section-card";
import { Button } from "@/components/glaze/ui/button";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/glaze/ui/item";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { normalizeName } from "@/lib/filters";
import { formatData, formatScrobbles } from "@/lib/format";
import type { Scrobble } from "@/types";

type Modo = "single" | "range";

interface LinhaTop {
  name: string;
  subtitle?: string;
  image: string | null;
  count: number;
  key: string;
}

/** Agrupa por chave e devolve o top N, ordenado por contagem. */
function topN(
  rows: Scrobble[],
  keyOf: (row: Scrobble) => string,
  itemOf: (row: Scrobble) => Omit<LinhaTop, "count" | "key">,
  limite = 5,
): LinhaTop[] {
  const grupos = new Map<
    string,
    { item: Omit<LinhaTop, "count" | "key">; count: number }
  >();
  for (const row of rows) {
    const key = keyOf(row);
    if (!key) continue;
    const hit = grupos.get(key);
    if (!hit) {
      grupos.set(key, { item: itemOf(row), count: 1 });
      continue;
    }
    hit.count += 1;
  }
  return [...grupos.entries()]
    .map(([key, { item, count }]) => ({ ...item, count, key }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limite);
}

/** Dia UTC em segundos (início do dia). */
function diaDe(uts: number): number {
  return Math.floor(uts / 86400) * 86400;
}

/** Converte uma Date do picker para dia UTC em segundos. */
function diaUtcDe(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000,
  );
}

/**
 * Três colunas (artistas, músicas, álbuns) para um dia ou intervalo de dias,
 * com o primeiro de cada coluna em destaque e numeracao das posicoes.
 */
export function DateColumnsCard({ rows }: { rows: Scrobble[] }) {
  const datas = useMemo(() => {
    const conjunto = new Set<number>();
    for (const row of rows) {
      if (row.date_uts) conjunto.add(diaDe(row.date_uts));
    }
    return [...conjunto].sort((a, b) => b - a);
  }, [rows]);

  const [modo, setModo] = useState<Modo>("single");
  const [single, setSingle] = useState<number>(datas[0] ?? 0);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const filtradas = useMemo(() => {
    if (datas.length === 0) return [];
    if (modo === "single") {
      return rows.filter(
        (row) => row.date_uts !== null && diaDe(row.date_uts) === single,
      );
    }
    if (!range?.from) return rows;
    const from = diaUtcDe(range.from);
    const to = range.to ? diaUtcDe(range.to) : from;
    return rows.filter((row) => {
      if (row.date_uts === null) return false;
      const d = diaDe(row.date_uts);
      return d >= from && d <= to;
    });
  }, [rows, datas.length, modo, single, range]);

  const artistas = useMemo(
    () =>
      topN(
        filtradas,
        (row) => normalizeName(row.artist_name),
        (row) => ({
          name: row.artist_name,
          image: row.image_url,
        }),
      ),
    [filtradas],
  );

  const musicas = useMemo(
    () =>
      topN(
        filtradas,
        (row) =>
          `${normalizeName(row.artist_name)}::${normalizeName(row.track_name)}`,
        (row) => ({
          name: row.track_name,
          subtitle: row.artist_name,
          image: row.image_url,
        }),
      ),
    [filtradas],
  );

  const albuns = useMemo(
    () =>
      topN(
        filtradas,
        (row) =>
          row.album_name.trim()
            ? `${normalizeName(row.artist_name)}::${normalizeName(row.album_name)}`
            : "",
        (row) => ({
          name: row.album_name,
          subtitle: row.artist_name,
          image: row.image_url,
        }),
      ),
    [filtradas],
  );

  if (datas.length === 0) {
    return (
      <SectionCard title="Por data">
        <p className="py-4 type-body text-text-2">Sem reproduções com data.</p>
      </SectionCard>
    );
  }

  const selectClass =
    "min-w-0 rounded-tag border border-line-control bg-paper px-2 py-1 type-body-sm text-text-1";

  return (
    <SectionCard title="Por data" description="Artistas, músicas e álbuns">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          variant={modo === "single" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setModo("single")}
        >
          Data única
        </Button>
        <Button
          variant={modo === "range" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setModo("range")}
        >
          Intervalo
        </Button>

        {modo === "single" ? (
          <select
            className={selectClass}
            value={single}
            onChange={(event) => setSingle(Number(event.target.value))}
            aria-label="Data"
          >
            {datas.map((dia) => (
              <option key={dia} value={dia}>
                {formatData(dia)}
              </option>
            ))}
          </select>
        ) : (
          <DateRangePicker value={range} onChange={setRange} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Coluna titulo="Artistas" items={artistas} shape="circle" />
        <Coluna titulo="Músicas" items={musicas} />
        <Coluna titulo="Álbuns" items={albuns} />
      </div>
    </SectionCard>
  );
}

function Coluna({
  titulo,
  items,
  shape = "square",
}: {
  titulo: string;
  items: LinhaTop[];
  shape?: "circle" | "square";
}) {
  const [first, ...rest] = items;
  return (
    <div className="min-w-0">
      <h3 className="mb-2 type-label text-text-1">{titulo}</h3>
      {first ? (
        <div className="mb-4 flex items-center gap-4 border-b border-line-faint pb-4">
          <span className="w-5 shrink-0 type-caption text-text-3 tabular-nums">
            1
          </span>
          <Artwork
            name={first.name}
            src={first.image}
            shape={shape}
            size="lg"
          />
          <div className="min-w-0">
            <p className="truncate type-heading-sm text-text-1">{first.name}</p>
            {first.subtitle ? (
              <p className="truncate type-body text-text-2">{first.subtitle}</p>
            ) : null}
            <p className="type-caption text-text-3 tabular-nums">
              {formatScrobbles(first.count)}
            </p>
          </div>
        </div>
      ) : null}

      {rest.length ? (
        <ItemGroup
          variant="plain"
          aria-label={titulo}
          className="-mx-3 border-b border-line-faint"
        >
          {rest.map((item, index) => (
            <Item key={item.key}>
              <ItemMedia className="gap-3">
                <span className="w-5 shrink-0 type-caption text-text-3 tabular-nums">
                  {index + 2}
                </span>
                <Artwork
                  name={item.name}
                  src={item.image}
                  shape={shape}
                  size="sm"
                />
              </ItemMedia>
              <ItemContent>
                <div className="min-w-0 truncate type-heading-sm text-text-1">
                  {item.name}
                </div>
                {item.subtitle ? (
                  <p className="min-w-0 truncate type-body text-text-2">
                    {item.subtitle}
                  </p>
                ) : null}
              </ItemContent>
              <span className="shrink-0 type-caption text-text-3 tabular-nums">
                {formatScrobbles(item.count)}
              </span>
            </Item>
          ))}
        </ItemGroup>
      ) : null}

      {items.length === 0 ? (
        <p className="py-4 type-body text-text-2">Sem dados.</p>
      ) : null}
    </div>
  );
}
