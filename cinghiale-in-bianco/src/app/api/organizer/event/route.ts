import { isOrganizer } from "@/lib/auth";
import { toPublicEvent, updateEvent } from "@/lib/store";
import { parseEventPatch } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  if (!(await isOrganizer())) {
    return Response.json({ error: "Serve il PIN." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const parsed = parseEventPatch(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const event = await updateEvent(parsed.value);
  return Response.json({ event: toPublicEvent(event) });
}
