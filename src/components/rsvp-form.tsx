"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";

import { BeerStepper } from "@/components/beer-stepper";
import { ChoiceCards } from "@/components/choice-cards";
import { CastleNote, InvitationHeader } from "@/components/invitation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_NOTES } from "@/lib/defaults";
import { publicError, readJson } from "@/lib/http";
import type { Attendance, Rsvp } from "@/lib/types";

type Diet = "omni" | "veg";

type FormState = {
  name: string;
  attending: Attendance | "";
  diet: Diet | "";
  beers: number;
  notes: string;
};

function fromRsvp(rsvp: Rsvp | null): FormState {
  return {
    name: rsvp?.name ?? "",
    attending: rsvp?.attending ?? "",
    diet: rsvp ? (rsvp.vegetarian ? "veg" : "omni") : "",
    beers: rsvp?.beers ?? 0,
    notes: rsvp?.notes ?? "",
  };
}

export function RsvpForm({ existing }: { existing: Rsvp | null }) {
  const [form, setForm] = useState<FormState>(() => fromRsvp(existing));
  const [saved, setSaved] = useState<Rsvp | null>(existing);
  const [editing, setEditing] = useState(!existing);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seated = form.attending === "yes";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) {
      setError("Scrivi nome e cognome.");
      return;
    }
    if (!form.attending) {
      setError("Dimmi se ci sei oppure no.");
      return;
    }
    if (form.attending === "yes" && !form.diet) {
      setError("Scegli Fauce Draconica o Grazia Druidica.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          attending: form.attending,
          vegetarian: form.diet === "veg",
          beers: form.beers,
          notes: form.notes,
        }),
      });
      const data = await readJson<{ rsvp?: Rsvp; error?: string }>(
        response,
        "Invio fallito, riprova.",
      );
      if (!response.ok || !data.rsvp) {
        throw new Error(data.error || "Invio fallito, riprova.");
      }
      setSaved(data.rsvp);
      setEditing(false);
    } catch (err) {
      setError(publicError(err, "Invio fallito, riprova."));
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
        diet: "",
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

  if (saved && !editing) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <InvitationHeader />
        <section className="glass rounded-[1.6rem] px-5 py-6 sm:px-7">
          <div className="flex items-start gap-3">
            <CheckCircle2Icon className="mt-0.5 size-6 text-primary" />
            <div>
              <p className="text-sm leading-6">
                {saved.attending === "yes"
                  ? "Pergamena spedita. Nome tracciato nel Registro del Banchetto."
                  : "Incantesimo di evocazione dissolto."}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button type="button" className="h-11 flex-1 rounded-xl" onClick={() => setEditing(true)}>
                  Modifica la risposta
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-xl bg-white/70"
                  onClick={replyForSomeoneElse}
                  disabled={pending}
                >
                  Rispondi per un’altra persona
                </Button>
              </div>
            </div>
          </div>
        </section>
        <CastleNote />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <InvitationHeader />

      <form
        noValidate
        onSubmit={onSubmit}
        className="glass rounded-[1.6rem] px-5 py-6 sm:px-7"
      >
        <div className="mb-6">
          <h2 className="font-heading text-2xl">Rispondi alla Convocazione</h2>
          <p className="mt-1 text-sm font-medium text-foreground/85">
            Compila la pergamena per tracciare il tuo nome nel Registro del Banchetto
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Identità Arcanica</Label>
            <Input
              id="name"
              name="guestName"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="h-11 rounded-xl bg-white/75 px-3 text-base md:text-base"
              placeholder="Es. Divino Otelma"
            />
          </div>

          <div className="space-y-2">
            <Label>Convocazione</Label>
            <ChoiceCards
              name="Convocazione"
              value={form.attending}
              onChange={(attending) =>
                setForm((current) => ({
                  ...current,
                  attending,
                  diet: attending === "no" ? "" : current.diet,
                  beers: attending === "no" ? 0 : current.beers,
                }))
              }
              options={[
                { value: "yes", label: "Apponi il Sigillo", hint: "aggiungi una coppa" },
                { value: "no", label: "Dissolvi l'Incantesimo di evocazione" },
              ]}
            />
          </div>

          {seated ? (
            <>
              <div className="space-y-2">
                <Label>Specifiche Alchemiche</Label>
                <ChoiceCards
                  name="Specifiche Alchemiche"
                  value={form.diet}
                  onChange={(diet) => setForm((current) => ({ ...current, diet }))}
                  options={[
                    { value: "omni", label: "Fauce Draconica", hint: "mangia di tutto" },
                    { value: "veg", label: "Grazia Druidica", hint: "solo vegetale" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label>Elisir di Godog</Label>
                <BeerStepper
                  value={form.beers}
                  onChange={(beers) => setForm((current) => ({ ...current, beers }))}
                />
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="notes">Note: Restrizioni Arcane & Vettovaglie</Label>
            <Textarea
              id="notes"
              value={form.notes}
              maxLength={MAX_NOTES}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              className="min-h-24 rounded-xl bg-white/75 px-3 text-base md:text-base"
              placeholder="Es: intolleranza alle radici, indisposizione al brodo di zoccoli.."
            />
          </div>

          {error ? (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-base"
            disabled={pending || !form.attending || (seated && !form.diet)}
          >
            {pending ? <Loader2Icon className="animate-spin" /> : null}
            Spedisci la pergamena
          </Button>
        </div>
      </form>

      <CastleNote />

      {seated ? (
        <div className="glass space-y-3 rounded-2xl px-4 py-3 text-center text-sm font-bold leading-6 text-foreground">
          <p>Non bisogna portare nulla, ma siete liberi di farlo.</p>
          <p>Sono gradite misture frizzanti, distillati di mana, decotti spiritati.</p>
          <p>Fiale alle erbe magiche sono permesse e auspicabili.</p>
          <p>Munitevi dei vostri talismani di carta e delle rune di gioco, per chi vorrà tentare il destino.</p>
        </div>
      ) : null}
    </div>
  );
}
