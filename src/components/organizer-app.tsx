"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  BeerIcon,
  CopyIcon,
  DownloadIcon,
  LeafIcon,
  Loader2Icon,
  LogOutIcon,
  UsersIcon,
  UserXIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { beerLabel, formatDateTime } from "@/lib/format";
import type { PublicEvent, Rsvp, Totals } from "@/lib/types";

function subscribeShareable() {
  return () => undefined;
}

function shareableSnapshot() {
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

function shareableServerSnapshot() {
  return true;
}

type Dashboard = {
  event: PublicEvent;
  rsvps: Rsvp[];
  totals: Totals;
};

export function OrganizerApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<Dashboard | null>(null);
  const [eventForm, setEventForm] = useState<PublicEvent | null>(null);
  const [newPin, setNewPin] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const shareable = useSyncExternalStore(subscribeShareable, shareableSnapshot, shareableServerSnapshot);
  const [copied, setCopied] = useState(false);
  const [persistence, setPersistence] = useState<string | null>(null);

  async function loadDashboard() {
    const response = await fetch("/api/organizer/rsvps");
    if (response.status === 401) {
      setAuthed(false);
      setData(null);
      return false;
    }
    const json = (await response.json()) as Dashboard & { error?: string };
    if (!response.ok) {
      throw new Error(json.error || "Non riesco a leggere le risposte.");
    }
    setAuthed(true);
    setData(json);
    setEventForm(json.event);
    return true;
  }

  useEffect(() => {
    void fetch("/api/status")
      .then((response) => response.json())
      .then((json: { persistence?: string }) => {
        if (json.persistence) {
          setPersistence(json.persistence);
        }
      })
      .catch(() => undefined);

    let cancelled = false;
    (async () => {
      try {
        await loadDashboard();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Errore di caricamento.");
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/organizer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error || "PIN sbagliato.");
      }
      setPin("");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Accesso non riuscito.");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/organizer/session", { method: "DELETE" });
    setAuthed(false);
    setData(null);
  }

  async function saveEvent(e: FormEvent) {
    e.preventDefault();
    if (!eventForm) {
      return;
    }
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/organizer/event", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          pin: newPin.trim() ? newPin.trim() : undefined,
        }),
      });
      const json = (await response.json()) as { event?: PublicEvent; error?: string };
      if (!response.ok || !json.event) {
        throw new Error(json.error || "Salvataggio non riuscito.");
      }
      setEventForm(json.event);
      setNewPin("");
      setNotice(newPin.trim() ? "Dettagli e PIN aggiornati." : "Dettagli aggiornati.");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Salvataggio non riuscito.");
    } finally {
      setPending(false);
    }
  }

  async function removeRsvp(id: string, name: string) {
    if (!window.confirm(`Tolgo la risposta di ${name}?`)) {
      return;
    }
    setError(null);
    const response = await fetch(`/api/organizer/rsvps/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      setError(json.error || "Non sono riuscito a cancellare.");
      return;
    }
    await loadDashboard();
  }

  async function copyLink() {
    if (!shareable) {
      setError("Questo è l’indirizzo locale: gli invitati non lo aprono. Prima pubblica il sito.");
      return;
    }
    await navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const csv = useMemo(() => {
    if (!data) {
      return "";
    }
    const header = ["Nome", "Presenza", "Vegetariano", "Birre", "Note", "Aggiornato"];
    const rows = data.rsvps.map((row) => [
      row.name,
      row.attending === "yes" ? "Ci sono" : "Non posso",
      row.attending === "yes" && row.vegetarian ? "Sì" : "No",
      String(row.attending === "yes" ? row.beers : 0),
      row.notes,
      formatDateTime(row.updatedAt),
    ]);
    return [header, ...rows]
      .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
  }, [data]);

  function downloadCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "partecipazioni-pranzo.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Apro il riepilogo…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="text-center">
          <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-primary uppercase">Solo per te</p>
          <h1 className="font-heading mt-3 text-4xl">Riepilogo pranzo</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Qui vedi chi c’è, i vegetariani e quante birre prendere. Il PIN predefinito è <span className="font-medium text-foreground">1309</span>.
          </p>
        </div>
        {!shareable ? (
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm leading-6 text-foreground">
            Questo Preview lo vedi solo tu. Per mandare il modulo in chat serve un link pubblico, gratis, senza comprare un dominio.{" "}
            <Link href="/pubblica" className="font-medium underline underline-offset-4">
              Come pubblicarlo
            </Link>
          </div>
        ) : null}
        <form
          onSubmit={login}
          className="rounded-[1.6rem] bg-card px-5 py-6 shadow-[0_18px_50px_-28px_rgba(92,46,21,0.45)] ring-1 ring-foreground/8"
        >
          <Label htmlFor="pin">PIN organizzatore</Label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="mt-2 h-11 rounded-xl px-3 text-base md:text-base"
            placeholder="1309"
          />
          {error ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="mt-4 h-11 w-full rounded-xl" disabled={pending || pin.trim().length < 4}>
            {pending ? <Loader2Icon className="animate-spin" /> : null}
            Entra
          </Button>
        </form>
        <p className="text-center text-sm">
          <Link href="/pubblica" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Come mandare il link agli invitati
          </Link>
          {" · "}
          <Link href="/" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Torna al modulo per gli invitati
          </Link>
        </p>
      </div>
    );
  }

  if (!data || !eventForm) {
    return (
      <p className="text-center text-destructive" role="alert">
        {error || "Non riesco a caricare il riepilogo."}
      </p>
    );
  }

  const coming = data.rsvps.filter((row) => row.attending === "yes");
  const declined = data.rsvps.filter((row) => row.attending === "no");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-primary uppercase">Organizzatore</p>
          <h1 className="font-heading mt-2 text-4xl text-balance">{eventForm.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Conta le persone, il menu e le birre senza aprire una chat.</p>
          {!shareable ? (
            <p className="mt-2 text-sm text-destructive">
              Non mandare questo indirizzo: è locale.{" "}
              <Link href="/pubblica" className="underline underline-offset-4">
                Pubblica il sito
              </Link>{" "}
              e poi copia il link .vercel.app.
            </p>
          ) : null}
          {shareable && persistence === "ephemeral" ? (
            <p className="mt-2 text-sm text-destructive">
              Le risposte qui possono sparire. Su Vercel crea uno Storage → Blob Store e rifai il deploy.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => void loadDashboard()}>
            Aggiorna
          </Button>
          <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={copyLink}>
            <CopyIcon />
            {copied ? "Link copiato" : shareable ? "Copia link invitati" : "Link ancora locale"}
          </Button>
          <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={downloadCsv} disabled={data.rsvps.length === 0}>
            <DownloadIcon />
            CSV
          </Button>
          <Button type="button" variant="ghost" className="h-10 rounded-xl" nativeButton={false} render={<Link href="/" />}>
            Vedi il modulo
          </Button>
          <Button type="button" variant="ghost" className="h-10 rounded-xl" onClick={logout}>
            <LogOutIcon />
            Esci
          </Button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<UsersIcon className="size-4" />} label="Ci sono" value={String(data.totals.coming)} hint={`${data.totals.replies} risposte in tutto`} />
        <Stat icon={<UserXIcon className="size-4" />} label="Non possono" value={String(data.totals.declined)} hint="Così non li aspetti" />
        <Stat icon={<LeafIcon className="size-4" />} label="Vegetariani" value={String(data.totals.vegetarian)} hint="Tra chi viene" />
        <Stat icon={<BeerIcon className="size-4" />} label="Birre" value={String(data.totals.beers)} hint="Da mettere in fresco" />
      </section>

      {data.rsvps.length === 0 ? (
        <section className="rounded-[1.6rem] bg-card px-6 py-12 text-center ring-1 ring-foreground/8">
          <h2 className="font-heading text-2xl">Ancora nessuno ha risposto</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Copia il link della home e mandalo in chat. Le risposte arrivano qui, in tempo reale dopo un aggiornamento della pagina.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <GuestList title="A tavola" empty="Nessuno si è ancora detto sì." rows={coming} onRemove={removeRsvp} coming />
          <GuestList title="Non ci saranno" empty="Per ora nessuno ha declinato." rows={declined} onRemove={removeRsvp} coming={false} />
        </div>
      )}

      <form
        onSubmit={saveEvent}
        className="rounded-[1.6rem] bg-card px-5 py-6 ring-1 ring-foreground/8 sm:px-7"
      >
        <h2 className="font-heading text-2xl">Dettagli del pranzo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Questi testi compaiono nel modulo che mandi agli invitati.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Titolo" id="title">
            <Input
              id="title"
              value={eventForm.title}
              onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Organizzatore" id="host">
            <Input
              id="host"
              value={eventForm.host}
              onChange={(event) => setEventForm({ ...eventForm, host: event.target.value })}
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Data" id="date">
            <Input
              id="date"
              type="date"
              value={eventForm.date}
              onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })}
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Orario" id="time">
            <Input
              id="time"
              type="time"
              value={eventForm.time}
              onChange={(event) => setEventForm({ ...eventForm, time: event.target.value })}
              className="h-11 rounded-xl"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Luogo" id="place">
              <Input
                id="place"
                value={eventForm.place}
                onChange={(event) => setEventForm({ ...eventForm, place: event.target.value })}
                className="h-11 rounded-xl"
                placeholder="Es. da Marco, via Roma 12"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Messaggio" id="note">
              <Textarea
                id="note"
                value={eventForm.note}
                onChange={(event) => setEventForm({ ...eventForm, note: event.target.value })}
                className="min-h-24 rounded-xl"
              />
            </Field>
          </div>
          <Field label="Nuovo PIN (facoltativo)" id="new-pin">
            <Input
              id="new-pin"
              type="password"
              value={newPin}
              onChange={(event) => setNewPin(event.target.value)}
              className="h-11 rounded-xl"
              placeholder="Lascia vuoto per non cambiarlo"
            />
          </Field>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <p className="mt-4 text-sm text-primary">{notice}</p> : null}
        <Button type="submit" className="mt-5 h-11 rounded-xl" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Salva dettagli
        </Button>
      </form>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/8">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="font-heading mt-2 text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function GuestList({
  title,
  empty,
  rows,
  coming,
  onRemove,
}: {
  title: string;
  empty: string;
  rows: Rsvp[];
  coming: boolean;
  onRemove: (id: string, name: string) => void;
}) {
  return (
    <section className="rounded-[1.6rem] bg-card px-5 py-5 ring-1 ring-foreground/8">
      <h2 className="font-heading text-xl">
        {title} <span className="text-muted-foreground">({rows.length})</span>
      </h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border/70">
          {rows.map((row) => (
            <li key={row.id} className="flex items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{row.name}</p>
                {coming ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {row.vegetarian ? "Vegetariano" : "Onnivoro"} · {beerLabel(row.beers)}
                  </p>
                ) : null}
                {row.notes ? <p className="mt-1 text-sm text-foreground/80">{row.notes}</p> : null}
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(row.updatedAt)}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(row.id, row.name)}>
                Togli
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
