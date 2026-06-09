/** Formaterer en dato på dansk, fx "14. marts 2026". */
export function formatDanishDate(date: Date): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Kort dansk datoformat, fx "14. mar 2026". */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Beregner en samlet score (1-10) ud fra en anmeldelses delkarakterer.
 * Bruges til ranglister, så rangeringen følger de faktiske delkarakterer.
 */
export function averageScore(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/** Estimerer læsetid i hele minutter ud fra et tekstindhold. */
export function readingTimeFromText(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min læsning`;
}
