import { promises as fs } from "fs";
import path from "path";

import { DEFAULT_EVENT } from "@/lib/defaults";
import type {
  EventInfo,
  EventPatch,
  PublicEvent,
  Rsvp,
  RsvpInput,
  Totals,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const EVENT_FILE = path.join(DATA_DIR, "event.json");
const RSVP_FILE = path.join(DATA_DIR, "rsvps.json");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

async function writeJsonFile(file: string, value: unknown) {
  await ensureDataDir();
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(tmp, file);
}

function sanitizeEvent(value: Partial<EventInfo> | null | undefined): EventInfo {
  return {
    title: String(value?.title ?? DEFAULT_EVENT.title).trim() || DEFAULT_EVENT.title,
    host: String(value?.host ?? DEFAULT_EVENT.host).trim() || DEFAULT_EVENT.host,
    date: String(value?.date ?? DEFAULT_EVENT.date).trim() || DEFAULT_EVENT.date,
    time: String(value?.time ?? DEFAULT_EVENT.time).trim(),
    place: String(value?.place ?? DEFAULT_EVENT.place).trim(),
    note: String(value?.note ?? DEFAULT_EVENT.note).trim(),
    pin: String(value?.pin ?? DEFAULT_EVENT.pin).trim() || DEFAULT_EVENT.pin,
  };
}

export function toPublicEvent(event: EventInfo): PublicEvent {
  return {
    title: event.title,
    host: event.host,
    date: event.date,
    time: event.time,
    place: event.place,
    note: event.note,
  };
}

export async function getEvent(): Promise<EventInfo> {
  return withLock(async () => sanitizeEvent(await readJsonFile<EventInfo>(EVENT_FILE, DEFAULT_EVENT)));
}

export async function updateEvent(patch: EventPatch): Promise<EventInfo> {
  return withLock(async () => {
    const current = sanitizeEvent(await readJsonFile<EventInfo>(EVENT_FILE, DEFAULT_EVENT));
    const next = sanitizeEvent({ ...current, ...patch });
    await writeJsonFile(EVENT_FILE, next);
    return next;
  });
}

async function readRsvpsUnlocked(): Promise<Rsvp[]> {
  const rows = await readJsonFile<Rsvp[]>(RSVP_FILE, []);
  return Array.isArray(rows) ? rows : [];
}

export async function listRsvps(): Promise<Rsvp[]> {
  return withLock(readRsvpsUnlocked);
}

export async function getRsvp(id: string): Promise<Rsvp | null> {
  const rows = await listRsvps();
  return rows.find((row) => row.id === id) ?? null;
}

export async function upsertRsvp(id: string | null, input: RsvpInput): Promise<Rsvp> {
  return withLock(async () => {
    const rows = await readRsvpsUnlocked();
    const now = new Date().toISOString();
    const existing = id ? rows.find((row) => row.id === id) : undefined;

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

    const next = existing
      ? rows.map((row) => (row.id === existing.id ? record : row))
      : [...rows, record];

    await writeJsonFile(RSVP_FILE, next);
    return record;
  });
}

export async function deleteRsvp(id: string): Promise<boolean> {
  return withLock(async () => {
    const rows = await readRsvpsUnlocked();
    const next = rows.filter((row) => row.id !== id);
    if (next.length === rows.length) {
      return false;
    }
    await writeJsonFile(RSVP_FILE, next);
    return true;
  });
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
