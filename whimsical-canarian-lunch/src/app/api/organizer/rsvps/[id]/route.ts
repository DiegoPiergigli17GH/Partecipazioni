import { isOrganizer } from "@/lib/auth";
import { deleteRsvp } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isOrganizer())) {
    return Response.json({ error: "Serve il PIN." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const deleted = await deleteRsvp(id);
  if (!deleted) {
    return Response.json({ error: "Risposta non trovata." }, { status: 404 });
  }

  return Response.json({ ok: true });
}
