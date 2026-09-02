import Link from "next/link";

import { RsvpForm } from "@/components/rsvp-form";
import { getOwnRsvp } from "@/lib/auth";
import { getEvent, toPublicEvent } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const [event, existing] = await Promise.all([getEvent(), getOwnRsvp()]);

  return (
    <main className="flex flex-1 flex-col justify-center py-4">
      <RsvpForm event={toPublicEvent(event)} existing={existing} />
      <p className="mt-10 text-center text-xs text-muted-foreground">
        <Link href="/pubblica" className="underline-offset-4 hover:text-foreground hover:underline">
          Come mandare il link
        </Link>
        {" · "}
        <Link href="/organizza" className="underline-offset-4 hover:text-foreground hover:underline">
          Sei chi organizza? Apri il riepilogo
        </Link>
      </p>
    </main>
  );
}
