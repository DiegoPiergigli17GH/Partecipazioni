export type Attendance = "yes" | "no";

export type EventInfo = {
  title: string;
  host: string;
  date: string;
  time: string;
  place: string;
  note: string;
  pin: string;
};

export type PublicEvent = Omit<EventInfo, "pin">;

export type Rsvp = {
  id: string;
  name: string;
  attending: Attendance;
  vegetarian: boolean;
  beers: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type RsvpInput = {
  name: string;
  attending: Attendance;
  vegetarian: boolean;
  beers: number;
  notes: string;
};

export type EventPatch = Partial<
  Pick<EventInfo, "title" | "host" | "date" | "time" | "place" | "note" | "pin">
>;

export type Totals = {
  replies: number;
  coming: number;
  declined: number;
  vegetarian: number;
  beers: number;
};

export type AppState = {
  event: EventInfo;
  rsvps: Rsvp[];
};

export type PersistenceMode = "file" | "blob" | "ephemeral";
