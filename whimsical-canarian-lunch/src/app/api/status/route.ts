import { wantsBlobStore } from "@/lib/state";
import { probePersistence } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    persistence: await probePersistence(),
    vercel: process.env.VERCEL === "1",
    blobConfigured: wantsBlobStore(),
  });
}
