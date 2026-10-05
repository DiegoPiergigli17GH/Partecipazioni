import { BanquetRegister } from "@/components/banquet-register";
import { RsvpForm } from "@/components/rsvp-form";
import { getOwnRsvp } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const existing = await getOwnRsvp();

  return (
    <main className="flex flex-1 flex-col justify-center py-4">
      <RsvpForm existing={existing} />
      <p className="mx-auto mt-10 max-w-xl text-center text-sm font-bold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
        Le mancate risposte verranno giudicate dal Consiglio dei Cinghiali Selvatici
      </p>
      <BanquetRegister />
    </main>
  );
}
