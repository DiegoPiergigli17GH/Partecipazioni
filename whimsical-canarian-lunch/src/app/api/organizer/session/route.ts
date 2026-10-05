import { checkPin, clearOrganizerCookie, isOrganizer, setOrganizerCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: await isOrganizer() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const pin = typeof body === "object" && body && "pin" in body ? String((body as { pin: unknown }).pin ?? "") : "";
  if (!(await checkPin(pin))) {
    return Response.json({ error: "PIN sbagliato." }, { status: 401 });
  }

  await setOrganizerCookie();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearOrganizerCookie();
  return Response.json({ ok: true });
}
