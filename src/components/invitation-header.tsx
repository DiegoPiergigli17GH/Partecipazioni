import type { ReactNode } from "react"
import { CalendarDaysIcon, Clock3Icon, MapPinIcon } from "lucide-react"

import { EVENT } from "@/lib/event"

export function InvitationHeader() {
  return (
    <header className="space-y-4">
      <div className="glass rounded-[1.6rem] px-5 py-6 text-center sm:px-7">
        <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-primary uppercase">
          {EVENT.kicker}
        </p>
        <h1 className="font-heading mt-3 text-4xl leading-[1.1] text-balance sm:text-5xl">
          {EVENT.title}
        </h1>
        <p className="mt-3 text-base font-medium text-foreground/90">{EVENT.subtitle}</p>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-3 sm:items-stretch">
        <InfoBox
          icon={<CalendarDaysIcon className="size-3.5" />}
          label={EVENT.whenLabel}
          value={EVENT.when}
        />
        <InfoBox
          icon={<Clock3Icon className="size-3.5" />}
          label={EVENT.timeLabel}
          value={EVENT.time}
        />
        <div className="glass flex h-full flex-col items-center justify-center rounded-2xl px-3 py-3 text-center">
          <dt className="flex items-center justify-center gap-1.5 font-medium text-foreground/80">
            <MapPinIcon className="size-3.5" />
            {EVENT.whereLabel}
          </dt>
          <dd className="mt-1 font-medium text-balance">
            <a
              href={EVENT.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {EVENT.where}
            </a>
          </dd>
        </div>
      </dl>
    </header>
  )
}

export function CastleNote() {
  return (
    <div className="glass space-y-3 rounded-[1.6rem] px-5 py-5 text-center text-[0.95rem] font-medium leading-7 text-foreground sm:px-7">
      <p>
        E&apos; preferibile lasciare carrozza e destrieri al parcheggio
        dell&apos;ex Why Not, per non fomentare il caos lungo la via del
        castello.
      </p>
      <p>Chi si presenta a cavallo può stallarlo direttamente in cortile.</p>
    </div>
  )
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="glass flex h-full flex-col items-center justify-center rounded-2xl px-3 py-3 text-center">
      <dt className="flex items-center justify-center gap-1.5 font-medium text-foreground/80">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-medium text-balance">{value}</dd>
    </div>
  )
}
