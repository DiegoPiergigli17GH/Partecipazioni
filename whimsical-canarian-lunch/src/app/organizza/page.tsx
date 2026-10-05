import type { Metadata } from "next";

import { OrganizerApp } from "@/components/organizer-app";

export const metadata: Metadata = {
  title: "Riepilogo pranzo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function OrganizerPage() {
  return (
    <main className="flex flex-1 flex-col py-2">
      <OrganizerApp />
    </main>
  );
}
