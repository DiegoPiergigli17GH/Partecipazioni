import type { EventInfo } from "@/lib/types";

export const DEFAULT_EVENT: EventInfo = {
  title: "Pranzo del 13 settembre",
  host: "Diego",
  date: "2026-09-13",
  time: "13:00",
  place: "",
  note: "Fammi sapere se ci sei, se mangi vegetariano e quante birre bevi — così organizzo tavolo, menu e spesa senza inseguire messaggi.",
  pin: "1309",
};

export const RSVP_COOKIE = "pranzo_rsvp_id";
export const ORGANIZER_COOKIE = "pranzo_organizer";
export const MAX_BEERS = 10;
export const MAX_NAME = 80;
export const MAX_NOTES = 400;
