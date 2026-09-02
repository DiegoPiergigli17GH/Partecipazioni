"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2Icon, LeafIcon, Loader2Icon } from "lucide-react";

import { BeerStepper } from "@/components/beer-stepper";
import { ChoiceCards } from "@/components/choice-cards";
import { InvitationHeader } from "@/components/invitation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_NOTES } from "@/lib/defaults";
import { beerLabel } from "@/lib/format";
import type { Attendance, PublicEvent, Rsvp } from "@/lib/types";

type FormState = {
  name: string;
  attending: Attendance | "";
  vegetarian: boolean;
  beers: number;
  notes: string;
};

function fromRsvp(rsvp: Rsvp | null): FormState {
  return {
    name: rsvp?.name ?? "",
    attending: rsvp?.attending ?? "",
    vegetarian: rsvp?.vegetarian ?? false,
    beers: rsvp?.beers ?? 0,
    notes: rsvp?.notes ?? "",
  };
}

export function RsvpForm({ event, existing }: { event: PublicEvent; existing: Rsvp | null }) {
  const [form, setForm] = useState<FormState>(() => fromRsvp(existing));
  const [saved, setSaved] = useState<Rsvp | null>(existing);
  const [editing, setEditing] = useState(!existing);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          attending: form.attending,
          vegetarian: form.vegetarian,
          beers: form.beers,
          notes: form.notes,
        }),
      });
      const data = (await response.json()) as { rsvp?: Rsvp; error?: string };
      if (!response.ok || !data.rsvp) {
        throw new Error(data.error || "Non sono riuscito a salvare la risposta.");
      }
      setSaved(data.rsvp);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa è andato storto.");
    } finally {
      setPending(false);
    }
  }

  async function replyForSomeoneElse() {
    setPending(true);
    setError(null);
    try {
      await fetch("/api/rsvp", { method: "DELETE" });
      setSaved(null);
      setForm({
        name: "",
        attending: "",
        vegetarian: false,
        beers: 0,
        notes: "",
      });
      setEditing(true);
    } catch {
      setError("Non sono riuscito a preparare una nuova risposta.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <InvitationHeader event={event} />

      {saved && !editing ? (
        <section className="rounded-[1.6rem] bg-card px-5 py-6 shadow-[0_18px_50px_-28px_rgba(92,46,21,0.45)] ring-1 ring-foreground/8 sm:px-7">
          <div className="flex items-start gap-3">
            <CheckCircle2Icon className="mt-0.5 size-6 text-primary" />
            <div>
              <h2 className="font-heading text-2xl">Grazie, {saved.name.split(" ")[0]}.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {saved.attending === "yes"
                  ? `Ci sei. ${saved.vegetarian ? "Menu vegetariano. " : ""}${saved.beers === 0 ? "Niente birra." : `Birre: ${beerLabel(saved.beers)}.`} Se cambia qualcosa, aggiorna pure.`
                  : "Peccato non vederti: ho segnato che non ci sei. Se le cose cambiano, torna qui e aggiorna."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button type="button" className="h-11 flex-1" onClick={() => setEditing(true)}>
              Modifica la risposta
            </Button>
            <Button type="button" variant="outline" className="h-11 flex-1" onClick={replyForSomeoneElse} disabled={pending}>
              Rispondi per un’altra persona
            </Button>
          </div>
        </section>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-[1.6rem] bg-card px-5 py-6 shadow-[0_18px_50px_-28px_rgba(92,46,21,0.45)] ring-1 ring-foreground/8 sm:px-7"
        >
          <div className="mb-6">
            <h2 className="font-heading text-2xl">Ci sei?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {saved ? "Puoi aggiornare quello che avevi già mandato." : "Un minuto e hai fatto. Poi mandami il link anche agli altri."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome e cognome</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="h-11 rounded-xl px-3 text-base md:text-base"
                placeholder="Es. Anna Bianchi"
              />
            </div>

            <div className="space-y-2">
              <Label>Partecipazione</Label>
              <ChoiceCards
                name="Partecipazione"
                value={form.attending}
                onChange={(attending) =>
                  setForm((current) => ({
                    ...current,
                    attending,
                    vegetarian: attending === "no" ? false : current.vegetarian,
                    beers: attending === "no" ? 0 : current.beers,
                  }))
                }
                options={[
                  { value: "yes", label: "Ci sono", hint: "Segnami a tavola" },
                  { value: "no", label: "Non posso", hint: "Questa volta salto" },
                ]}
              />
            </div>

            {form.attending === "yes" ? (
              <>
                <div className="space-y-2">
                  <Label>Cosa mangi</Label>
                  <ChoiceCards
                    name="Menu"
                    value={form.vegetarian ? "veg" : "omni"}
                    onChange={(value) => setForm((current) => ({ ...current, vegetarian: value === "veg" }))}
                    options={[
                      { value: "omni", label: "Onnivoro", hint: "Mangio di tutto" },
                      { value: "veg", label: "Vegetariano", hint: "Senza carne e pesce" },
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quante birre bevi</Label>
                  <BeerStepper
                    value={form.beers}
                    onChange={(beers) => setForm((current) => ({ ...current, beers }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Metti 0 se non bevi. Serve per la spesa, non per tenerti il conto.
                  </p>
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="notes">Note {form.attending === "yes" ? "(allergie, intolleranze, altro)" : "(facoltative)"}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                maxLength={MAX_NOTES}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                className="min-h-24 rounded-xl px-3 text-base md:text-base"
                placeholder={
                  form.attending === "yes"
                    ? "Es. intolleranza al lattosio, arrivo un po’ dopo…"
                    : "Se vuoi lasciare un saluto"
                }
              />
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="h-12 w-full rounded-xl text-base" disabled={pending || !form.attending}>
              {pending ? <Loader2Icon className="animate-spin" /> : null}
              {saved ? "Aggiorna la risposta" : "Invia la risposta"}
            </Button>
          </div>
        </form>
      )}

      {form.attending === "yes" && editing ? (
        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <LeafIcon className="size-3.5" />
          Se porti qualcuno, invia anche la sua risposta oppure scrivilo nelle note.
        </p>
      ) : null}
    </div>
  );
}
