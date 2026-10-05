import { cookies } from "next/headers";

import { ORGANIZER_COOKIE, RSVP_COOKIE } from "@/lib/defaults";
import { getEvent, getRsvp } from "@/lib/store";
import type { Rsvp } from "@/lib/types";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export async function readRsvpId(): Promise<string | null> {
  const store = await cookies();
  return store.get(RSVP_COOKIE)?.value ?? null;
}

export async function setRsvpCookie(id: string) {
  const store = await cookies();
  store.set(RSVP_COOKIE, id, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 90,
  });
}

export async function clearRsvpCookie() {
  const store = await cookies();
  store.delete(RSVP_COOKIE);
}

export async function getOwnRsvp(): Promise<Rsvp | null> {
  const id = await readRsvpId();
  if (!id) {
    return null;
  }
  return getRsvp(id);
}

export async function isOrganizer(): Promise<boolean> {
  const store = await cookies();
  return store.get(ORGANIZER_COOKIE)?.value === "ok";
}

export async function setOrganizerCookie() {
  const store = await cookies();
  store.set(ORGANIZER_COOKIE, "ok", {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearOrganizerCookie() {
  const store = await cookies();
  store.delete(ORGANIZER_COOKIE);
}

export async function checkPin(pin: string): Promise<boolean> {
  const event = await getEvent();
  return pin.trim() === event.pin;
}

export async function requireOrganizer(): Promise<boolean> {
  return isOrganizer();
}
