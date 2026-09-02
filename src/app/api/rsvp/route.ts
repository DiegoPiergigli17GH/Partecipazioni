import { clearRsvpCookie, getOwnRsvp, readRsvpId, setRsvpCookie } from "@/lib/auth";
import { upsertRsvp } from "@/lib/store";
import { parseRsvpInput } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rsvp = await getOwnRsvp();
  return Response.json({ rsvp });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const parsed = parseRsvpInput(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const existingId = await readRsvpId();
    const rsvp = await upsertRsvp(existingId, parsed.value);
    await setRsvpCookie(rsvp.id);
    return Response.json({ rsvp });
  } catch (error) {
    console.error("Failed to save RSVP", error);
    const detail = error instanceof Error ? error.message : "errore sconosciuto";
    return Response.json(
      { error: "Non sono riuscito a salvare la pergamena. Riprova.", detail },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  await clearRsvpCookie();
  return Response.json({ ok: true });
}
