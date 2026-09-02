import { CalendarDaysIcon, Clock3Icon, MapPinIcon } from "lucide-react";

import { formatEventDate, formatTime } from "@/lib/format";
import type { PublicEvent } from "@/lib/types";

export function InvitationHeader({ event }: { event: PublicEvent }) {
  const when = formatEventDate(event.date);
  const time = formatTime(event.time);

  return (
    <header className="text-center">
      <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-primary uppercase">
        Un pranzo insieme
      </p>
      <h1 className="font-heading mt-3 text-4xl leading-[1.1] text-balance sm:text-5xl">{event.title}</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Organizzato da <span className="text-foreground">{event.host}</span>
      </p>

      <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-2xl bg-card/70 px-3 py-3 ring-1 ring-foreground/8">
          <dt className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <CalendarDaysIcon className="size-3.5" />
            Quando
          </dt>
          <dd className="mt-1 font-medium capitalize">{when}</dd>
        </div>
        <div className="rounded-2xl bg-card/70 px-3 py-3 ring-1 ring-foreground/8">
          <dt className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Clock3Icon className="size-3.5" />
            Orario
          </dt>
          <dd className="mt-1 font-medium">{time || "Da confermare"}</dd>
        </div>
        <div className="rounded-2xl bg-card/70 px-3 py-3 ring-1 ring-foreground/8">
          <dt className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            Dove
          </dt>
          <dd className="mt-1 font-medium">{event.place || "Luogo in arrivo"}</dd>
        </div>
      </dl>

      {event.note ? (
        <p className="mt-6 text-pretty text-[0.95rem] leading-7 text-foreground/80">{event.note}</p>
      ) : null}
    </header>
  );
}
