import { promises as fs } from "fs";
import path from "path";
import { BlobNotFoundError, get, put } from "@vercel/blob";

import { DEFAULT_EVENT } from "@/lib/defaults";
import type { AppState, EventInfo, PersistenceMode } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const EVENT_FILE = path.join(DATA_DIR, "event.json");
const RSVP_FILE = path.join(DATA_DIR, "rsvps.json");
const BLOB_PATH = "pranzo-state.json";

let blobOk: boolean | null = null;
let memoryState: AppState | null = null;

export function wantsBlobStore(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL,
  );
}

export function currentPersistence(): PersistenceMode {
  if (blobOk === true) {
    return "blob";
  }
  if (wantsBlobStore() && blobOk === false) {
    return "ephemeral";
  }
  if (wantsBlobStore()) {
    return "blob";
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

async function readFromDisk(): Promise<AppState> {
  const combined = await readJsonFile<AppState>(STATE_FILE);
  if (combined && typeof combined === "object") {
    return {
      event: sanitizeEvent(combined.event),
      rsvps: Array.isArray(combined.rsvps) ? combined.rsvps : [],
    };
  }

  const event = sanitizeEvent((await readJsonFile<EventInfo>(EVENT_FILE)) ?? DEFAULT_EVENT);
  const rsvps = (await readJsonFile<AppState["rsvps"]>(RSVP_FILE)) ?? [];
  return { event, rsvps: Array.isArray(rsvps) ? rsvps : [] };
}

async function writeToDisk(state: AppState) {
  await writeJsonFile(STATE_FILE, state);
}

async function readFromBlob(): Promise<AppState> {
  try {
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return emptyState();
    }
    const text = await new Response(result.stream).text();
    if (!text.trim()) {
      return emptyState();
    }
    const parsed = JSON.parse(text) as AppState;
    return {
      event: sanitizeEvent(parsed.event),
      rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : [],
    };
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return emptyState();
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
  memoryState = {
    event: sanitizeEvent(state.event),
    rsvps: Array.isArray(state.rsvps) ? state.rsvps : [],
  };
  return memoryState;
}

export async function loadState(): Promise<AppState> {
  if (wantsBlobStore()) {
    try {
      const state = await readFromBlob();
      blobOk = true;
      return remember(state);
    } catch {
      blobOk = false;
      if (memoryState) {
        return memoryState;
      }
    }
  }

  try {
    return remember(await readFromDisk());
  } catch {
    return memoryState ?? emptyState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  remember(state);

  if (wantsBlobStore() && blobOk !== false) {
    try {
      await writeToBlob(state);
      blobOk = true;
      return;
    } catch {
      blobOk = false;
    }
  }

  try {
    await writeToDisk(state);
  } catch (error) {
    if (!wantsBlobStore()) {
      throw error;
    }
  }
}
