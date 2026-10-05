import type { EventInfo } from "@/lib/types";

export const DEFAULT_EVENT: EventInfo = {
  title: "Whimsical Canarian Lunch",
  host: "Diego",
  date: "2026-09-13",
  time: "13:00",
  place: "Al Castello",
  note: "Si invita a lasciar sostare le vostre carrozze e i vostri destrieri presso l'ex Why Not, per non generare oscuri tumulti lungo il sentiero della rocca.",
  pin: "1309",
};

export const RSVP_COOKIE = "pranzo_rsvp_id";
export const ORGANIZER_COOKIE = "pranzo_organizer";
export const MAX_BEERS = 10;
export const MAX_NAME = 80;
export const MAX_NOTES = 400;
