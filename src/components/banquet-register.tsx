"use client";

import { useEffect, useId, useState } from "react";
import { XIcon } from "lucide-react";

import { elixirLabel } from "@/lib/format";
import { publicError, readJson } from "@/lib/http";
import type { BanquetEntry } from "@/lib/types";

export function BanquetRegister() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<BanquetEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    let cancelled = false;
    setError(null);
    void fetch("/api/register", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const data = await readJson<{ guests?: BanquetEntry[]; error?: string }>(
          response,
          "Il registro non si apre.",
        );
        if (!response.ok || !data.guests) {
          throw new Error(data.error || "Il registro non si apre.");
        }
        return data.guests;
      })
      .then((rows) => {
        if (!cancelled) {
          setGuests(rows);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(publicError(err, "Il registro non si apre."));
        }
      });

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        aria-label="Apri il Registro della Tavola"
        onClick={() => setOpen(true)}
        className="glass fixed right-3 bottom-3 z-20 flex items-end gap-1 rounded-2xl px-2 py-1.5 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:right-5 sm:bottom-5"
      >
        <ParchmentMark />
        <AmanitaMark />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Chiudi il registro"
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="glass relative z-10 w-full max-w-xl rounded-[1.6rem] px-5 py-6 sm:px-7"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <h2 id={titleId} className="font-heading text-2xl">
                Registro della Tavola
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-foreground/70 transition hover:bg-white/50 hover:text-foreground"
                aria-label="Chiudi"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : guests === null ? (
              <p className="text-sm font-medium text-foreground/80">Lo Stregone consulta il registro…</p>
            ) : guests.length === 0 ? (
              <p className="text-sm font-medium text-foreground/80">
                Nessun nome ancora inciso. La tavola attende il primo viandante.
              </p>
            ) : (
              <ul className="max-h-[min(24rem,60vh)] space-y-2 overflow-y-auto">
                {guests.map((guest, index) => (
                  <li
                    key={`${guest.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/40 px-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden
                        className={
                          guest.vegetarian
                            ? "size-2.5 shrink-0 rounded-full bg-emerald-600"
                            : "size-2.5 shrink-0 rounded-full bg-red-600"
                        }
                      />
                      <span className="truncate font-medium">{guest.name}</span>
                      <span className="sr-only">
                        {guest.vegetarian ? "vegetariano" : "onnivoro"}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-medium text-foreground/80">
                      {elixirLabel(guest.beers)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

function ParchmentMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <rect x="7" y="5" width="18" height="22" rx="1.5" fill="#f3e2b8" stroke="#b8893a" strokeWidth="1.2" />
      <path d="M7 8.2h18" stroke="#c9a05a" strokeWidth="1.1" />
      <path d="M7 23.8h18" stroke="#c9a05a" strokeWidth="1.1" />
      <path d="M11 12.4h10M11 16h10M11 19.6h7" stroke="#8a6a32" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AmanitaMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <path d="M13.2 17.5h5.6l.9 9.2c0 1.3-1.7 1.9-3.7 1.9s-3.7-.6-3.7-1.9l.9-9.2Z" fill="#f6efe2" stroke="#cdbb9b" strokeWidth="0.8" />
      <path d="M12.7 20.4c1.4.9 5.2.9 6.6 0l-.2 1.7c-1.3.7-4.9.7-6.2 0l-.2-1.7Z" fill="#e4d8c3" />
      <path d="M3.5 17.4C3.5 10 9.1 4.6 16 4.6S28.5 10 28.5 17.4c0 1-.8 1.6-1.8 1.6H5.3c-1 0-1.8-.6-1.8-1.6Z" fill="#cf2a1e" />
      <path d="M6.6 12.6c1.7-3.9 5.1-6.2 9.4-6.3" stroke="#ec5b46" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="10.4" cy="10.6" r="1.6" fill="#fbf6ec" />
      <circle cx="16.6" cy="8.4" r="1.3" fill="#fbf6ec" />
      <circle cx="22.2" cy="11.2" r="1.7" fill="#fbf6ec" />
      <circle cx="7.6" cy="15.6" r="1.1" fill="#fbf6ec" />
      <circle cx="14.2" cy="13.6" r="1.4" fill="#fbf6ec" />
      <circle cx="20" cy="15.8" r="1.2" fill="#fbf6ec" />
      <circle cx="25.4" cy="15.6" r="1" fill="#fbf6ec" />
    </svg>
  );
}
