import type { EventInfo } from "@/lib/types";

export const DEFAULT_EVENT: EventInfo = {
  title: "L'era del cinghiale in bianco",
  host: "Diego",
  date: "2026-09-13",
  time: "13:00",
  place: "Al Castello",
  note: "Si invita a lasciar riposare carrozze e destrieri presso l'ex Why Not: il sentiero della rocca è terra dei cinghiali selvatici, che non amano essere disturbati.",
  pin: "1309",
};

export const RSVP_COOKIE = "cinghiale_rsvp_id";
export const ORGANIZER_COOKIE = "cinghiale_organizer";
export const MAX_BEERS = 10;
export const MAX_NAME = 80;
export const MAX_NOTES = 400;
