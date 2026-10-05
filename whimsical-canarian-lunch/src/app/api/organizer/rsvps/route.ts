import { isOrganizer } from "@/lib/auth";
import { getEvent, listRsvps, summarize, toPublicEvent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOrganizer())) {
    return Response.json({ error: "Serve il PIN." }, { status: 401 });
  }

  const [event, rsvps] = await Promise.all([getEvent(), listRsvps()]);
  return Response.json({
    event: toPublicEvent(event),
    rsvps: [...rsvps].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    totals: summarize(rsvps),
  });
}
