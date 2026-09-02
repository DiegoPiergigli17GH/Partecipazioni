import { cn } from "@/lib/utils";

type Option<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

export function ChoiceCards<T extends string>({
  value,
  onChange,
  options,
  name,
}: {
  value: T | "";
  onChange: (value: T) => void;
  options: Option<T>[];
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-2xl border px-4 py-3.5 text-left transition-all",
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/80 bg-card/80 text-foreground hover:border-primary/40 hover:bg-card",
            )}
          >
            <span className="block font-heading text-lg leading-tight">{option.label}</span>
            {option.hint ? (
              <span className={cn("mt-1 block text-sm", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
