import { listBanquetEntries } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guests = await listBanquetEntries();
  return Response.json({ guests });
}
