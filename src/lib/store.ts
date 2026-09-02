import { currentPersistence, loadState, saveState, sanitizeEvent } from "@/lib/state";
import type { BanquetEntry, EventPatch, PersistenceMode, PublicEvent, Rsvp, RsvpInput, Totals } from "@/lib/types";

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function toPublicEvent(event: { title: string; host: string; date: string; time: string; place: string; note: string }): PublicEvent {
  return {
    title: event.title,
    host: event.host,
    date: event.date,
    time: event.time,
    place: event.place,
    note: event.note,
  };
}

export function persistenceMode(): PersistenceMode {
  return currentPersistence();
}

export async function getEvent() {
  const state = await withLock(loadState);
  return state.event;
}

export async function updateEvent(patch: EventPatch) {
  return withLock(async () => {
    const state = await loadState();
    state.event = sanitizeEvent({ ...state.event, ...patch });
    await saveState(state);
    return state.event;
  });
}

export async function listRsvps(): Promise<Rsvp[]> {
  const state = await withLock(loadState);
  return state.rsvps;
}

export async function getRsvp(id: string): Promise<Rsvp | null> {
  const rows = await listRsvps();
  return rows.find((row) => row.id === id) ?? null;
}

export async function upsertRsvp(id: string | null, input: RsvpInput): Promise<Rsvp> {
  return withLock(async () => {
    const state = await loadState();
    const now = new Date().toISOString();
    const existing = id ? state.rsvps.find((row) => row.id === id) : undefined;

    const record: Rsvp = {
      id: existing?.id ?? crypto.randomUUID(),
      name: input.name,
      attending: input.attending,
      vegetarian: input.attending === "yes" ? input.vegetarian : false,
      beers: input.attending === "yes" ? input.beers : 0,
      notes: input.notes,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    state.rsvps = existing
      ? state.rsvps.map((row) => (row.id === existing.id ? record : row))
      : [...state.rsvps, record];

    await saveState(state);
    return record;
  });
}

export async function deleteRsvp(id: string): Promise<boolean> {
  return withLock(async () => {
    const state = await loadState();
    const next = state.rsvps.filter((row) => row.id !== id);
    if (next.length === state.rsvps.length) {
      return false;
    }
    state.rsvps = next;
    await saveState(state);
    return true;
  });
}

export async function listBanquetEntries(): Promise<BanquetEntry[]> {
  const rows = await listRsvps();
  return rows
    .filter((row) => row.attending === "yes")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((row) => ({
      name: row.name,
      vegetarian: row.vegetarian,
      beers: row.beers,
    }));
}

export function summarize(rsvps: Rsvp[]): Totals {
  const coming = rsvps.filter((row) => row.attending === "yes");
  return {
    replies: rsvps.length,
    coming: coming.length,
    declined: rsvps.filter((row) => row.attending === "no").length,
    vegetarian: coming.filter((row) => row.vegetarian).length,
    beers: coming.reduce((sum, row) => sum + row.beers, 0),
  };
}
