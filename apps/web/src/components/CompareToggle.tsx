import { Check, Plus } from "@phosphor-icons/react";
import { useCompare } from "@/lib/compare-store";
import { cn } from "cn";

/** Adds or removes a Pair from the compare tray. Three at most. */
export function CompareToggle({
  slug,
  label,
  className,
}: {
  slug: string;
  label: string;
  className?: string;
}) {
  const { isSelected, toggle, full } = useCompare();
  const on = isSelected(slug);
  const blocked = !on && full;

  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={blocked}
      title={blocked ? "You can compare up to 3 Pairs" : undefined}
      aria-label={on ? `Remove ${label} from the comparison` : `Compare ${label}`}
      onClick={() => toggle({ slug, label })}
      className={cn(
        "border-border inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
        on
          ? "border-foreground bg-card text-foreground"
          : "bg-card/90 text-foreground hover:bg-muted backdrop-blur-sm",
        className,
      )}
    >
      {on ? <Check weight="bold" aria-hidden className="size-3.5" /> : <Plus weight="bold" aria-hidden className="size-3.5" />}
      Compare
    </button>
  );
}
