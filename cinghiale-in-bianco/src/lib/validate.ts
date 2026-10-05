import { MAX_BEERS, MAX_NAME, MAX_NOTES } from "@/lib/defaults";
import type { Attendance, EventPatch, RsvpInput } from "@/lib/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseRsvpInput(body: unknown): { ok: true; value: RsvpInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Dati non validi." };
  }

  const data = body as Record<string, unknown>;
  const name = asString(data.name).replace(/\s+/g, " ");
  const attending = asString(data.attending) as Attendance;
  const notes = asString(data.notes);
  const vegetarian = Boolean(data.vegetarian);
  const beersRaw = data.beers;

  if (name.length < 2) {
    return { ok: false, error: "Scrivi nome e cognome." };
  }
  if (name.length > MAX_NAME) {
    return { ok: false, error: "Il nome è troppo lungo." };
  }
  if (attending !== "yes" && attending !== "no") {
    return { ok: false, error: "Dimmi se ci sei oppure no." };
  }
  if (notes.length > MAX_NOTES) {
    return { ok: false, error: "Le note sono troppo lunghe." };
  }

  const beers =
    attending === "yes"
      ? typeof beersRaw === "number"
        ? beersRaw
        : Number.parseInt(asString(beersRaw), 10)
      : 0;

  if (!Number.isInteger(beers) || beers < 0 || beers > MAX_BEERS) {
    return { ok: false, error: `Le birre devono essere un numero da 0 a ${MAX_BEERS}.` };
  }

  return {
    ok: true,
    value: {
      name,
      attending,
      vegetarian: attending === "yes" ? vegetarian : false,
      beers,
      notes,
    },
  };
}

export function parseEventPatch(body: unknown): { ok: true; value: EventPatch } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Dati non validi." };
  }

  const data = body as Record<string, unknown>;
  const patch: EventPatch = {};

  if ("title" in data) {
    const title = asString(data.title);
    if (title.length < 3) {
      return { ok: false, error: "Il titolo è troppo corto." };
    }
    patch.title = title;
  }
  if ("host" in data) {
    const host = asString(data.host);
    if (host.length < 2) {
      return { ok: false, error: "Il nome dell'organizzatore è troppo corto." };
    }
    patch.host = host;
  }
  if ("date" in data) {
    const date = asString(data.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { ok: false, error: "La data non è valida." };
    }
    patch.date = date;
  }
  if ("time" in data) {
    patch.time = asString(data.time);
  }
  if ("place" in data) {
    patch.place = asString(data.place);
  }
  if ("note" in data) {
    patch.note = asString(data.note);
  }
  if ("pin" in data) {
    const pin = asString(data.pin);
    if (pin.length < 4) {
      return { ok: false, error: "Il PIN deve avere almeno 4 caratteri." };
    }
    patch.pin = pin;
  }

  return { ok: true, value: patch };
}
