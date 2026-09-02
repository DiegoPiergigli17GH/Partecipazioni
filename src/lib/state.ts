import { promises as fs } from "fs";
import path from "path";
import { BlobNotFoundError, get, put } from "@vercel/blob";

import { DEFAULT_EVENT } from "@/lib/defaults";
import type { AppState, EventInfo, PersistenceMode, Rsvp } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const EVENT_FILE = path.join(DATA_DIR, "event.json");
const RSVP_FILE = path.join(DATA_DIR, "rsvps.json");
const BLOB_PATH = "pranzo-state.json";

let blobOk: boolean | null = null;
let memoryState: AppState | null = null;

function envFlag(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function onVercel(): boolean {
  return Boolean(envFlag("VERCEL"));
}

export function wantsBlobStore(): boolean {
  return Boolean(envFlag("BLOB_READ_WRITE_TOKEN") || envFlag("BLOB_STORE_ID"));
}

export function currentPersistence(): PersistenceMode {
  if (blobOk === true) {
    return "blob";
  }
  if (wantsBlobStore() && blobOk !== false) {
    return "blob";
  }
  if (onVercel()) {
    return "ephemeral";
  }
  return "file";
}

export function sanitizeEvent(value: Partial<EventInfo> | null | undefined): EventInfo {
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

export function emptyState(): AppState {
  return { event: sanitizeEvent(DEFAULT_EVENT), rsvps: [] };
}

function cloneState(state: AppState): AppState {
  return {
    event: sanitizeEvent(state.event),
    rsvps: Array.isArray(state.rsvps) ? state.rsvps.map((row) => ({ ...row })) : [],
  };
}

function unionRsvps(...lists: Array<Rsvp[] | undefined>): Rsvp[] {
  const byId = new Map<string, Rsvp>();
  for (const list of lists) {
    for (const row of list ?? []) {
      if (!row?.id) {
        continue;
      }
      const prev = byId.get(row.id);
      if (!prev || String(row.updatedAt ?? "") > String(prev.updatedAt ?? "")) {
        byId.set(row.id, { ...row });
      }
    }
  }
  return [...byId.values()].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

function preferEvent(...events: Array<EventInfo | undefined>): EventInfo {
  for (const event of events) {
    if (event) {
      return sanitizeEvent(event);
    }
  }
  return sanitizeEvent(DEFAULT_EVENT);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
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

async function readFromDisk(): Promise<AppState | null> {
  const combined = await readJsonFile<AppState>(STATE_FILE);
  if (combined && typeof combined === "object") {
    return {
      event: sanitizeEvent(combined.event),
      rsvps: Array.isArray(combined.rsvps) ? combined.rsvps : [],
    };
  }

  const eventFile = await readJsonFile<EventInfo>(EVENT_FILE);
  const rsvpFile = await readJsonFile<AppState["rsvps"]>(RSVP_FILE);
  if (!eventFile && !rsvpFile) {
    return null;
  }

  return {
    event: sanitizeEvent(eventFile ?? DEFAULT_EVENT),
    rsvps: Array.isArray(rsvpFile) ? rsvpFile : [],
  };
}

async function writeToDisk(state: AppState) {
  await writeJsonFile(STATE_FILE, state);
}

async function readFromBlob(): Promise<AppState | null> {
  try {
    const result = await get(BLOB_PATH, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }
    const text = await new Response(result.stream).text();
    if (!text.trim()) {
      return null;
    }
    const parsed = JSON.parse(text) as AppState;
    return {
      event: sanitizeEvent(parsed.event),
      rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : [],
    };
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null;
    }
    throw error;
  }
}

async function writeToBlob(state: AppState) {
  await put(BLOB_PATH, JSON.stringify(state), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

function remember(state: AppState): AppState {
  memoryState = cloneState(state);
  return memoryState;
}

export async function loadState(): Promise<AppState> {
  let fromBlob: AppState | null = null;
  let fromDisk: AppState | null = null;

  if (wantsBlobStore()) {
    try {
      fromBlob = await readFromBlob();
      blobOk = true;
    } catch (error) {
      if (error instanceof BlobNotFoundError) {
        fromBlob = null;
        blobOk = true;
      } else {
        console.error("Failed to read RSVP blob", error);
        blobOk = false;
      }
    }
  }

  try {
    fromDisk = await readFromDisk();
  } catch {
    fromDisk = null;
  }

  const next: AppState = {
    event: preferEvent(fromBlob?.event, memoryState?.event, fromDisk?.event),
    rsvps: unionRsvps(fromBlob?.rsvps, memoryState?.rsvps, fromDisk?.rsvps),
  };

  remember(next);

  if (wantsBlobStore() && next.rsvps.length > (fromBlob?.rsvps.length ?? 0)) {
    try {
      await writeToBlob(next);
      blobOk = true;
    } catch (error) {
      console.error("Failed to backfill RSVP blob", error);
      blobOk = false;
    }
  }

  return cloneState(next);
}

export async function saveState(state: AppState): Promise<void> {
  remember(state);

  if (wantsBlobStore()) {
    try {
      await writeToBlob(state);
      blobOk = true;
    } catch (error) {
      blobOk = false;
      console.error("Failed to write RSVP blob", error);
      if (onVercel()) {
        throw error;
      }
    }
  } else if (onVercel()) {
    throw new Error("Memoria Blob non disponibile sul sito pubblicato.");
  }

  try {
    await writeToDisk(state);
  } catch (error) {
    if (blobOk === true) {
      return;
    }
    throw error;
  }
}
