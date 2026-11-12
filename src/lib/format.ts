const numberFormat = new Intl.NumberFormat("pt-PT");

const dayFormat = new Intl.DateTimeFormat("pt-PT", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const dateFormat = new Intl.DateTimeFormat("pt-PT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Número no formato pt-PT, com o separador de milhares local. */
export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** Dia e mês em UTC: o histórico está em segundos Unix e não deve mudar com o fuso do browser. */
export function formatDia(uts: number): string {
  return dayFormat.format(new Date(uts * 1000));
}

/** Dia, mês e ano em UTC, para datas antigas em que o ano é a informação. */
export function formatData(uts: number): string {
  return dateFormat.format(new Date(uts * 1000));
}

/** Contagem de scrobbles no formato pt-PT, com singular e plural corretos. */
export function formatScrobbles(value: number): string {
  return `${formatNumber(value)} ${value === 1 ? "scrobble" : "scrobbles"}`;
}
