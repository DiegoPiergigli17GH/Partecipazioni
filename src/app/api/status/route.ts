import { persistenceMode } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    persistence: persistenceMode(),
    vercel: process.env.VERCEL === "1",
  });
}
