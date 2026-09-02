import type { EventInfo } from "@/lib/types";

export const DEFAULT_EVENT: EventInfo = {
  title: "Whimsical Canarian Lunch",
  host: "Diego",
  date: "2026-09-13",
  time: "13:00",
  place: "Al Castello",
  note: "E' preferibile lasciare carrozza e destrieri al parcheggio dell'ex Why Not, per non fomentare il caos lungo la via del castello.",
  pin: "1309",
};

export const RSVP_COOKIE = "pranzo_rsvp_id";
export const ORGANIZER_COOKIE = "pranzo_organizer";
export const MAX_BEERS = 10;
export const MAX_NAME = 80;
export const MAX_NOTES = 400;
