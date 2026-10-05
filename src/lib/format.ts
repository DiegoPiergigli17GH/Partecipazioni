export function formatEventDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(time: string): string {
  const trimmed = time.trim();
  if (!trimmed) {
    return "";
  }

  return `ore ${trimmed}`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function beerLabel(count: number): string {
  if (count === 0) {
    return "nessuna";
  }
  if (count === 1) {
    return "1 birra";
  }
  return `${count} birre`;
}

export function elixirLabel(count: number): string {
  if (count === 0) {
    return "nessun boccale";
  }
  if (count === 1) {
    return "1 boccale";
  }
  return `${count} boccali`;
}
