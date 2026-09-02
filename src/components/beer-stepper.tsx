import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MAX_BEERS } from "@/lib/defaults"

export function BeerStepper({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="glass flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="size-11 rounded-xl bg-white/70"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        aria-label="Togli una boccetta"
      >
        <MinusIcon />
      </Button>
      <div className="min-w-28 text-center">
        <p className="font-heading text-3xl leading-none tabular-nums">{value}</p>
        <p className="mt-1 text-xs font-medium text-foreground/80">Boccette luppolate</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="size-11 rounded-xl bg-white/70"
        onClick={() => onChange(Math.min(MAX_BEERS, value + 1))}
        disabled={value >= MAX_BEERS}
        aria-label="Aggiungi una boccetta"
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
