import { getEvent, toPublicEvent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const event = await getEvent();
  return Response.json({ event: toPublicEvent(event) });
}
